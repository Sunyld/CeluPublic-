import { createServerClient } from '@supabase/ssr'
import { type NextRequest, NextResponse } from 'next/server'

/**
 * Refresh session in middleware so the browser and server stay in sync.
 * Must call getClaims() right after createServerClient; otherwise users can be logged out on refresh.
 * @see https://supabase.com/docs/guides/auth/server-side/nextjs
 */
export async function updateSession(request: NextRequest) {
    let response = NextResponse.next({ request })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
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
