import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'

/**
 * GET /api/admin/solicitacoes
 * Lista todas as seller_requests com dados do profile.
 * Usa service role no servidor para contornar RLS e garantir que o admin veja os dados.
 * Apenas utilizadores admin podem chamar esta rota.
 */
export async function GET() {
    try {
        const supabase = await createClient()
        if (!supabase) return NextResponse.json({ error: 'Supabase não configurado' }, { status: 503 })
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
            return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
        }

        const { data: isAdmin, error: rpcError } = await supabase.rpc('is_admin', { uid: user.id })
        const isAdminUser = !rpcError && isAdmin === true

        if (!isAdminUser) {
            const { data: profile } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', user.id)
                .maybeSingle()
            if (profile?.role !== 'admin') {
                return NextResponse.json({ error: 'Acesso negado: apenas administradores' }, { status: 403 })
            }
        }

        const admin = createAdminClient()
        const { data: requests, error: reqError } = await admin
            .from('seller_requests')
            .select('*')
            .order('created_at', { ascending: false })

        if (reqError) {
            console.error('[API/ADMIN/SOLICITACOES] Error loading seller_requests:', reqError.message, reqError.code)
            return NextResponse.json(
                { error: reqError.message, code: reqError.code },
                { status: 500 }
            )
        }

        const list = requests ?? []
        if (list.length === 0) {
            console.log('[API/ADMIN/SOLICITACOES] seller_requests empty (count=0)')
            return NextResponse.json({ requests: [], total: 0 })
        }

        const userIds = [...new Set(list.map((r: { user_id: string }) => r.user_id).filter(Boolean))]
        const { data: profiles, error: profError } = await admin
            .from('profiles')
            .select('id, full_name, email, whatsapp')
            .in('id', userIds)

        if (profError) {
            console.error('[API/ADMIN/SOLICITACOES] Error loading profiles:', profError.message)
        }

        const profileMap = new Map((profiles ?? []).map((p: { id: string }) => [p.id, p]))
        const merged = list.map((r: Record<string, unknown>) => ({
            ...r,
            profiles: profileMap.get(r.user_id as string) ?? {
                full_name: 'Usuário',
                email: '',
                whatsapp: ''
            }
        }))

        console.log('[API/ADMIN/SOLICITACOES] Returning requests:', merged.length)
        return NextResponse.json({ requests: merged, total: merged.length })
    } catch (err: unknown) {
        console.error('[API/ADMIN/SOLICITACOES] Unexpected error:', err)
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        )
    }
}
