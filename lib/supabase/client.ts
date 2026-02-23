import { createBrowserClient } from '@supabase/ssr'

/**
 * Creates the Supabase browser client for auth.
 * Returns null when env vars are missing (e.g. during build/prerender) to avoid throwing.
 */
export function createClient() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (!url || !anonKey) {
        if (process.env.NODE_ENV === 'development') {
            // eslint-disable-next-line no-console
            console.warn('[Supabase] Client: NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY missing - client not created')
        }
        return null
    }
    return createBrowserClient(url, anonKey)
}
