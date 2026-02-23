import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'

/**
 * POST /api/admin/solicitacoes/reject
 * Rejeita uma solicitação de vendedor.
 * Usa service role para garantir que as atualizações funcionem sem RLS.
 */
export async function POST(request: Request) {
    try {
        const supabase = await createClient()
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
            return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
        }

        const { data: isAdmin } = await supabase.rpc('is_admin', { uid: user.id })
        if (!isAdmin) {
            const { data: profile } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', user.id)
                .maybeSingle()
            if (profile?.role !== 'admin') {
                return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })
            }
        }

        const body = await request.json().catch(() => ({}))
        const requestId = body?.requestId || body?.request_id
        const userId = body?.userId || body?.user_id
        const reason = body?.reason || body?.note || ''

        if (!requestId || !userId) {
            return NextResponse.json(
                { error: 'requestId e userId são obrigatórios' },
                { status: 400 }
            )
        }

        const admin = createAdminClient()

        const { error: reqErr } = await admin
            .from('seller_requests')
            .update({
                status: 'rejected',
                note: reason || null,
                reviewed_by: user.id,
                reviewed_at: new Date().toISOString()
            })
            .eq('id', requestId)

        if (reqErr) {
            console.error('[API/ADMIN/REJECT] seller_requests update error:', reqErr.message)
            return NextResponse.json(
                { error: reqErr.message, code: reqErr.code },
                { status: 500 }
            )
        }

        const { error: profErr } = await admin
            .from('profiles')
            .update({
                status: 'rejected',
                updated_at: new Date().toISOString()
            })
            .eq('id', userId)

        if (profErr) {
            console.error('[API/ADMIN/REJECT] profiles update error:', profErr.message)
            return NextResponse.json(
                { error: profErr.message, code: profErr.code },
                { status: 500 }
            )
        }

        console.log('[API/ADMIN/REJECT] OK requestId:', requestId, 'userId:', userId)
        return NextResponse.json({
            ok: true,
            updated: { requestId, userId, status: 'rejected' }
        })
    } catch (err: unknown) {
        console.error('[API/ADMIN/REJECT] Unexpected error:', err)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
