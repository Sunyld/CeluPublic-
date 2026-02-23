/**
 * AuthContext — autenticação estável (SaaS-grade state machine).
 *
 * STATE MACHINE:
 * - authStatus: 'booting' | 'anonymous' | 'authenticating' | 'authenticated'
 * - profileStatus: 'idle' | 'loading' | 'ready' | 'error'
 * - redirectStatus: 'idle' | 'redirecting'
 *
 * REGRAS ANTI-LOOP:
 * - Um único onAuthStateChange listener (useEffect com deps []).
 * - ensureProfileForSupabaseUser usa promise cache por userId (evita concorrência).
 * - Guards: lastProcessedUserIdRef + profileStatus para evitar re-execução.
 * - Timeout de segurança: 10s para ensureProfile, não trava tudo.
 *
 * PROVA SINGLETON:
 * - Loga clientId em 3 pontos (deve ser igual).
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useRef,
  type ReactNode,
} from 'react';
import type { User } from '../types';
import type { AccountType } from '../types';
import { storage } from '../lib/storage';
import { useApp } from './AppContext';
import { getSupabase, getSupabaseClientId, useSupabase } from '../lib/supabaseClient';
import { getUsersRepo } from '../lib/repositories/getUsersRepo';
import {
  generateAuthAttemptId,
  logAuthEvent,
  type AuthEventType,
} from '../lib/authInstrumentation';

export type RegisterPayload = {
  full_name: string;
  email: string;
  password: string;
  account_type: AccountType;
  whatsapp: string;
  province: string;
};

export type AuthStatus = 'booting' | 'anonymous' | 'authenticating' | 'authenticated';
export type ProfileStatus = 'idle' | 'loading' | 'ready' | 'error';
export type RedirectStatus = 'idle' | 'redirecting';

type AuthContextValue = {
  user: User | null;
  login: (email: string, password: string) => Promise<User | null>;
  logout: () => void | Promise<void>;
  register: (payload: RegisterPayload) => Promise<User | null>;
  isPending: boolean;
  isRejected: boolean;
  isBlocked: boolean;
  isAdmin: boolean;
  isApprovedSeller: boolean;
  /** @deprecated Use authStatus instead */
  authLoading: boolean;
  /** Estado da autenticação (state machine). */
  authStatus: AuthStatus;
  /** Estado do perfil. */
  profileStatus: ProfileStatus;
  /** Último erro de auth/perfil. */
  authError: string | null;
  /** Refetch current user profile. */
  refreshProfile: () => Promise<void>;
  /** Login com Google (Supabase OAuth). */
  loginWithGoogle: () => Promise<void>;
  /** Helper para obter redirect pós-login baseado no perfil. */
  getPostLoginRedirect: (profile?: User) => string;
};

const AuthContext = createContext<AuthContextValue | null>(null);

const USER_PASS_KEY = 'celupublic_user_pass';

function getStoredPass(userId: string): string | null {
  try {
    const raw = localStorage.getItem(USER_PASS_KEY);
    return raw ? (JSON.parse(raw) as Record<string, string>)[userId] ?? null : null;
  } catch {
    return null;
  }
}

function setStoredPass(userId: string, password: string) {
  try {
    const raw = localStorage.getItem(USER_PASS_KEY);
    const map: Record<string, string> = raw ? JSON.parse(raw) : {};
    map[userId] = password;
    localStorage.setItem(USER_PASS_KEY, JSON.stringify(map));
  } catch {
    // ignore
  }
}

const ADMIN_EMAIL = 'sunyldjosesomailamatapa@gmail.com';

export function AuthProvider({ children }: { children: ReactNode }) {
  const app = useApp();
  const { users, setUsers, refreshUsers } = app;

  // Prova singleton no boot (gerar attemptId apenas uma vez)
  const currentAttemptIdRef = useRef<string>(generateAuthAttemptId());
  if (process.env.NODE_ENV === 'development') {
    logAuthEvent(currentAttemptIdRef.current, 'SESSION_BEFORE', {
      clientId: getSupabaseClientId(),
      useSupabase,
      reason: 'auth_provider_boot',
    });
  }

  // ── STATE MACHINE ────────────────────────────────────────────────────────────
  const [authStatus, setAuthStatus] = useState<AuthStatus>(useSupabase ? 'booting' : 'anonymous');
  const [profileStatus, setProfileStatus] = useState<ProfileStatus>('idle');
  const [userId, setUserId] = useState<string | null>(() =>
    useSupabase ? null : storage.getCurrentUserId()
  );
  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);

  // Backward compatibility: authLoading = !(authStatus === 'authenticated' && profileStatus === 'ready')
  const authLoading = !(authStatus === 'authenticated' && profileStatus === 'ready');

  const repo = getUsersRepo();

  // ── ANTI-LOOP guards ─────────────────────────────────────────────────────────
  // userId já processado — evita re-chamar ensureProfile em TOKEN_REFRESHED
  const lastHandledUserIdRef = useRef<string | null>(null);
  // Promise cache por userId (evita concorrência)
  const ensureProfileCacheRef = useRef<Map<string, Promise<User | null>>>(new Map());
  // cooldown após falha (30s)
  const ensureFailedRef = useRef<Map<string, number>>(new Map());
  // Listener ref para garantir unsubscribe
  const listenerRef = useRef<{ unsubscribe: () => void } | null>(null);

  // ── useMemo ESTÁVEL do utilizador exposto ────────────────────────────────────
  const user = useMemo(() => {
    if (useSupabase) return profileUser;
    if (!userId) return null;
    return users.find((u) => u.id === userId) ?? null;
  }, [profileUser, userId, users]);

  // ── Helper: getPostLoginRedirect ────────────────────────────────────────────
  const getPostLoginRedirect = useCallback((profile?: User): string => {
    const p = profile ?? profileUser;
    if (!p) return '/';
    if (p.role === 'admin' && p.status === 'approved') return '/admin';
    if (p.status === 'approved') return '/vendedor';
    return '/ativacao';
  }, [profileUser]);

  // ── ensureProfileForSupabaseUser (com promise cache) ──────────────────────────
  // CRÍTICO: usa promise cache por userId para evitar concorrência
  const ensureProfileForSupabaseUser = useCallback(
    async (supabaseUser: { id: string; email?: string | null; user_metadata?: any }): Promise<User | null> => {
      const id = supabaseUser.id;
      const email = (supabaseUser.email ?? '').toLowerCase();
      const isAdminEmail = email === ADMIN_EMAIL;

      // Guard 1: promise cache (evita múltiplas chamadas simultâneas)
      const cached = ensureProfileCacheRef.current.get(id);
      if (cached) {
        logAuthEvent(currentAttemptIdRef.current, 'PROFILE_LOADING', {
          userId: id.slice(0, 8),
          cached: true,
        });
        return cached;
      }

      // Guard 2: falhou recentemente (30s cooldown)
      const failedAt = ensureFailedRef.current.get(id);
      if (failedAt && Date.now() - failedAt < 30_000) {
        logAuthEvent(currentAttemptIdRef.current, 'PROFILE_ERROR', {
          userId: id.slice(0, 8),
          reason: 'cooldown',
        });
        setProfileStatus('error');
        return null;
      }

      // Criar promise e cachear
      const promise = (async () => {
        setProfileStatus('loading');
        logAuthEvent(currentAttemptIdRef.current, 'PROFILE_LOADING', {
          userId: id.slice(0, 8),
        });

        try {
          const existing = await repo.getById(id);

          if (existing) {
            // eslint-disable-next-line no-console
            console.log('[AUTH] ensureProfile - existing profile found:', {
              userId: id.slice(0, 8),
              role: existing.role,
              status: existing.status,
            });
            // Promoção de email admin (só se ainda não for admin)
            if (isAdminEmail && existing.role !== 'admin') {
              try {
                const updated = await repo.update(id, { role: 'admin', status: 'approved' });
                if (updated) {
                  await refreshUsers?.();
                  logAuthEvent(currentAttemptIdRef.current, 'PROFILE_READY', {
                    userId: id.slice(0, 8),
                    role: updated.role,
                    status: updated.status,
                  });
                  setProfileStatus('ready');
                  return updated;
                }
              } catch (err: any) {
                // eslint-disable-next-line no-console
                console.error('[AUTH] ensureProfile - admin promotion error:', {
                  userId: id.slice(0, 8),
                  code: err?.code,
                  message: err?.message,
                  status: err?.status,
                  statusCode: err?.statusCode,
                  fullError: err,
                });
                logAuthEvent(currentAttemptIdRef.current, 'PROFILE_ERROR', {
                  userId: id.slice(0, 8),
                  error: err?.code || err?.message,
                  step: 'admin_promotion',
                  fullError: String(err),
                });
                // Se erro RLS → sign out silencioso
                if (err?.code === '42P17' || err?.message?.includes('recursion')) {
                  await getSupabase()?.auth.signOut();
                  setAuthError('rls_profiles');
                  ensureFailedRef.current.set(id, Date.now());
                  setProfileStatus('error');
                  return null;
                }
              }
            }

            if (existing.status === 'blocked' || existing.status === 'suspended') {
              // eslint-disable-next-line no-console
              console.warn('[AUTH] ensureProfile - account blocked/suspended:', {
                userId: id.slice(0, 8),
                status: existing.status,
              });
              logAuthEvent(currentAttemptIdRef.current, 'PROFILE_ERROR', {
                userId: id.slice(0, 8),
                error: `account_${existing.status}`,
                step: 'account_status_check',
              });
              setAuthError(`Conta ${existing.status === 'blocked' ? 'bloqueada' : 'suspensa'}`);
              setProfileStatus('error');
              return null;
            }

            logAuthEvent(currentAttemptIdRef.current, 'PROFILE_READY', {
              userId: id.slice(0, 8),
              role: existing.role,
              status: existing.status,
            });
            setProfileStatus('ready');
            return existing;
          }

          // Criar perfil (primeira vez)
          const meta = (supabaseUser as any).user_metadata ?? {};
          const name = meta.full_name ?? meta.name ?? email ?? 'Utilizador';

          try {
            const created = await repo.create({
              id,
              email,
              name,
              role: isAdminEmail ? 'admin' : 'seller',
              status: isAdminEmail ? 'approved' : 'pending',
              accountType: 'seller',
              whatsapp: undefined,
              province: undefined,
            });
            await refreshUsers?.();
            ensureFailedRef.current.delete(id);
            logAuthEvent(currentAttemptIdRef.current, 'PROFILE_READY', {
              userId: id.slice(0, 8),
              role: created.role,
              status: created.status,
              created: true,
            });
            setProfileStatus('ready');
            return created;
          } catch (err: any) {
            // eslint-disable-next-line no-console
            console.error('[AUTH] ensureProfile - create profile error:', {
              userId: id.slice(0, 8),
              code: err?.code,
              message: err?.message,
              status: err?.status,
              statusCode: err?.statusCode,
              fullError: err,
            });
            logAuthEvent(currentAttemptIdRef.current, 'PROFILE_ERROR', {
              userId: id.slice(0, 8),
              error: err?.code || err?.message,
              step: 'create_profile',
              fullError: String(err),
            });
            if (err?.code === '42P17' || err?.message?.includes('recursion')) {
              await getSupabase()?.auth.signOut();
              setAuthError('rls_profiles');
            }
            ensureFailedRef.current.set(id, Date.now());
            setProfileStatus('error');
            return null;
          }
        } catch (err: any) {
          // eslint-disable-next-line no-console
          console.error('[AUTH] ensureProfile - unexpected error:', {
            userId: id.slice(0, 8),
            code: err?.code,
            message: err?.message,
            status: err?.status,
            statusCode: err?.statusCode,
            fullError: err,
          });
          logAuthEvent(currentAttemptIdRef.current, 'PROFILE_ERROR', {
            userId: id.slice(0, 8),
            error: err?.message || 'unknown',
            step: 'unexpected',
            fullError: String(err),
          });
          ensureFailedRef.current.set(id, Date.now());
          setProfileStatus('error');
          return null;
        }
      })();

      // Cachear promise
      ensureProfileCacheRef.current.set(id, promise);

      // Limpar cache após 5s (evita memory leak)
      setTimeout(() => {
        ensureProfileCacheRef.current.delete(id);
      }, 5000);

      return promise;
    },
    // CRÍTICO: sem profileUser nas deps → callback estável, sem re-render loop
    [repo, refreshUsers]
  );

  // ── Timeout de segurança: profileStatus não pode ficar loading > 10s ─────────
  useEffect(() => {
    if (!useSupabase) return;
    if (profileStatus !== 'loading') return;
    const t = setTimeout(() => {
      logAuthEvent(currentAttemptIdRef.current, 'PROFILE_ERROR', {
        reason: 'timeout',
        timeout: 10,
      });
      setAuthError((prev) => prev ?? 'profile_timeout');
      setProfileStatus('error');
      // Não travar tudo: manter authStatus como 'authenticated' se tiver sessão
      if (authStatus === 'authenticating') {
        setAuthStatus('authenticated');
      }
    }, 10_000);
    return () => clearTimeout(t);
  }, [profileStatus, authStatus]);

  // ── Sync userId com storage (modo local) ────────────────────────────────────
  useEffect(() => {
    if (!useSupabase) {
      storage.setCurrentUserId(userId);
      return;
    }
    repo.setCurrentUserId(profileUser?.id ?? null);
  }, [userId, profileUser?.id, repo]);

  // ── Bootstrap: getSession + onAuthStateChange (único listener) ───────────────
  useEffect(() => {
    if (!useSupabase) {
      setAuthStatus('anonymous');
      setProfileStatus('idle');
      return;
    }
    const supabase = getSupabase();
    if (!supabase) {
      setAuthStatus('anonymous');
      setProfileStatus('idle');
      return;
    }

    let cancelled = false;
    setAuthError(null);

    // PRIORIDADE: getSession() no arranque (lê do localStorage → persistência)
    supabase.auth.getSession().then(async ({ data: { session }, error: sessErr }) => {
      if (cancelled) return;

      if (sessErr) {
        // eslint-disable-next-line no-console
        console.error('[AUTH] getSession error:', sessErr);
        logAuthEvent(currentAttemptIdRef.current, 'SESSION_AFTER', {
          error: sessErr.message,
          reason: 'getSession_error',
        });
        setAuthStatus('anonymous');
        setProfileStatus('idle');
        return;
      }

      logAuthEvent(currentAttemptIdRef.current, 'SESSION_AFTER', {
        hasSession: !!session,
        userId: session?.user?.id ? session.user.id.slice(0, 8) + '...' : null,
        reason: 'getSession_success',
      });

      if (session?.user?.id) {
        setAuthStatus('authenticated');
        // Só carrega perfil se ainda não foi tratado este userId
        if (lastHandledUserIdRef.current !== session.user.id) {
          lastHandledUserIdRef.current = session.user.id;
          const profile = await ensureProfileForSupabaseUser(session.user);
          if (!cancelled) {
            repo.setCurrentUserId(profile?.id ?? null);
            setProfileUser(profile);
          }
        } else {
          // Já tratado → re-fetch simples
          const existing = await repo.getById(session.user.id);
          if (!cancelled) {
            repo.setCurrentUserId(existing?.id ?? null);
            setProfileUser(existing ?? null);
            setProfileStatus(existing ? 'ready' : 'error');
          }
        }
      } else {
        if (!cancelled) {
          setAuthStatus('anonymous');
          setProfileStatus('idle');
        }
      }
    });

    // ÚNICO listener onAuthStateChange (registrado UMA vez)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (cancelled) return;

      logAuthEvent(currentAttemptIdRef.current, event as AuthEventType, {
        userId: session?.user?.id ? session.user.id.slice(0, 8) + '...' : null,
      });

      if (event === 'SIGNED_OUT') {
        lastHandledUserIdRef.current = null;
        ensureFailedRef.current.clear();
        ensureProfileCacheRef.current.clear();
        repo.setCurrentUserId(null);
        if (!cancelled) {
          setProfileUser(null);
          setAuthError(null);
          setAuthStatus('anonymous');
          setProfileStatus('idle');
        }
        return;
      }

      if (event === 'TOKEN_REFRESHED') {
        // Token renovado automaticamente → não re-chama ensureProfile
        // Apenas garantir que estados estão corretos
        if (!cancelled && authStatus === 'authenticated' && profileStatus === 'ready') {
          // Tudo ok, não fazer nada
        }
        return;
      }

      if (event === 'SIGNED_IN' && session?.user?.id) {
        const currentUserId = session.user.id;
        setAuthStatus('authenticated');

        // Skip se já tratámos este userId (evita loop em re-renders)
        if (lastHandledUserIdRef.current === currentUserId && profileStatus === 'ready') {
          return;
        }

        // Cooldown após falha
        const failedAt = ensureFailedRef.current.get(currentUserId);
        if (failedAt && Date.now() - failedAt < 30_000) {
          setProfileStatus('error');
          return;
        }

        lastHandledUserIdRef.current = currentUserId;
        const profile = await ensureProfileForSupabaseUser(session.user);
        if (!cancelled) {
          repo.setCurrentUserId(profile?.id ?? null);
          setProfileUser(profile);
        }
      }
    });

    listenerRef.current = subscription;

    return () => {
      cancelled = true;
      if (listenerRef.current) {
        listenerRef.current.unsubscribe();
        listenerRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty deps: registrar listener UMA vez no mount

  // ── register ────────────────────────────────────────────────────────────────
  const register = useCallback(
    async (payload: RegisterPayload): Promise<User | null> => {
      if (useSupabase) {
        const supabase = getSupabase();
        if (!supabase) return null;
        const email = payload.email.trim().toLowerCase();
        const { data, error } = await supabase.auth.signUp({
          email,
          password: payload.password,
          options: { data: { full_name: payload.full_name } },
        });
        if (error) {
          // eslint-disable-next-line no-console
          console.error('[AUTH] signUp error:', { code: (error as any)?.code, message: error.message });
          return null;
        }
        if (!data.user?.id) return null;
        try {
          const created = await repo.create({
            id: data.user.id,
            email,
            name: payload.full_name.trim(),
            role: 'seller',
            status: 'pending',
            accountType: payload.account_type,
            whatsapp: payload.whatsapp.trim(),
            province: payload.province.trim(),
          });
          repo.setCurrentUserId(created.id);
          setProfileUser(created);
          refreshUsers?.();
          return created;
        } catch (err) {
          // eslint-disable-next-line no-console
          console.error('[AUTH] Falha ao criar perfil após signUp:', err);
          return null;
        }
      }
      // Modo local
      const existing = users.find((u) => u.email.toLowerCase() === payload.email.toLowerCase());
      if (existing) return null;
      const now = new Date().toISOString();
      const newUser: User = {
        id: crypto.randomUUID(),
        email: payload.email.trim().toLowerCase(),
        name: payload.full_name.trim(),
        role: 'seller',
        status: 'pending',
        accountType: payload.account_type,
        whatsapp: payload.whatsapp.trim(),
        province: payload.province.trim(),
        createdAt: now,
        updatedAt: now,
      };
      setUsers((prev) => [...prev, newUser]);
      setStoredPass(newUser.id, payload.password);
      setUserId(newUser.id);
      return newUser;
    },
    [users, setUsers, repo, refreshUsers]
  );

  // ── login ────────────────────────────────────────────────────────────────────
  const login = useCallback(
    async (email: string, password: string): Promise<User | null> => {
      const attemptId = generateAuthAttemptId();
      currentAttemptIdRef.current = attemptId;
      logAuthEvent(attemptId, 'SESSION_BEFORE', { provider: 'email', email });

      if (useSupabase) {
        setAuthStatus('authenticating');
        const supabase = getSupabase();
        if (!supabase) {
          setAuthStatus('anonymous');
          return null;
        }
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim().toLowerCase(),
          password,
        });
        if (error || !data.user?.id) {
          logAuthEvent(attemptId, 'PROFILE_ERROR', {
            error: error?.message || 'no_user',
          });
          setAuthStatus('anonymous');
          setAuthError(error?.message || 'Login falhou');
          return null;
        }
        setAuthStatus('authenticated');
        const profile = await ensureProfileForSupabaseUser(data.user);
        if (!profile) {
          setAuthStatus('anonymous');
          return null;
        }
        repo.setCurrentUserId(profile.id);
        setProfileUser(profile);
        logAuthEvent(attemptId, 'NAVIGATE', {
          to: getPostLoginRedirect(profile),
        });
        return profile;
      }
      // Modo local
      const u = users.find((x) => x.email.toLowerCase() === email.toLowerCase());
      if (!u) {
        setAuthError('Email ou senha incorretos');
        return null;
      }
      if (u.status === 'blocked' || u.status === 'suspended') {
        setAuthError('Conta bloqueada ou suspensa');
        return null;
      }
      if (getStoredPass(u.id) !== password) {
        setAuthError('Email ou senha incorretos');
        return null;
      }
      setUserId(u.id);
      setAuthStatus('authenticated');
      setProfileStatus('ready');
      return u;
    },
    [users, repo, ensureProfileForSupabaseUser, getPostLoginRedirect]
  );

  // ── loginWithGoogle ──────────────────────────────────────────────────────────
  const loginWithGoogle = useCallback(async () => {
    if (!useSupabase) return;
    const attemptId = generateAuthAttemptId();
    currentAttemptIdRef.current = attemptId;
    logAuthEvent(attemptId, 'SESSION_BEFORE', {
      provider: 'google',
      url: window.location.href,
      reason: 'login_google',
    });
    setAuthStatus('authenticating');
    const supabase = getSupabase();
    if (!supabase) {
      setAuthStatus('anonymous');
      return;
    }
    const redirectTo = `${window.location.origin}/auth/callback`;
    logAuthEvent(attemptId, 'NAVIGATE', {
      to: redirectTo,
      reason: 'oauth_redirect',
    });
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo,
        queryParams: {
          access_type: 'offline',
          prompt: 'select_account',
        },
      },
    });
  }, []);

  // ── logout ───────────────────────────────────────────────────────────────────
  const logout = useCallback(() => {
    logAuthEvent(currentAttemptIdRef.current, 'SIGNED_OUT', {});
    if (useSupabase) {
      getSupabase()?.auth.signOut();
      lastHandledUserIdRef.current = null;
      ensureFailedRef.current.clear();
      ensureProfileCacheRef.current.clear();
      repo.setCurrentUserId(null);
      setProfileUser(null);
      setAuthStatus('anonymous');
      setProfileStatus('idle');
      setAuthError(null);
      return;
    }
    setUserId(null);
    setAuthStatus('anonymous');
    setProfileStatus('idle');
  }, [repo]);

  // ── Flags derivadas ──────────────────────────────────────────────────────────
  const isPending = user?.status === 'pending';
  const isRejected = user?.status === 'rejected';
  const isBlocked = user?.status === 'blocked';
  const isAdmin = user?.role === 'admin';
  const isApprovedSeller = user?.role === 'seller' && user?.status === 'approved';

  // ── refreshProfile ───────────────────────────────────────────────────────────
  const refreshProfile = useCallback(async () => {
    if (!useSupabase) return;
    const id = repo.getCurrentUserId();
    if (!id) return;
    const p = await repo.getById(id);
    setProfileUser(p ?? null);
  }, [repo]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      login,
      logout,
      register,
      isPending,
      isRejected,
      isBlocked,
      isAdmin,
      isApprovedSeller,
      authLoading: authLoading ?? false,
      authStatus,
      profileStatus,
      authError,
      refreshProfile,
      loginWithGoogle,
      getPostLoginRedirect,
    }),
    [
      user,
      login,
      logout,
      register,
      isPending,
      isRejected,
      isBlocked,
      isAdmin,
      isApprovedSeller,
      authLoading,
      authStatus,
      profileStatus,
      authError,
      refreshProfile,
      loginWithGoogle,
      getPostLoginRedirect,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
