/**
 * POST /api/ads/[id]/increment-view
 * Increment ad views (prevents duplicate views per visitor per day)
 */
import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { serializeSupabaseError } from '@/lib/supabase/error'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        if (!id) return NextResponse.json({ error: 'id obrigatório' }, { status: 400 })

        const body = await request.json()
        const { visitorIdentifier, ip, userAgent } = body

        if (!visitorIdentifier) {
            return NextResponse.json({ error: 'visitorIdentifier obrigatório' }, { status: 400 })
        }

        const admin = createAdminClient()

        // Call the increment_ad_view RPC function
        const { data, error } = await admin.rpc('increment_ad_view', {
            p_ad_id: id,
            p_visitor_identifier: visitorIdentifier,
            p_ip: ip,
            p_user_agent: userAgent,
        })

        if (error) {
            const ser = serializeSupabaseError(error)
            console.error('[API/ADS/INCREMENT-VIEW] RPC error:', ser)
            return NextResponse.json({ ok: false, ...ser }, { status: 500 })
        }

        return NextResponse.json({ ok: true, counted: !!data })
    } catch (err: unknown) {
        const ser = serializeSupabaseError(err)
        console.error('[API/ADS/INCREMENT-VIEW] unexpected error:', ser)
        return NextResponse.json({ ok: false, message: ser.message }, { status: 500 })
    }
}
