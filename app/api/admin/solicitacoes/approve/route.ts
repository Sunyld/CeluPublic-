import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'

/**
 * POST /api/admin/solicitacoes/approve
 * Aprova uma solicitação de vendedor.
 * Usa service role para garantir que as atualizações funcionem sem RLS.
 */
export async function POST(request: Request) {
    try {
        const supabase = await createClient()
        if (!supabase) return NextResponse.json({ error: 'Supabase não configurado' }, { status: 503 })
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
                status: 'approved',
                reviewed_by: user.id,
                reviewed_at: new Date().toISOString()
            })
            .eq('id', requestId)

        if (reqErr) {
            console.error('[API/ADMIN/APPROVE] seller_requests update error:', reqErr.message)
            return NextResponse.json(
                { error: reqErr.message, code: reqErr.code },
                { status: 500 }
            )
        }

        const { error: profErr } = await admin
            .from('profiles')
            .update({
                status: 'approved',
                role: 'seller',
                updated_at: new Date().toISOString()
            })
            .eq('id', userId)

        if (profErr) {
            console.error('[API/ADMIN/APPROVE] profiles update error:', profErr.message)
            return NextResponse.json(
                { error: profErr.message, code: profErr.code },
                { status: 500 }
            )
        }

        // Verificação: SELECT final para garantir e logar
        const [{ data: profileRow }, { data: requestRow }] = await Promise.all([
            admin.from('profiles').select('status, role').eq('id', userId).maybeSingle(),
            admin.from('seller_requests').select('status').eq('id', requestId).maybeSingle()
        ])

        const debug = {
            profiles_status: profileRow?.status ?? null,
            profiles_role: profileRow?.role ?? null,
            seller_requests_status: requestRow?.status ?? null
        }
        console.log('[APPROVE] final status/role gravados:', { requestId, userId, ...debug })

        return NextResponse.json({
            ok: true,
            updated: { requestId, userId, status: 'approved' },
            debug
        })
    } catch (err: unknown) {
        console.error('[API/ADMIN/APPROVE] Unexpected error:', err)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
