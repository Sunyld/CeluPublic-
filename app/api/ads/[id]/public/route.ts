/**
 * GET /api/ads/[id]/public
 * Detalhe público: anúncio published + owner approved. Inclui imagens (paths → URLs).
 */
import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { serializeSupabaseError } from '@/lib/supabase/error'

const BUCKET = 'ad-images'

function buildPublicUrl(path: string): string {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    if (!url) return ''
    const clean = path.replace(/^\/+|\/+$/g, '')
    return `${url}/storage/v1/object/public/${BUCKET}/${clean}`
}

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET(
    _request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        if (!id) return NextResponse.json({ error: 'id obrigatório' }, { status: 400 })

        const admin = createAdminClient()

        const { data: adRow, error: adErr } = await admin
            .from('ads')
            .select('*')
            .eq('id', id)
            .eq('status', 'published')
            .maybeSingle()

        if (adErr) {
            const ser = serializeSupabaseError(adErr)
            console.error('[API/ADS/PUBLIC/GET] ads error:', ser)
            return NextResponse.json({ error: ser.message }, { status: 500 })
        }

        if (!adRow) {
            return NextResponse.json({ error: 'Anúncio não encontrado' }, { status: 404 })
        }

        const ownerId = adRow.owner_id as string
        const { data: profile, error: profErr } = await admin
            .from('profiles')
            .select('id, status, full_name')
            .eq('id', ownerId)
            .maybeSingle()

        if (profErr || !profile || (profile as { status: string }).status !== 'approved') {
            return NextResponse.json({ error: 'Anúncio não encontrado' }, { status: 404 })
        }

        const { data: imgRows } = await admin
            .from('ad_images')
            .select('path, sort_order')
            .eq('ad_id', id)
            .order('sort_order', { ascending: true })

        const images = ((imgRows ?? []) as { path: string; sort_order: number }[])
            .sort((a, b) => a.sort_order - b.sort_order)
            .map((i) => buildPublicUrl(i.path))

        const ad = {
            id: adRow.id,
            userId: adRow.owner_id,
            userName: (profile as { full_name: string }).full_name,
            type: adRow.type,
            status: adRow.status,
            title: adRow.title,
            description: adRow.description,
            price: adRow.price_mzn != null ? Number(adRow.price_mzn) : null,
            priceOnRequest: adRow.price_note != null && String(adRow.price_note).length > 0,
            location: adRow.city,
            province: adRow.province,
            neighborhood: adRow.neighborhood ?? undefined,
            categoryId: adRow.category,
            whatsapp: adRow.whatsapp,
            images: images.length > 0 ? images : [],
            likes: 0,
            createdAt: adRow.created_at,
            updatedAt: adRow.updated_at,
        }

        return NextResponse.json({ ad })
    } catch (err: unknown) {
        const ser = serializeSupabaseError(err)
        console.error('[API/ADS/PUBLIC/GET] unexpected error:', ser)
        return NextResponse.json({ error: ser.message }, { status: 500 })
    }
}
