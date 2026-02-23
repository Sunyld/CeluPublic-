import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

/**
 * Rota neutra /dashboard que redireciona baseado no role/status do usuário.
 * Evita redirects concorrentes após login.
 */
export function Dashboard() {
  const { user, authStatus, profileStatus, getPostLoginRedirect } = useAuth();

  // Aguardar enquanto carrega
  const isLoading = authStatus === 'booting' || authStatus === 'authenticating' || profileStatus === 'loading';
  if (isLoading) {
    return null; // ProtectedRoute já mostra loader
  }

  // Se não autenticado, ProtectedRoute já redireciona para /entrar
  if (!user || authStatus === 'anonymous') {
    return <Navigate to="/entrar" replace />;
  }

  // Redirecionar baseado no role/status
  const targetRoute = getPostLoginRedirect(user);
  return <Navigate to={targetRoute} replace />;
}
