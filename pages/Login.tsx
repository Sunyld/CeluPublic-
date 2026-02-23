import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { AppButton } from '@/components/ui/app-button';
import { InputWithIcon } from '@/components/ui/input-with-icon';
import { Label } from '@/components/ui/label';
import { GoogleIcon } from '@/components/ui/google-icon';
import { BrandLogo } from '@/components/BrandLogo';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { setPageTitleAndDescription } from '@/lib/seo';
import { trackEvent } from '@/lib/analytics';
import { useToast } from '@/context/ToastContext';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [oauthStarting, setOauthStarting] = useState(false);
  const { user, login, loginWithGoogle, authStatus, profileStatus, getPostLoginRedirect } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const redirectDoneRef = useRef(false);

  // Redirect se já autenticado (evita loop)
  useEffect(() => {
    if (redirectDoneRef.current) return;
    if (authStatus !== 'authenticated' || profileStatus !== 'ready' || !user) return;
    if (location.pathname !== '/entrar') return;

    redirectDoneRef.current = true;
    const targetRoute = getPostLoginRedirect(user);
    navigate(targetRoute, { replace: true });
  }, [user, location.pathname, navigate, authStatus, profileStatus, getPostLoginRedirect]);

  useEffect(() => {
    setPageTitleAndDescription('Entrar – CeluPublic', 'Entre na sua conta CeluPublic para gerir os seus anúncios.');
    
    // Check for error query param (e.g., from AuthCallback timeout)
    const params = new URLSearchParams(location.search);
    if (params.get('error') === 'profile') {
      setError('Erro ao carregar perfil. Tente fazer login novamente ou contacte o suporte.');
    }
  }, [location.search]);

  const handleGoogle = async () => {
    try {
      setOauthStarting(true);
      setError('');
      await loginWithGoogle();
      // OAuth redirects to /auth/callback, which then goes to /pos-login
    } catch (err: any) {
      // eslint-disable-next-line no-console
      console.error('[LOGIN] Google OAuth error:', err);
      const errorMsg = err?.message || 'Erro ao iniciar login com Google. Tente novamente.';
      setError(errorMsg);
      toast.showToast({
        variant: 'error',
        title: 'Erro no login',
        description: errorMsg,
      });
    } finally {
      setOauthStarting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const loggedInUser = await login(email, password);
      if (!loggedInUser) {
        const errorMsg = 'Email ou senha incorretos.';
        setError(errorMsg);
        toast.showToast({
          variant: 'error',
          title: 'Login falhou',
          description: errorMsg,
        });
        return;
      }
      trackEvent('login_success', { userId: loggedInUser.id });
      // Redirect para /pos-login (orquestração segura)
      redirectDoneRef.current = true;
      navigate('/pos-login', { replace: true });
    } catch (err: any) {
      const errorMsg = err?.message || 'Erro inesperado ao fazer login.';
      setError(errorMsg);
      toast.showToast({
        variant: 'error',
        title: 'Erro no login',
        description: errorMsg,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-muted/50 px-4 py-10 sm:py-12">
      <div className="w-full min-w-0 max-w-md">
        <Card className="shadow-lg">
          <CardHeader className="space-y-5">
            <AppButton variant="ghost" size="sm" asChild className="-ml-2">
              <Link to="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar
              </Link>
            </AppButton>
            <div className="flex justify-center">
              <BrandLogo variant="auth" linkToHome />
            </div>
            <div>
              <CardTitle className="text-xl">Entrar na sua conta</CardTitle>
              <CardDescription className="mt-1">
                Use o seu email para entrar e começar a anunciar.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            <form onSubmit={handleSubmit} id="login-form" className="space-y-5">
              <AppButton
                type="button"
                variant="outline"
                className="w-full gap-2"
                onClick={handleGoogle}
                disabled={oauthStarting}
              >
                <GoogleIcon className="h-5 w-5" />
                {oauthStarting ? 'A abrir Google...' : 'Entrar com Google'}
              </AppButton>

              <div className="relative flex items-center gap-2 py-1">
                <div className="flex-1 border-t border-border" />
                <span className="text-xs font-medium text-muted-foreground">OU</span>
                <div className="flex-1 border-t border-border" />
              </div>

              {error && (
                <p className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                  {error}
                </p>
              )}

              <div className="space-y-2">
                <Label htmlFor="login-email">Email</Label>
                <InputWithIcon
                  id="login-email"
                  type="email"
                  placeholder="exemplo@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  leftIcon={<Mail className="h-4 w-4" />}
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="login-password">Senha</Label>
                  <Link
                    to="/termos"
                    className="text-xs font-medium text-primary hover:underline"
                  >
                    Esqueceu a senha?
                  </Link>
                </div>
                <InputWithIcon
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  leftIcon={<Lock className="h-4 w-4" />}
                  rightIcon={showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  onRightIconClick={() => setShowPassword((v) => !v)}
                />
              </div>

              <AppButton
                type="submit"
                className="w-full"
                size="lg"
                disabled={submitting || oauthStarting || authStatus === 'authenticating'}
              >
                {submitting ? 'A entrar...' : 'Entrar'}
              </AppButton>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col gap-2 border-t pt-6">
            <p className="text-center text-sm text-muted-foreground">
              Ainda não tem conta?{' '}
              <Link to="/cadastro" className="font-medium text-primary hover:underline">
                Cadastre-se
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
