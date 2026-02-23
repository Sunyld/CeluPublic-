/**
 * Instrumentação de autenticação para debugging e rastreamento de fluxos.
 * Gera trace IDs únicos por tentativa de login e loga eventos estruturados.
 */

export type AuthEventType =
  | 'SIGNED_IN'
  | 'SIGNED_OUT'
  | 'TOKEN_REFRESHED'
  | 'PROFILE_LOADING'
  | 'PROFILE_READY'
  | 'PROFILE_ERROR'
  | 'NAVIGATE'
  | 'SESSION_BEFORE'
  | 'SESSION_AFTER';

export type AuthFlowLog = {
  attemptId: string;
  timestamp: number;
  event: AuthEventType;
  data?: Record<string, any>;
};

const LOGS: AuthFlowLog[] = [];
const MAX_LOGS = 100;

/**
 * Gera um ID único para rastrear uma tentativa de login/fluxo de auth.
 */
export function generateAuthAttemptId(): string {
  return `auth_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

/**
 * Loga um evento de autenticação (DEV only).
 */
export function logAuthEvent(
  attemptId: string,
  event: AuthEventType,
  data?: Record<string, any>
): void {
  if (process.env.NODE_ENV !== 'development') return;

  const log: AuthFlowLog = {
    attemptId,
    timestamp: Date.now(),
    event,
    data,
  };

  LOGS.push(log);
  if (LOGS.length > MAX_LOGS) {
    LOGS.shift();
  }

  // eslint-disable-next-line no-console
  console.log(`[AUTH_FLOW] ${event}`, {
    attemptId,
    ...data,
  });
}

/**
 * Retorna os logs recentes (útil para debugging).
 */
export function getAuthLogs(): AuthFlowLog[] {
  return [...LOGS];
}

/**
 * Limpa os logs (útil para testes).
 */
export function clearAuthLogs(): void {
  LOGS.length = 0;
}
