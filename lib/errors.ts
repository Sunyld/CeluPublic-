/**
 * Standardized app errors for repository and UI feedback.
 */

export const ERROR_CODES = {
  LIMIT_REACHED: 'LIMIT_REACHED',
  NOT_FOUND: 'NOT_FOUND',
  UNAUTHORIZED: 'UNAUTHORIZED',
  TIMEOUT: 'TIMEOUT',
  SUPABASE_CONFIG: 'SUPABASE_CONFIG',
  STORAGE_BUCKET_MISSING: 'STORAGE_BUCKET_MISSING',
  UNKNOWN: 'UNKNOWN',
} as const;

export type AppErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES];

export class AppError extends Error {
  constructor(
    public readonly code: AppErrorCode,
    message: string,
    /** Optional low-level details for logging/diagnostics (never mostrado cru na UI). */
    public readonly details?: unknown
  ) {
    super(message);
    this.name = 'AppError';
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

/** User-facing messages in Portuguese. */
export const ERROR_MESSAGES: Record<AppErrorCode, string> = {
  [ERROR_CODES.LIMIT_REACHED]:
    'Atingiu o limite de anúncios para este tipo. Remova um anúncio antigo ou contacte o administrador.',
  [ERROR_CODES.NOT_FOUND]: 'Não encontrado.',
  [ERROR_CODES.UNAUTHORIZED]: 'Sem permissão para esta ação.',
  [ERROR_CODES.TIMEOUT]: 'A operação demorou demasiado tempo. Tente novamente.',
  [ERROR_CODES.SUPABASE_CONFIG]:
    'Configuração do Supabase em falta. Verifique as variáveis de ambiente no servidor.',
  [ERROR_CODES.STORAGE_BUCKET_MISSING]:
    "Bucket de armazenamento em falta no Supabase. Confirme o nome do bucket no dashboard.",
  [ERROR_CODES.UNKNOWN]: 'Ocorreu um erro inesperado. Tente novamente.',
};

export function getMessageForError(error: unknown): string {
  if (error instanceof AppError) return ERROR_MESSAGES[error.code] ?? error.message;
  if (error instanceof Error) return error.message;
  return 'Ocorreu um erro. Tente novamente.';
}

/**
 * Converte qualquer erro JS/Supabase num AppError consistente.
 */
export function toAppError(error: unknown, context?: { fallbackMessage?: string }): AppError {
  if (error instanceof AppError) return error;

  // Supabase client error (postgrest, storage, auth)
  const supa = error as any;
  if (supa?.message || supa?.status || supa?.code) {
    const status = supa.status as number | undefined;
    const message: string =
      supa.message ??
      context?.fallbackMessage ??
      'Erro ao comunicar com o servidor. Tente novamente.';

    if (status === 401 || status === 403) {
      return new AppError(ERROR_CODES.UNAUTHORIZED, message, supa);
    }

    if (status === 404) {
      return new AppError(ERROR_CODES.NOT_FOUND, message, supa);
    }

    return new AppError(ERROR_CODES.UNKNOWN, message, supa);
  }

  if (error instanceof Error) {
    return new AppError(ERROR_CODES.UNKNOWN, error.message, error);
  }

  return new AppError(
    ERROR_CODES.UNKNOWN,
    context?.fallbackMessage ?? 'Ocorreu um erro. Tente novamente.',
    error
  );
}

/**
 * Envolve uma Promise com timeout e lança AppError se o tempo for excedido.
 */
export async function withTimeout<T>(
  promise: PromiseLike<T>,
  ms: number,
  label = 'Operação'
): Promise<T> {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(
        new AppError(
          ERROR_CODES.TIMEOUT,
          `${label} demorou demasiado tempo a responder. Tente novamente mais tarde.`
        )
      );
    }, ms);
  });

  try {
    const result = await Promise.race([promise, timeoutPromise]);
    return result as T;
  } finally {
    if (timeoutId) clearTimeout(timeoutId);
  }
}

