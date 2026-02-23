/**
 * Página intermediária /pos-login que orquestra o redirect pós-login de forma segura.
 * Evita loops e garante que o perfil está pronto antes de navegar.
 */

import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { AppButton } from '@/components/ui/app-button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Loader2 } from 'lucide-react';
import { logAuthEvent, generateAuthAttemptId } from '@/lib/authInstrumentation';

export function PostLogin() {
  const navigate = useNavigate();
  const { user, authStatus, profileStatus, authError, getPostLoginRedirect } = useAuth();
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [showTimeout, setShowTimeout] = useState(false);
  const redirectDoneRef = useRef(false);
  const attemptIdRef = useRef<string>(generateAuthAttemptId());
  const startTimeRef = useRef<number>(Date.now());

  // Timer visual (0-12s)
  useEffect(() => {
    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
      setElapsedSeconds(elapsed);
      if (elapsed >= 12 && !redirectDoneRef.current) {
        setShowTimeout(true);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Orquestração do redirect
  useEffect(() => {
    // Guard: já redirecionou
    if (redirectDoneRef.current) return;

    // Caso 1: Autenticado + perfil pronto → redirect
    if (authStatus === 'authenticated' && profileStatus === 'ready' && user) {
      const targetRoute = getPostLoginRedirect(user);
      logAuthEvent(attemptIdRef.current, 'NAVIGATE', {
        to: targetRoute,
        reason: 'post_login_ready',
      });
      redirectDoneRef.current = true;
      navigate(targetRoute, { replace: true });
      return;
    }

    // Caso 2: Anonymous sem erro → redirect automático após 1s
    if (authStatus === 'anonymous' && !authError) {
      const t = setTimeout(() => {
        if (!redirectDoneRef.current) {
          redirectDoneRef.current = true;
          navigate('/entrar', { replace: true });
        }
      }, 1000);
      return () => clearTimeout(t);
    }

    // Caso 3: Timeout hard (15s) → fallback para login
    const timeoutId = setTimeout(() => {
      if (!redirectDoneRef.current) {
        logAuthEvent(attemptIdRef.current, 'PROFILE_ERROR', {
          reason: 'timeout_hard',
          timeout: 15,
        });
        redirectDoneRef.current = true;
        navigate('/entrar?error=timeout', { replace: true });
      }
    }, 15_000);

    return () => clearTimeout(timeoutId);
  }, [authStatus, profileStatus, user, authError, navigate, getPostLoginRedirect]);

  // Estado: Loading
  if (authStatus === 'booting' || authStatus === 'authenticating' || profileStatus === 'loading') {
    return (
      <div className="flex min-h-[80vh] items-center justify-center bg-muted/50 px-4 py-10">
        <div className="w-full min-w-0 max-w-md text-center">
          <div className="mb-6 flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
          <p className="mb-2 text-base font-medium text-foreground">A autenticar...</p>
          <p className="mb-4 text-sm text-muted-foreground">
            {authStatus === 'booting' && 'A inicializar...'}
            {authStatus === 'authenticating' && 'A validar credenciais...'}
            {profileStatus === 'loading' && 'A carregar o teu perfil...'}
          </p>
          {elapsedSeconds > 0 && (
            <p className="text-xs text-muted-foreground">
              {elapsedSeconds}s {elapsedSeconds >= 12 && '(pode demorar mais)'}
            </p>
          )}
          {showTimeout && (
            <div className="mt-4">
              <AppButton variant="outline" onClick={() => navigate('/entrar', { replace: true })}>
                Voltar ao login
              </AppButton>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Estado: Erro
  if (authStatus === 'anonymous' || profileStatus === 'error' || authError) {
    const isRls = authError === 'rls_profiles';
    const isTimeout = authError === 'profile_timeout';
    const errorMessage =
      isRls
        ? 'Erro de configuração do banco de dados (RLS). Contacte o administrador.'
        : isTimeout
          ? 'Timeout ao carregar perfil. Tente novamente.'
          : authError || 'Erro ao carregar perfil.';

    return (
      <div className="flex min-h-[80vh] items-center justify-center bg-muted/50 px-4 py-10">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              Erro na autenticação
            </CardTitle>
            <CardDescription className="whitespace-pre-line">{errorMessage}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <AppButton variant="primary" onClick={() => navigate('/entrar', { replace: true })}>
              Voltar ao login
            </AppButton>
            <AppButton variant="outline" onClick={() => window.location.reload()}>
              Tentar novamente
            </AppButton>
            {import.meta.env.DEV && (
              <p className="mt-2 text-xs text-muted-foreground">
                debug: authStatus={authStatus}, profileStatus={profileStatus}, error={authError}
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }


  // Estado: Aguardando (não deveria chegar aqui, mas fallback)
  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-muted/50 px-4 py-10">
      <div className="w-full min-w-0 max-w-md text-center">
        <Loader2 className="mx-auto mb-4 h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">A processar...</p>
      </div>
    </div>
  );
}
