/**
 * Padrão de resposta de API para erros.
 */
export type ApiErrorPayload = {
  ok: false;
  code?: string;
  message: string;
  details?: unknown;
};

export function apiError(
  message: string,
  status: number,
  options?: { code?: string; details?: unknown }
): Response {
  const body: ApiErrorPayload = {
    ok: false,
    message,
    ...(options?.code && { code: options.code }),
    ...(options?.details !== undefined && { details: options.details }),
  };
  return Response.json(body, { status });
}
