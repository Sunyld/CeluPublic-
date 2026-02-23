/**
 * GET /api/admin/usuarios
 * Lista todos os profiles (sellers, admins, pending, approved, rejected).
 * Usa service role. Valida admin via is_admin RPC + profiles.role.
 */
import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'
export const revalidate = 0

async function ensureAdmin(supabase: Awaited<ReturnType<typeof createClient>>, userId: string) {
    const { data } = await supabase.rpc('is_admin', { uid: userId })
    if (data === true) return true
    const { data: p } = await supabase.from('profiles').select('role').eq('id', userId).maybeSingle()
    return p?.role === 'admin'
}

export async function GET() {
    try {
        const supabase = await createClient()
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
            return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
        }

        if (!(await ensureAdmin(supabase, user.id))) {
            return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })
        }

        const admin = createAdminClient()
        const { data: rows, error } = await admin
            .from('profiles')
            .select('id, email, full_name, whatsapp, role, status, created_at, updated_at, account_type, province, city')
            .order('created_at', { ascending: false })

        if (error) {
            console.error('[API/ADMIN/USUARIOS] error:', error.message, error.code, error.details)
            return NextResponse.json(
                { ok: false, message: error.message, code: error.code },
                { status: 500 }
            )
        }

        const users = (rows ?? []).map((r: Record<string, unknown>) => ({
            id: r.id,
            email: r.email || '',
            name: r.full_name || 'Utilizador',
            role: r.role === 'admin' ? 'admin' : 'seller',
            status: r.status || 'pending',
            accountType: r.account_type ?? undefined,
            whatsapp: r.whatsapp ?? undefined,
            province: r.province ?? undefined,
            city: r.city ?? undefined,
            createdAt: r.created_at || new Date().toISOString(),
            updatedAt: r.updated_at,
        }))

        console.log('[API/ADMIN/USUARIOS] returning', users.length, 'users')
        return NextResponse.json({ users, total: users.length })
    } catch (err: unknown) {
        console.error('[API/ADMIN/USUARIOS] unexpected error:', err)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
