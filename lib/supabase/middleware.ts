import { createServerClient } from '@supabase/ssr'
import { type NextRequest, NextResponse } from 'next/server'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

/**
 * Refresh session in middleware so the browser and server stay in sync.
 * Must call getClaims() right after createServerClient; otherwise users can be logged out on refresh.
 * @see https://supabase.com/docs/guides/auth/server-side/nextjs
 * During build/prerender, env vars may be absent - skip Supabase to avoid throwing.
 */
export async function updateSession(request: NextRequest) {
    let response = NextResponse.next({ request })

    if (!url || !anonKey) {
        if (process.env.NODE_ENV === 'development') {
            // eslint-disable-next-line no-console
            console.warn('[Supabase] Middleware: NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY missing - skipping session refresh')
        }
        return response
    }

    const supabase = createServerClient(
        url,
        anonKey,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
                    cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
                    response = NextResponse.next({ request })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        response.cookies.set(name, value, options ?? {})
                    )
                },
            },
        }
    )

    // Process OAuth code exchange if present (?code= in URL)
    // getSession() processes the OAuth code automatically when using @supabase/ssr
    const { data: { session } } = await supabase.auth.getSession()
    
    // Then validate/refresh the token with getClaims()
    // This ensures tokens are refreshed and cookies are updated
    await supabase.auth.getClaims()

    return response
}
