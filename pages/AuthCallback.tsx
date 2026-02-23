import { useEffect, useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getSupabase, getSupabaseClientId } from '@/lib/supabaseClient';
import { getUsersRepo } from '@/lib/repositories/getUsersRepo';
import { AppButton } from '@/components/ui/app-button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AlertCircle, Loader2 } from 'lucide-react';
import { logAuthEvent, generateAuthAttemptId } from '@/lib/authInstrumentation';

type CallbackStep = 'Lendo callback' | 'A trocar sessão' | 'A carregar perfil' | 'A redirecionar' | 'Erro';

function parseHashParams(hash: string): Record<string, string> {
  const clean = hash.startsWith('#') ? hash.slice(1) : hash;
  const params = new URLSearchParams(clean);
  const out: Record<string, string> = {};
  params.forEach((v, k) => {
    out[k] = v;
  });
  return out;
}

/**
 * Idempotent profile ensure function (used only in AuthCallback to avoid conflicts with AuthContext).
 * Returns profile or null if failed (doesn't throw).
 * Returns { profile: null, rlsError: true } if RLS recursion error detected.
 */
async function ensureProfileOnce(
  userId: string,
  email: string,
  name: string,
  isAdminEmail: boolean
): Promise<{ profile: { id: string; role: string; status: string; email: string } | null; rlsError: boolean }> {
  const repo = getUsersRepo();

  try {
    // Try to get existing profile
    let profile = await repo.getById(userId);

    if (!profile) {
      // Create profile (upsert is idempotent)
      try {
        profile = await repo.create({
          id: userId,
          email,
          name,
          role: isAdminEmail ? 'admin' : 'seller',
          status: isAdminEmail ? 'approved' : 'pending',
          accountType: 'seller',
          whatsapp: undefined,
          province: undefined,
        });
        // Re-fetch to ensure we have latest
        profile = await repo.getById(userId);
      } catch (err: any) {
        // eslint-disable-next-line no-console
        console.error('[AUTH_CALLBACK] Failed to create profile:', err);
        // Check for RLS/DB errors
        const isRLSError =
          err?.code === '42P17' ||
          err?.status === 500 ||
          err?.statusCode === 500 ||
          err?.message?.includes('infinite recursion detected') ||
          err?.message?.includes('policy for relation profiles') ||
          err?.message?.includes('recursion');
        if (isRLSError) {
          // eslint-disable-next-line no-console
          console.error('[AUTH_CALLBACK] RLS recursion detected (42P17) - ensure migration 20250216_fix_profiles_rls_NO_RECURSION_HARD.sql is applied');
          return { profile: null, rlsError: true };
        }
        return { profile: null, rlsError: false };
      }
    }

    if (!profile) return { profile: null, rlsError: false };

    // Promote admin email if needed
    if (isAdminEmail && (profile.role !== 'admin' || profile.status !== 'approved')) {
      try {
        const updated = await repo.update(userId, {
          role: 'admin',
          status: 'approved',
        });
        if (updated) {
          profile = updated;
        } else {
          // Re-fetch if update returned null
          profile = await repo.getById(userId);
        }
      } catch (err: any) {
        // eslint-disable-next-line no-console
        console.error('[AUTH_CALLBACK] Failed to promote admin:', err);
        // Check for RLS error in update
        const isRLSError =
          err?.code === '42P17' ||
          err?.status === 500 ||
          err?.statusCode === 500 ||
          err?.message?.includes('infinite recursion detected') ||
          err?.message?.includes('policy for relation profiles') ||
          err?.message?.includes('recursion');
        if (isRLSError) {
          // eslint-disable-next-line no-console
          console.error('[AUTH_CALLBACK] RLS recursion detected during admin promotion (42P17)');
          return { profile: null, rlsError: true };
        }
        // Don't fail - continue with existing profile
      }
    }

    return { profile, rlsError: false };
  } catch (err: any) {
    // eslint-disable-next-line no-console
    console.error('[AUTH_CALLBACK] ensureProfileOnce error:', err);
    const isRLSError =
      err?.code === '42P17' ||
      err?.status === 500 ||
      err?.statusCode === 500 ||
      err?.message?.includes('infinite recursion detected') ||
      err?.message?.includes('policy for relation profiles') ||
      err?.message?.includes('recursion');
    return { profile: null, rlsError: isRLSError };
  }
}

export function AuthCallback() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState<CallbackStep>('Lendo callback');
  const ranRef = useRef(false);
  const processedRef = useRef(false);
  const attemptIdRef = useRef<string>(generateAuthAttemptId());

  useEffect(() => {
    // Guard against multiple executions (StrictMode + re-renders)
    if (ranRef.current || processedRef.current) {
      return; // Silent skip - no log spam
    }
    ranRef.current = true;
    logAuthEvent(attemptIdRef.current, 'SESSION_BEFORE', {
      url: window.location.href,
      provider: 'oauth',
    });

    let cancelled = false;
    let timeoutId: NodeJS.Timeout | null = null;
    let redirectDone = false;

    const run = async () => {
      try {
        const supabase = getSupabase();
        if (!supabase) {
          // eslint-disable-next-line no-console
          console.error('[AUTH_CALLBACK] Supabase client not available');
          if (!cancelled) {
            setError('Supabase não configurado. Verifique as variáveis de ambiente.');
            setLoading(false);
            setStep('Erro');
          }
          return;
        }

        // Basic debug logs (once)
        // eslint-disable-next-line no-console
        console.log('[AUTH_CALLBACK] boot, clientId:', getSupabaseClientId(), 'attemptId:', attemptIdRef.current);
        // eslint-disable-next-line no-console
        console.log('[AUTH_CALLBACK] href:', window.location.href);
        // eslint-disable-next-line no-console
        console.log('[AUTH_CALLBACK] search:', window.location.search);
        // eslint-disable-next-line no-console
        console.log(
          '[AUTH_CALLBACK] hash:',
          window.location.hash ? window.location.hash.slice(0, 120) : '(empty)'
        );

        // Detect PKCE (?code=) OR Implicit flow (#access_token=)
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const hash = window.location.hash || '';
        const hasHashToken = hash.includes('access_token=');
        const hasCode = !!code;

        // eslint-disable-next-line no-console
        console.log('[AUTH_CALLBACK] detected:', { hasCode, hasHashToken, hashLen: hash.length });

        // Step 1: Process PKCE (code) OR Implicit (hash) OR wait for existing session
        setStep('A trocar sessão');

        if (hasCode) {
          // PKCE flow: exchange code for session
          try {
            const { data: exchangeData, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
            if (exchangeError) {
              // eslint-disable-next-line no-console
              console.error('[AUTH_CALLBACK][exchangeCodeForSession]', {
                message: exchangeError.message,
                status: exchangeError.status,
                code: exchangeError.code,
                fullError: exchangeError,
              });
              if (!cancelled) {
                const errorMsg = `Erro ao trocar código por sessão: ${exchangeError.message}${exchangeError.status ? ` (${exchangeError.status})` : ''
                  }`;
                setError(errorMsg);
                setLoading(false);
                setStep('Erro');
              }
              return;
            }

            // eslint-disable-next-line no-console
            console.log('[AUTH_CALLBACK] exchangeCodeForSession ok:', {
              hasSession: !!exchangeData.session,
              userId: exchangeData.session?.user?.id ? exchangeData.session.user.id.slice(0, 8) + '...' : null,
              email: exchangeData.session?.user?.email,
            });
          } catch (err: any) {
            // eslint-disable-next-line no-console
            console.error('[AUTH_CALLBACK][exchangeCodeForSession] fatal:', err);
            if (!cancelled) {
              setError(`Erro ao processar código OAuth: ${err?.message || 'Erro desconhecido'}`);
              setLoading(false);
              setStep('Erro');
            }
            return;
          }
        } else if (hasHashToken) {
          // Implicit flow: parse hash and set session manually
          try {
            const hashParams = parseHashParams(hash);
            const access_token = hashParams['access_token'];
            const refresh_token = hashParams['refresh_token'] ?? '';

            if (!access_token) {
              throw new Error('Hash OAuth sem access_token');
            }

            // eslint-disable-next-line no-console
            console.log('[AUTH_CALLBACK] implicit hash detected, setting session...');

            const { data: setData, error: setErr } = await supabase.auth.setSession({
              access_token,
              refresh_token,
            });

            if (setErr) {
              // eslint-disable-next-line no-console
              console.error('[AUTH_CALLBACK][setSession]', {
                message: setErr.message,
                status: setErr.status,
              });
              if (!cancelled) {
                let errorMsg = `Erro ao definir sessão: ${setErr.message}`;
                if (!refresh_token && setErr.message?.includes('refresh')) {
                  errorMsg += '. O Supabase recomenda usar PKCE em vez de Implicit flow.';
                }
                setError(errorMsg);
                setLoading(false);
                setStep('Erro');
              }
              return;
            }

            // eslint-disable-next-line no-console
            console.log('[AUTH_CALLBACK] setSession ok:', {
              hasSession: !!setData.session,
              userId: setData.session?.user?.id,
            });
          } catch (err: any) {
            // eslint-disable-next-line no-console
            console.error('[AUTH_CALLBACK][setSession] fatal:', err);
            if (!cancelled) {
              setError(`Erro ao processar hash OAuth: ${err?.message || 'Erro desconhecido'}`);
              setLoading(false);
              setStep('Erro');
            }
            return;
          }
        } else {
          // Neither code nor hash: wait for existing session (polling)
          setStep('Lendo callback');
          // eslint-disable-next-line no-console
          console.log('[AUTH_CALLBACK] Empty callback, polling for session...');

          const started = Date.now();
          const maxWait = 1500; // 1.5s
          const pollInterval = 250; // 250ms
          let foundSession = false;

          while (Date.now() - started < maxWait && !foundSession && !cancelled) {
            const { data: pollData } = await supabase.auth.getSession();
            if (pollData.session?.user?.id) {
              foundSession = true;
              // eslint-disable-next-line no-console
              console.log('[AUTH_CALLBACK] Found existing session via polling');
              break;
            }
            await new Promise((r) => setTimeout(r, pollInterval));
          }

          if (!foundSession) {
            // eslint-disable-next-line no-console
            console.error('[AUTH_CALLBACK] No session found after polling');
            if (!cancelled) {
              setError(
                'Callback sem ?code nem #access_token. Confirme as Redirect URLs no Supabase e o redirect URI do Google (auth/v1/callback).'
              );
              setLoading(false);
              setStep('Erro');
              setTimeout(() => {
                if (!cancelled && !redirectDone) {
                  redirectDone = true;
                  navigate('/entrar?error=oauth_missing', { replace: true });
                }
              }, 2000);
            }
            return;
          }
        }

        // Step 2: Confirm session after processing (PKCE or Implicit or polling)
        const { data: sessionData, error: sessionErr } = await supabase.auth.getSession();
        if (sessionErr) {
          // eslint-disable-next-line no-console
          console.error('[AUTH_CALLBACK] Error getting session:', sessionErr);
          if (!cancelled) {
            setError(`Erro ao obter sessão: ${sessionErr.message}`);
            setLoading(false);
            setStep('Erro');
          }
          return;
        }

        const session = sessionData.session;
        if (!session?.user?.id) {
          // eslint-disable-next-line no-console
          console.error('[AUTH_CALLBACK] No session after processing');
          if (!cancelled) {
            setError('Sem sessão após processamento. Tente fazer login novamente.');
            setLoading(false);
            setStep('Erro');
          }
          return;
        }

        // Clean URL IMMEDIATELY after session confirmed (prevent reprocessing)
        window.history.replaceState({}, document.title, '/auth/callback');
        processedRef.current = true;

        // eslint-disable-next-line no-console
        console.log('[AUTH_CALLBACK] session:', {
          userId: session.user.id,
          email: session.user.email,
        });

        // Step 3: Ensure profile exists (idempotent, doesn't throw)
        setStep('A carregar perfil');
        const email = (session.user.email ?? '').toLowerCase();
        const isAdminEmail = email === 'sunyldjosesomailamatapa@gmail.com';
        const meta = session.user.user_metadata ?? {};
        const name = meta.full_name ?? meta.name ?? email ?? 'Utilizador';

        // eslint-disable-next-line no-console
        console.log('[AUTH_CALLBACK] calling ensureProfileOnce:', {
          userId: session.user.id.slice(0, 8) + '...',
          email,
          isAdminEmail,
        });
        const { profile, rlsError } = await ensureProfileOnce(session.user.id, email, name, isAdminEmail);

        if (rlsError) {
          // eslint-disable-next-line no-console
          console.error('[AUTH_CALLBACK] RLS error detected in ensureProfileOnce');
          // RLS recursion error (42P17): sign out, clean URL, redirect
          // eslint-disable-next-line no-console
          console.error('[AUTH_CALLBACK] RLS recursion error detected - signing out and redirecting');
          if (!cancelled && !redirectDone) {
            redirectDone = true;
            processedRef.current = true;
            // Sign out from Supabase
            await supabase.auth.signOut();
            // Clean URL (remove hash/query) to prevent any reprocessing
            window.history.replaceState({}, document.title, '/auth/callback');
            // Navigate to login with RLS error
            setError('Erro de configuração do banco de dados (RLS). Contacte o administrador.');
            setLoading(false);
            setStep('Erro');
            navigate('/entrar?error=rls_profiles', { replace: true });
          }
          return;
        }

        if (!profile) {
          // eslint-disable-next-line no-console
          console.error('[AUTH_CALLBACK] Profile ensure failed - no profile returned', {
            rlsError,
            userId: session.user.id.slice(0, 8) + '...',
          });
          if (!cancelled) {
            setError(
              'Não foi possível criar ou carregar o perfil. Pode haver um problema com o banco de dados. Contacte o suporte.'
            );
            setLoading(false);
            setStep('Erro');
            setTimeout(() => {
              if (!cancelled && !redirectDone) {
                redirectDone = true;
                navigate('/entrar?error=profile', { replace: true });
              }
            }, 2000);
          }
          return;
        }

        // eslint-disable-next-line no-console
        console.log('[AUTH_CALLBACK] profile ok:', {
          id: profile.id,
          email: profile.email,
          role: profile.role,
          status: profile.status,
        });

        if (cancelled) return;

        // Step 4: Redirect para /pos-login (orquestração segura)
        setStep('A redirecionar');
        logAuthEvent(attemptIdRef.current, 'NAVIGATE', {
          to: '/pos-login',
          reason: 'callback_complete',
        });

        if (!cancelled && !redirectDone) {
          redirectDone = true;
          setLoading(false);
          // Clean URL completely before redirect (remove hash/query params)
          window.history.replaceState({}, document.title, '/auth/callback');
          // Navigate to /pos-login (orchestrator page)
          setTimeout(() => {
            navigate('/pos-login', { replace: true });
          }, 50);
        }
      } catch (err: any) {
        // eslint-disable-next-line no-console
        console.error('[AUTH_CALLBACK] fatal:', err);
        if (!cancelled) {
          setError(`Erro inesperado: ${err?.message || 'Erro desconhecido'}`);
          setLoading(false);
          setStep('Erro');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    // Timeout hard: 10s max (prevents infinite loader)
    timeoutId = setTimeout(() => {
      if (!cancelled && !redirectDone) {
        // eslint-disable-next-line no-console
        console.error('[AUTH_CALLBACK] Timeout no callback (10s)');
        redirectDone = true;
        processedRef.current = true;
        // Best-effort sign out + URL clean, then redirect to login with explicit error
        void getSupabase()?.auth.signOut();
        window.history.replaceState({}, document.title, '/auth/callback');
        setError('Timeout no callback. Tente fazer login novamente.');
        setLoading(false);
        setStep('Erro');
        navigate('/entrar?error=callback_timeout', { replace: true });
      }
    }, 10000);

    run().catch((err) => {
      // Catch any unhandled promise rejection
      // eslint-disable-next-line no-console
      console.error('[AUTH_CALLBACK] Unhandled promise rejection:', err);
      if (!cancelled && !redirectDone) {
        setError(`Erro crítico: ${err?.message || 'Erro desconhecido'}`);
        setLoading(false);
        setStep('Erro');
      }
    });

    return () => {
      cancelled = true;
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]); // CRÍTICO: não colocar location.pathname aqui — muda ao navegar e re-dispara o effect

  const getStepMessage = () => {
    switch (step) {
      case 'Lendo callback':
        return 'A validar callback do Google...';
      case 'A trocar sessão':
        return 'A validar sessão com Google...';
      case 'A carregar perfil':
        return 'A carregar o teu perfil...';
      case 'A redirecionar':
        return 'A redirecionar...';
      case 'Erro':
        return 'Erro na autenticação';
      default:
        return 'A finalizar a autenticação...';
    }
  };

  if (error) {
    return (
      <div
        className="flex min-h-[80vh] items-center justify-center bg-muted/50 px-4 py-10"
        aria-busy={loading}
      >
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              Erro na autenticação
            </CardTitle>
            <CardDescription className="whitespace-pre-line">{error}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <AppButton variant="primary" asChild>
              <Link to="/entrar">Voltar ao login</Link>
            </AppButton>
            <AppButton variant="outline" asChild>
              <Link to="/">Voltar ao início</Link>
            </AppButton>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div
      className="flex min-h-[80vh] items-center justify-center bg-muted/50 px-4 py-10"
      aria-busy={loading}
    >
      <div className="w-full min-w-0 max-w-md text-center">
        <div className="mb-6 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
        <p className="mb-2 text-base font-medium text-foreground">{getStepMessage()}</p>
        <p className="mb-4 text-sm text-muted-foreground">
          {step === 'Lendo callback' && 'A aguardar resposta do Google...'}
          {step === 'A trocar sessão' && 'A criar sessão segura...'}
          {step === 'A carregar perfil' && 'A preparar a tua conta...'}
          {step === 'A redirecionar' && 'Quase pronto!'}
        </p>
        <AppButton type="button" variant="outline" onClick={() => navigate('/')}>
          Cancelar
        </AppButton>
      </div>
    </div>
  );
}
