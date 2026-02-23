/**
 * Serializa erros Supabase/Postgrest para logs e respostas JSON.
 * Evita "{}" no console quando o objeto não é enumerável.
 */
export function serializeSupabaseError(err: unknown): {
    message: string;
    code?: string;
    details?: unknown;
    hint?: string;
    status?: number;
    name?: string;
} {
    if (err == null) return { message: 'Unknown error' };

    const e = err as Record<string, unknown>;
    return {
        message: typeof e?.message === 'string' ? e.message : String(err),
        code: typeof e?.code === 'string' ? e.code : undefined,
        details: e?.details,
        hint: typeof e?.hint === 'string' ? e.hint : undefined,
        status: typeof e?.status === 'number' ? e.status : undefined,
        name: typeof e?.name === 'string' ? e.name : undefined,
    };
}
