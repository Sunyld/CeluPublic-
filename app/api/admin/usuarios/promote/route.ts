/**
 * POST /api/admin/usuarios/promote
 * Promover utilizador a admin. Valida admin via is_admin.
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

const PROTECTED_EMAILS = ['celupublic@gmail.com', 'sunyldjosesomailamatapa@gmail.com'].map((e) => e.toLowerCase())

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
    try {
        const supabase = await createClient()
        if (!supabase) return NextResponse.json({ error: 'Supabase não configurado' }, { status: 503 })
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
            return NextResponse.json({ ok: false, message: 'Não autenticado' }, { status: 401 })
        }

        if (!(await ensureAdmin(supabase, user.id))) {
            return NextResponse.json({ ok: false, message: 'Acesso negado' }, { status: 403 })
        }

        const body = await request.json().catch(() => ({}))
        const userId = body?.userId ?? body?.id
        if (!userId || typeof userId !== 'string') {
            return NextResponse.json({ ok: false, message: 'userId obrigatório' }, { status: 400 })
        }

        const admin = createAdminClient()
        const { data: profile, error: profileErr } = await admin
            .from('profiles')
            .update({ role: 'admin', status: 'approved' })
            .eq('id', userId)
            .select()
            .single()

        if (profileErr) {
            console.error('[API/ADMIN/USUARIOS/PROMOTE] error:', profileErr.message, profileErr.code)
            return NextResponse.json(
                { ok: false, message: profileErr.message ?? 'Erro ao promover' },
                { status: 500 }
            )
        }

        console.log('[API/ADMIN/USUARIOS/PROMOTE] userId:', userId.slice(0, 8), 'by:', user.id.slice(0, 8))
        return NextResponse.json({ ok: true, profile })
    } catch (err: unknown) {
        console.error('[API/ADMIN/USUARIOS/PROMOTE] unexpected error:', err)
        return NextResponse.json(
            { ok: false, message: err instanceof Error ? err.message : 'Erro interno' },
            { status: 500 }
        )
    }
}
