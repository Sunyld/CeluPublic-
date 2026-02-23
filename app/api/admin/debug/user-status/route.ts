/**
 * GET /api/admin/debug/user-status?userId=...
 * Rota de debug (admin only): retorna profile + seller_request do userId.
 * Usar para validar estado no BD após aprovação.
 */
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
    try {
        const supabase = await createClient()
        if (!supabase) return NextResponse.json({ error: 'Supabase não configurado' }, { status: 503 })
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
            return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
        }

        const { data: isAdmin } = await supabase.rpc('is_admin', { uid: user.id })
        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .maybeSingle()

        if (!isAdmin && profile?.role !== 'admin') {
            return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })
        }

        const { searchParams } = new URL(request.url)
        const userId = searchParams.get('userId')
        if (!userId) {
            return NextResponse.json(
                { error: 'userId é obrigatório' },
                { status: 400 }
            )
        }

        const admin = createAdminClient()
        const [{ data: profileRow }, { data: requestRow }] = await Promise.all([
            admin.from('profiles').select('*').eq('id', userId).maybeSingle(),
            admin.from('seller_requests').select('*').eq('user_id', userId).maybeSingle()
        ])

        return NextResponse.json({
            profile: profileRow,
            seller_request: requestRow
        })
    } catch (err: unknown) {
        console.error('[API/ADMIN/DEBUG/USER-STATUS] Error:', err)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
