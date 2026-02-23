/**
 * GET /api/profile/me
 * Retorna o perfil do utilizador autenticado (server-side, sem cache).
 * Usado por refreshProfile para obter dados frescos do BD.
 */
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
    try {
        const supabase = await createClient()
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
            return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
        }

        const admin = createAdminClient()
        const { data: profile, error } = await admin
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .maybeSingle()

        if (error) {
            console.error('[API/PROFILE/ME] Error:', error)
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        if (!profile) {
            return NextResponse.json({ error: 'Perfil não encontrado' }, { status: 404 })
        }

        const headers = new Headers()
        headers.set('Cache-Control', 'no-store, no-cache, must-revalidate')

        return NextResponse.json(profile, { headers })
    } catch (err: unknown) {
        console.error('[API/PROFILE/ME] Unexpected error:', err)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
