/**
 * Admin categorias: PATCH (editar) e DELETE (apagar)
 */
import type { SupabaseClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'

async function ensureAdmin(supabase: SupabaseClient, userId: string) {
    const { data } = await supabase.rpc('is_admin', { uid: userId })
    if (data === true) return true
    const { data: p } = await supabase.from('profiles').select('role').eq('id', userId).maybeSingle()
    return p?.role === 'admin'
}

export const dynamic = 'force-dynamic'

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
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
        const updates: Record<string, unknown> = {}
        if (body?.name != null) updates.name = String(body.name).trim()
        if (body?.slug != null) updates.slug = String(body.slug).trim()
        if (body?.icon !== undefined) updates.icon = body.icon ?? null

        if (Object.keys(updates).length === 0) {
            return NextResponse.json({ error: 'Nenhum campo para atualizar' }, { status: 400 })
        }

        const admin = createAdminClient()
        const { data: updated, error } = await admin
            .from('categories')
            .update(updates)
            .eq('id', id)
            .select()
            .single()

        if (error) {
            console.error('[API/ADMIN/CATEGORIAS] PATCH error:', error.message, error.code)
            return NextResponse.json(
                { ok: false, message: error.message, code: error.code },
                { status: 500 }
            )
        }

        return NextResponse.json(updated)
    } catch (err: unknown) {
        console.error('[API/ADMIN/CATEGORIAS] PATCH unexpected error:', err)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

export async function DELETE(
    _request: Request,
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

        const admin = createAdminClient()
        const { error } = await admin.from('categories').delete().eq('id', id)

        if (error) {
            console.error('[API/ADMIN/CATEGORIAS] DELETE error:', error.message, error.code)
            return NextResponse.json(
                { ok: false, message: error.message, code: error.code },
                { status: 500 }
            )
        }

        return NextResponse.json({ ok: true })
    } catch (err: unknown) {
        console.error('[API/ADMIN/CATEGORIAS] DELETE unexpected error:', err)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
