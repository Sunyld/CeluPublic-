import { createClient } from '@supabase/supabase-js'

/**
 * Supabase Admin client using SERVICE_ROLE_KEY.
 * USE ONLY ON THE SERVER (Route Handlers, Server Actions).
 * This client bypasses RLS.
 */
export function createAdminClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
        throw new Error('[ADMIN] Supabase URL or Service Role Key is missing. Check your environment variables.');
    }

    return createClient(supabaseUrl || '', supabaseServiceKey || '', {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    })
}
