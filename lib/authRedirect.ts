/**
 * Centraliza a decisão de redirecionamento pós-login e para rotas protegidas.
 * Garante consistência: admin -> /admin, vendedor aprovado -> /vendedor,
 * pendente/rejeitado/bloqueado -> /ativacao.
 */

export type AuthProfile = { role: string; status: string };

/**
 * Retorna a rota para onde o utilizador deve ser enviado após login
 * ou quando já está autenticado (ex.: visita /entrar já logado).
 * 
 * Regras:
 * - admin (role='admin' && status='approved') → /admin
 * - vendedor aprovado (status='approved') → /vendedor
 * - qualquer outro caso (pending/rejected/blocked/suspended) → /ativacao
 */
export function resolvePostLoginRoute(profile: AuthProfile): string {
  // Admin sempre vai para /admin (assumindo que admin está sempre approved)
  if (profile.role === 'admin' && profile.status === 'approved') {
    return '/admin';
  }
  // Vendedor/provider aprovado vai para /vendedor
  if (profile.status === 'approved') {
    return '/vendedor';
  }
  // Qualquer outro caso (pending/rejected/blocked/suspended) → /ativacao
  return '/ativacao';
}
