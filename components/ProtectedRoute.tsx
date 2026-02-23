import { Link, Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AppButton } from '@/components/ui/app-button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

type ProtectedRouteProps = {
  requireAdmin?: boolean;
  requireApprovedSeller?: boolean;
  requirePending?: boolean;
};

/**
 * Protege rotas: admin, vendedor aprovado ou pendente.
 * Redirecionamentos alinhados com resolvePostLoginRoute.
 * Usa state machine do AuthContext para evitar loops.
 */
export function ProtectedRoute({
  requireAdmin,
  requireApprovedSeller,
  requirePending,
}: ProtectedRouteProps) {
  const { user, isAdmin, isApprovedSeller, isPending, authStatus, profileStatus, authError, getPostLoginRedirect } =
    useAuth();
  const location = useLocation();

  // Loading: enquanto booting ou authenticating ou profile loading
  const isLoading = authStatus === 'booting' || authStatus === 'authenticating' || profileStatus === 'loading';

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-muted/50 px-4 py-10">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>A carregar o teu perfil...</CardTitle>
            <CardDescription>A preparar a tua conta. Aguarde alguns segundos.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            {/* Removido botão durante loading para evitar redirects concorrentes */}
            {import.meta.env.DEV && authError ? (
              <p className="text-xs text-muted-foreground">debug: {authError}</p>
            ) : null}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user) {
    // Se houver erro conhecido (RLS/timeout), mostrar fallback em vez de loop/redirect cego.
    if (authError) {
      const isRls = authError === 'rls_profiles';
      const msg = isRls
        ? 'Falha ao carregar perfil (erro de permissões no banco).'
        : 'Falha ao carregar perfil. Tente novamente.';
      const to = isRls ? '/entrar?error=rls_profiles' : '/entrar';
      return (
        <div className="flex min-h-[60vh] items-center justify-center bg-muted/50 px-4 py-10">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Não foi possível carregar o perfil</CardTitle>
              <CardDescription>{msg}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              <AppButton variant="primary" asChild>
                <Link to={to}>Voltar ao login</Link>
              </AppButton>
              <AppButton variant="outline" onClick={() => window.location.reload()}>
                Tentar novamente
              </AppButton>
              {import.meta.env.DEV ? (
                <p className="text-xs text-muted-foreground">debug: {authError}</p>
              ) : null}
            </CardContent>
          </Card>
        </div>
      );
    }
    return <Navigate to="/entrar" state={{ from: location }} replace />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to={getPostLoginRedirect(user)} replace />;
  }

  if (requireApprovedSeller && !isApprovedSeller) {
    return <Navigate to="/ativacao" replace />;
  }

  if (requirePending && !isPending) {
    return <Navigate to={getPostLoginRedirect(user)} replace />;
  }

  return <Outlet />;
}
