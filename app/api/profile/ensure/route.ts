import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

/**
 * REGRA CRÍTICA: Se profile já existe com status 'approved' ou 'rejected',
 * NUNCA sobrescrever status/role. Isso evita "aprovado mas preso em ativação".
 */
export async function POST(request: Request) {
    try {
        const { id, email, full_name, avatar_url, whatsapp, province, city, account_type } = await request.json()

        if (!id || !email) {
            return NextResponse.json(
                { error: 'Missing id or email' },
                { status: 400 }
            )
        }

        const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
        if (!supabaseServiceKey) {
            console.error('[API/PROFILE/ENSURE] Missing SUPABASE_SERVICE_ROLE_KEY in environment');
            return NextResponse.json(
                { error: 'Configuração do servidor incompleta (Missing Service Key). Verifique o ficheiro .env' },
                { status: 500 }
            )
        }

        const supabase = createAdminClient()
        const isSpecialAdmin = ['sunyldjosesomailamatapa@gmail.com', 'celupublic@gmail.com'].includes(email.toLowerCase())
        const emailNorm = email.toLowerCase()

        // 1) SELECT existente primeiro - NUNCA desaprovar quem já foi aprovado/rejeitado
        const { data: existing } = await supabase
            .from('profiles')
            .select('id, status, role')
            .eq('id', id)
            .maybeSingle()

        const preserveStatus = existing && ['approved', 'rejected'].includes(existing.status || '')

        if (preserveStatus) {
            console.log('[ENSURE] existing profile status/role preserved:', {
                userId: id.slice(0, 8),
                status: existing!.status,
                role: existing!.role,
                message: 'NOT overwriting - user was already approved/rejected'
            })
            const { data: profile } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', id)
                .single()
            return NextResponse.json(profile)
        }

        const role = isSpecialAdmin ? 'admin' : (existing?.role || 'seller')
        const status = isSpecialAdmin ? 'approved' : (existing?.status || 'pending')

        const upsertPayload: Record<string, unknown> = {
            id,
            email: emailNorm,
            full_name: full_name || 'Usuário',
            whatsapp: whatsapp || null,
            province: province || null,
            city: city || null,
            account_type: ['seller', 'provider', 'both'].includes(account_type) ? account_type : 'seller',
            role,
            status,
            updated_at: new Date().toISOString()
        }

        const { data: profile, error } = await supabase
            .from('profiles')
            .upsert(upsertPayload, { onConflict: 'id' })
            .select()
            .single()

        if (error) {
            console.error('[API/PROFILE/ENSURE] Upsert error:', error)
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        // 2) Garantir seller_request apenas para pending
        if (status === 'pending' && role !== 'admin') {
            console.log('[API/PROFILE/ENSURE] Ensuring seller_request for pending user:', {
                userId: id.slice(0, 8),
                email: email.toLowerCase().slice(0, 20),
                role,
                status
            })

            const { data: requestData, error: reqError } = await supabase
                .from('seller_requests')
                .upsert({
                    user_id: id,
                    status: 'pending'
                }, { onConflict: 'user_id' })
                .select()

            if (reqError) {
                console.error('[API/PROFILE/ENSURE] Seller request upsert ERROR:', {
                    userId: id.slice(0, 8),
                    error: reqError.message,
                    code: reqError.code,
                    details: reqError.details,
                    hint: reqError.hint
                })
                // Não falhar a requisição se seller_request falhar - trigger pode criar depois
            } else if (requestData && requestData.length > 0) {
                console.log('[API/PROFILE/ENSURE] Seller request ensured SUCCESS:', {
                    userId: id.slice(0, 8),
                    requestId: requestData[0].id?.slice(0, 8),
                    requestStatus: requestData[0].status,
                    created: !!requestData[0].id
                })
            } else {
                console.warn('[API/PROFILE/ENSURE] Seller request upsert returned empty data:', {
                    userId: id.slice(0, 8),
                    warning: 'No data returned from upsert'
                })
            }
        } else {
            console.log('[API/PROFILE/ENSURE] Skipping seller_request creation:', {
                userId: id.slice(0, 8),
                reason: status === 'pending' ? 'user is admin' : 'user is approved',
                status,
                role
            })
        }

        console.log('[API/PROFILE/ENSURE] Profile ensured successfully:', {
            userId: id.slice(0, 8),
            email: email.toLowerCase().slice(0, 20),
            role,
            status,
            isAdmin: isSpecialAdmin,
            profileId: profile?.id?.slice(0, 8)
        })
        return NextResponse.json(profile)
    } catch (err: any) {
        console.error('[API/PROFILE/ENSURE] Unexpected error:', err)
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        )
    }
}
