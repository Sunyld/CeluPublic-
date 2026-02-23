/**
 * Admin categorias: GET (listar) e POST (criar)
 * Usa service role para contornar RLS. Valida admin via is_admin RPC + profiles.role.
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
export const revalidate = 0

export async function GET() {
    try {
        const supabase = await createClient()
        if (!supabase) return NextResponse.json({ error: 'Supabase não configurado' }, { status: 503 })
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
            return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
        }

        const isAdmin = await ensureAdmin(supabase, user.id)
        if (!isAdmin) {
            return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })
        }

        const admin = createAdminClient()
        const { data, error } = await admin
            .from('categories')
            .select('*')
            .order('name', { ascending: true })

        if (error) {
            console.error('[API/ADMIN/CATEGORIAS] list error:', error.message, error.code, error.details)
            return NextResponse.json(
                { ok: false, message: error.message, code: error.code, details: error.details },
                { status: 500 }
            )
        }

        console.log('[API/ADMIN/CATEGORIAS] returning', (data ?? []).length, 'categories')
        return NextResponse.json(data ?? [])
    } catch (err: unknown) {
        console.error('[API/ADMIN/CATEGORIAS] unexpected error:', err)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const supabase = await createClient()
        if (!supabase) return NextResponse.json({ error: 'Supabase não configurado' }, { status: 503 })
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
            return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
        }

        const isAdmin = await ensureAdmin(supabase, user.id)
        if (!isAdmin) {
            return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })
        }

        const body = await request.json().catch(() => ({}))
        const name = (body?.name ?? '').toString().trim()
        const slug = (body?.slug ?? name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')).toString().trim()
        const icon = body?.icon ?? null

        if (!name || !slug) {
            return NextResponse.json(
                { ok: false, message: 'name e slug são obrigatórios' },
                { status: 400 }
            )
        }

        const admin = createAdminClient()
        const payload = { name, slug, icon }
        const { data: inserted, error } = await admin
            .from('categories')
            .insert(payload)
            .select()
            .single()

        if (error) {
            console.error('[API/CATEGORIES/CREATE] error:', error.message, error.code, error.details)
            return NextResponse.json(
                { ok: false, message: error.message, code: error.code, details: error.details },
                { status: 500 }
            )
        }

        console.log('[API/CATEGORIES/CREATE] adminEmail', user.email, 'userId', user.id.slice(0, 8), 'payload', payload, 'result id', inserted?.id)
        return NextResponse.json(inserted)
    } catch (err: unknown) {
        console.error('[API/ADMIN/CATEGORIAS] POST unexpected error:', err)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
