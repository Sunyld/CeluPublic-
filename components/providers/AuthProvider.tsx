'use client';

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
import type { User, AccountType, AccountStatus } from '@/types';
import { storage } from '@/lib/storage';
import { createClient } from '@/lib/supabase/client';
import { getUsersRepo } from '@/lib/repositories/getUsersRepo';
import {
    generateAuthAttemptId,
    logAuthEvent,
    type AuthEventType,
} from '@/lib/authInstrumentation';

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
    logout: () => Promise<void>;
    register: (payload: RegisterPayload) => Promise<User | null>;
    isPending: boolean;
    isRejected: boolean;
    isBlocked: boolean;
    isAdmin: boolean;
    isApprovedSeller: boolean;
    authStatus: AuthStatus;
    profileStatus: ProfileStatus;
    authError: string | null;
    refreshProfile: () => Promise<void>;
    loginWithGoogle: () => Promise<void>;
    getPostLoginRedirect: (profile?: User) => string;
};

const AuthContext = createContext<AuthContextValue | null>(null);

const ADMIN_EMAIL = 'sunyldjosesomailamatapa@gmail.com';
const USE_SUPABASE = process.env.NEXT_PUBLIC_USE_SUPABASE === 'true';

export function AuthProvider({ children }: { children: ReactNode }) {
    const [authStatus, setAuthStatus] = useState<AuthStatus>(USE_SUPABASE ? 'booting' : 'anonymous');
    const [profileStatus, setProfileStatus] = useState<ProfileStatus>('idle');
    const [profileUser, setProfileUser] = useState<User | null>(null);
    const [authError, setAuthError] = useState<string | null>(null);

    const currentAttemptIdRef = useRef<string>(generateAuthAttemptId());
    const repo = getUsersRepo();
    const supabase = useMemo(() => createClient(), []);

    const lastHandledUserIdRef = useRef<string | null>(null);
    const ensureProfileCacheRef = useRef<Map<string, Promise<User | null>>>(new Map());
    const ensureFailedRef = useRef<Map<string, number>>(new Map());
    const ensureAttemptedRef = useRef<Set<string>>(new Set());

    // Derived flags
    const user = profileUser;
    const isPending = user?.status === 'pending';
    const isRejected = user?.status === 'rejected';
    const isBlocked = user?.status === 'blocked';
    const isAdmin = user?.role === 'admin';
    const isApprovedSeller = user?.status === 'approved';

    const getPostLoginRedirect = useCallback((profile?: User): string => {
        const p = profile ?? profileUser;
        if (!p) return '/';

        // Admin logic
        if (p.role === 'admin' && p.status === 'approved') return '/admin';

        // Seller logic
        if (p.status === 'approved') return '/vendedor';

        // Activation flow for seller
        if (['pending', 'rejected'].includes(p.status)) {
            return '/vendedor/ativacao';
        }

        return '/'; // Fallback
    }, [profileUser]);

    const ensureProfileForSupabaseUser = useCallback(
        async (supabaseUser: { id: string; email?: string | null; user_metadata?: any }): Promise<User | null> => {
            const id = supabaseUser.id;
            const email = (supabaseUser.email ?? '').toLowerCase();
            const isAdminEmail = email === ADMIN_EMAIL;

            // 1. Check promise cache (prevents concurrent calls)
            const cached = ensureProfileCacheRef.current.get(id);
            if (cached) return cached;

            // 2. Check cooldown for recent failures
            const failedAt = ensureFailedRef.current.get(id);
            if (failedAt && Date.now() - failedAt < 30_000) {
                setProfileStatus('error');
                return null;
            }

            const promise = (async () => {
                setProfileStatus('loading');
                console.log('[PROFILE] Checking for userId:', id.slice(0, 8));

                try {
                    // a) Try client-side SELECT first
                    let profile = await repo.getById(id);

                    if (profile) {
                        console.log('[PROFILE] Found via client SELECT');
                        if (isAdminEmail && profile.role !== 'admin') {
                            profile = await repo.update(id, { role: 'admin', status: 'approved' });
                        }
                        setProfileStatus('ready');
                        return profile;
                    }

                    // b) Not found -> Check Circuit Breaker before calling API
                    if (ensureAttemptedRef.current.has(id)) {
                        console.warn('[PROFILE] Circuit breaker active: skipping second ensure attempt');
                        setProfileStatus('error');
                        setAuthError('Perfil não encontrado após tentativa de criação.');
                        return null;
                    }

                    console.log('[PROFILE] Not found on client. Attempting server-side ensure...');
                    ensureAttemptedRef.current.add(id);

                    const meta = supabaseUser.user_metadata ?? {};
                    const name = meta.full_name ?? meta.name ?? email ?? 'Utilizador';

                    // c) Call Server Route Handler using service_role
                    const response = await fetch('/api/profile/ensure', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            id,
                            email,
                            full_name: name
                        })
                    });

                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(errorData.error || 'Falha na resposta do servidor');
                    }

                    const created = await response.json();
                    console.log('[PROFILE] Successfully ensured via server route handler');

                    setProfileStatus('ready');
                    return created;
                } catch (err: any) {
                    console.error('[PROFILE] Error in ensureProfile flow:', err);
                    ensureFailedRef.current.set(id, Date.now());
                    setProfileStatus('error');
                    setAuthError(err.message || 'Erro ao carregar ou criar perfil');
                    return null;
                }
            })();

            ensureProfileCacheRef.current.set(id, promise);
            // Cleanup cache after 10s
            setTimeout(() => ensureProfileCacheRef.current.delete(id), 10000);
            return promise;
        },
        [repo]
    );

    useEffect(() => {
        if (!USE_SUPABASE) return;

        let cancelled = false;

        supabase.auth.getSession().then(async ({ data: { session } }) => {
            if (cancelled) return;
            if (session?.user) {
                setAuthStatus('authenticated');
                const profile = await ensureProfileForSupabaseUser(session.user);
                if (!cancelled) setProfileUser(profile);
            } else {
                setAuthStatus('anonymous');
            }
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (cancelled) return;

            console.log('[AUTH_PROVIDER] Auth state changed:', event, {
                userId: session?.user?.id?.slice(0, 8),
                email: session?.user?.email
            });

            if (event === 'SIGNED_OUT') {
                setProfileUser(null);
                setAuthStatus('anonymous');
                setProfileStatus('idle');
            } else if (session?.user) {
                setAuthStatus('authenticated');
                if (lastHandledUserIdRef.current !== session.user.id) {
                    console.log('[AUTH_PROVIDER] New user session, ensuring profile...');
                    lastHandledUserIdRef.current = session.user.id;
                    const profile = await ensureProfileForSupabaseUser(session.user);
                    if (!cancelled) {
                        console.log('[AUTH_PROVIDER] Profile ensured:', profile ? 'success' : 'failed');
                        setProfileUser(profile);
                    }
                } else {
                    console.log('[AUTH_PROVIDER] User already handled, skipping ensure');
                }
            }
        });

        return () => {
            cancelled = true;
            subscription.unsubscribe();
        };
    }, [supabase, ensureProfileForSupabaseUser]);

    const login = useCallback(async (email: string, password: string) => {
        setAuthStatus('authenticating');
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email.trim().toLowerCase(),
            password,
        });
        if (error || !data.user) {
            setAuthStatus('anonymous');
            setAuthError(error?.message || 'Login falhou');
            return null;
        }
        const profile = await ensureProfileForSupabaseUser(data.user);
        setProfileUser(profile);
        return profile;
    }, [supabase, ensureProfileForSupabaseUser]);

    const loginWithGoogle = useCallback(async () => {
        const redirectTo = `${window.location.origin}/auth/callback`;
        await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo,
                queryParams: {
                    prompt: 'select_account',
                    access_type: 'offline'
                }
            },
        });
    }, [supabase]);

    const logout = useCallback(async () => {
        await supabase.auth.signOut();
        setProfileUser(null);
        setAuthStatus('anonymous');
        setProfileStatus('idle');
    }, [supabase]);

    const register = useCallback(async (payload: RegisterPayload) => {
        const { data, error } = await supabase.auth.signUp({
            email: payload.email,
            password: payload.password,
            options: { data: { full_name: payload.full_name } },
        });
        if (error || !data.user) {
            setAuthError(error?.message || 'Falha no cadastro');
            return null;
        }

        console.log('[AUTH] Signup success, ensuring profile via server...');

        // Ensure profile via server route handler (bypass RLS)
        const response = await fetch('/api/profile/ensure', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: data.user.id,
                email: payload.email,
                full_name: payload.full_name,
                whatsapp: payload.whatsapp,
                province: payload.province,
                account_type: payload.account_type
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('[AUTH] Register profile ensure failed:', errorData);
            setAuthStatus('anonymous');
            setAuthError('Utilizador criado, mas falha ao gerar perfil: ' + (errorData.error || 'Erro interno'));
            return null;
        }

        const profile = await response.json();
        setProfileUser(profile);
        setProfileStatus('ready');
        return profile;
    }, [supabase]);

    const refreshProfile = useCallback(async () => {
        const { data: { user: sbUser } } = await supabase.auth.getUser();
        if (!sbUser) return;
        try {
            const res = await fetch('/api/profile/me', { cache: 'no-store' });
            if (!res.ok) {
                const fallback = await repo.getById(sbUser.id);
                setProfileUser(fallback);
                return;
            }
            const raw = await res.json();
            const p: User = {
                id: raw.id,
                email: raw.email || '',
                name: raw.full_name || 'Utilizador',
                role: (raw.role === 'admin' ? 'admin' : 'seller') as User['role'],
                status: (raw.status || 'pending') as AccountStatus,
                accountType: raw.account_type ?? undefined,
                whatsapp: raw.whatsapp ?? undefined,
                city: raw.city ?? undefined,
                province: raw.province ?? undefined,
                createdAt: raw.created_at || new Date().toISOString(),
                updatedAt: raw.updated_at,
            };
            setProfileUser(p);
        } catch {
            const fallback = await repo.getById(sbUser.id);
            setProfileUser(fallback);
        }
    }, [supabase, repo]);

    const value = useMemo(() => ({
        user,
        login,
        logout,
        register,
        isPending,
        isRejected,
        isBlocked,
        isAdmin,
        isApprovedSeller,
        authStatus,
        profileStatus,
        authError,
        refreshProfile,
        loginWithGoogle,
        getPostLoginRedirect,
    }), [user, login, logout, register, isPending, isRejected, isBlocked, isAdmin, isApprovedSeller, authStatus, profileStatus, authError, refreshProfile, loginWithGoogle, getPostLoginRedirect]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
}

/** Safe for public pages: returns null when outside AuthProvider instead of throwing. */
export function useAuthOptional(): AuthContextValue | null {
    return useContext(AuthContext);
}
