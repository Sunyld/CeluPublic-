/**
 * PATCH /api/admin/usuarios/[id]
 * Atualiza status do perfil (approve, reject, block, etc).
 */
import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'

async function ensureAdmin(supabase: import('@supabase/supabase-js').SupabaseClient, userId: string) {
    const { data } = await supabase.rpc('is_admin', { uid: userId })
    if (data === true) return true
    const { data: p } = await supabase.from('profiles').select('role').eq('id', userId).maybeSingle()
    return p?.role === 'admin'
}

export const dynamic = 'force-dynamic'

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        if (!id) return NextResponse.json({ error: 'id obrigatório' }, { status: 400 })

        const supabase = await createClient()
        if (!supabase) return NextResponse.json({ error: 'Supabase não configurado' }, { status: 503 })
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
            return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
        }

        if (!(await ensureAdmin(supabase, user.id))) {
            return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })
        }

        const body = await request.json().catch(() => ({}))
        const status = body?.status
        const validStatuses = ['pending', 'approved', 'rejected', 'blocked', 'suspended']
        if (!status || !validStatuses.includes(status)) {
            return NextResponse.json(
                { error: 'status inválido. Use: pending, approved, rejected, blocked, suspended' },
                { status: 400 }
            )
        }

        const admin = createAdminClient()
        const { data: updated, error } = await admin
            .from('profiles')
            .update({ status, updated_at: new Date().toISOString() })
            .eq('id', id)
            .select()
            .single()

        if (error) {
            console.error('[API/ADMIN/USUARIOS] PATCH error:', error.message, error.code)
            return NextResponse.json(
                { ok: false, message: error.message, code: error.code },
                { status: 500 }
            )
        }

        return NextResponse.json(updated)
    } catch (err: unknown) {
        console.error('[API/ADMIN/USUARIOS] PATCH unexpected error:', err)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
