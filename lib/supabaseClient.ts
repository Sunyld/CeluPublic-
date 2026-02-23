/**
 * Supabase client SINGLETON — único no app inteiro.
 *
 * Regras:
 * - createClient chamado UMA única vez (guard `supabaseInstance`).
 * - storageKey FIXO → evita logout em refresh por chave trocada.
 * - storage: window.localStorage explícito → evita SSR issues e garante persistência.
 * - persistSession: true + autoRefreshToken: true → sessão estável.
 * - detectSessionInUrl: true → necessário para PKCE/OAuth callback.
 *
 * USE SEMPRE `getSupabase()` nos repos/context. Nunca re-importe createClient.
 */
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { AppError, ERROR_CODES } from './errors';
import { __STORAGE_HELPERS_VERSION__ } from './storageHelpers';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL as string | undefined;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string | undefined;
const useSupabaseFlag =
  String(process.env.NEXT_PUBLIC_USE_SUPABASE ?? '').toLowerCase() === 'true';

const hasCredentials = !!url && !!anonKey;

/**
 * Indica se o modo Supabase está efetivamente ativo (flag + credenciais válidas).
 */
export const useSupabase = useSupabaseFlag && hasCredentials;

/**
 * Erro de configuração quando o flag está ativo mas faltam credenciais.
 */
export const supabaseConfigError =
  useSupabaseFlag && !hasCredentials
    ? new AppError(
      ERROR_CODES.SUPABASE_CONFIG,
      'NEXT_PUBLIC_USE_SUPABASE=true mas NEXT_PUBLIC_SUPABASE_URL ou NEXT_PUBLIC_SUPABASE_ANON_KEY não estão definidos.'
    )
    : null;

/**
 * Chave de storage FIXA.
 * CRÍTICO: deve ser estável entre reloads e builds.
 * Se mudar → todos os utilizadores fazem logout.
 */
const SUPABASE_STORAGE_KEY = 'celu_auth_v1';

/**
 * ID único desta instância (singleton proof).
 * Deve ser igual em todos os lugares do app.
 */
const CLIENT_INSTANCE_ID = typeof crypto !== 'undefined' ? crypto.randomUUID() : 'ssr-client-id';

// ── Log de arranque ────────────────────────────────────────────────────────────
if (process.env.NODE_ENV === 'development') {
  // eslint-disable-next-line no-console
  console.log('[BOOT] Supabase flag:', useSupabaseFlag, '| hasCredentials:', hasCredentials);
  // eslint-disable-next-line no-console
  // console.log('[BOOT] storageHelpers version:', __STORAGE_HELPERS_VERSION__);
  // eslint-disable-next-line no-console
  console.log('[BOOT] CLIENT_INSTANCE_ID:', CLIENT_INSTANCE_ID);
  if (supabaseConfigError) {
    // eslint-disable-next-line no-console
    console.error('[BOOT] Supabase config error:', supabaseConfigError.message);
  }
}

let supabaseInstance: SupabaseClient | null = null;

function createSupabase(): SupabaseClient | null {
  // Modo local ou credenciais em falta: não cria client
  if (!useSupabaseFlag || !hasCredentials) {
    return null;
  }

  // SINGLETON: devolve instância existente se já criada
  if (supabaseInstance) {
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.log('[BOOT] Supabase singleton reutilizado, clientId:', CLIENT_INSTANCE_ID);
    }
    return supabaseInstance;
  }

  try {
    supabaseInstance = createClient(url!, anonKey!, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        // CRÍTICO: storageKey fixo evita logout em refresh por chave instável
        storageKey: SUPABASE_STORAGE_KEY,
        // storage explícito: garante localStorage e não sessionStorage
        storage: typeof window !== 'undefined' ? window.localStorage : undefined,
        // flowType PKCE: mais seguro para OAuth
        flowType: 'pkce',
      },
    });

    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.log('[BOOT] Supabase client CRIADO:', {
        clientId: CLIENT_INSTANCE_ID,
        storageKey: SUPABASE_STORAGE_KEY,
        url: url?.slice(0, 40) + '...',
      });
    }
    return supabaseInstance;
  } catch (err: any) {
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.error('[BOOT] Failed to create Supabase client:', err);
      // eslint-disable-next-line no-console
      console.warn('[BOOT] Falling back to local mode');
    }
    return null;
  }
}

/** Devolve o client Supabase singleton; null se não configurado. */
export function getSupabase(): SupabaseClient | null {
  return createSupabase();
}

/**
 * Retorna o ID único desta instância do client.
 * Use em 3 lugares diferentes para provar que é singleton.
 */
export function getSupabaseClientId(): string {
  return CLIENT_INSTANCE_ID;
}

/** Client pronto quando Supabase está ativo. Pode ser null se env faltar. */
export const supabase = createSupabase();

// Prova singleton no boot (DEV only)
if (process.env.NODE_ENV === 'development' && supabase) {
  // eslint-disable-next-line no-console
  console.log('[BOOT] supabase export clientId:', CLIENT_INSTANCE_ID, '(deve ser igual em AuthContext e repos)');
}
