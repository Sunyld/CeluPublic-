/**
 * GET /api/ads/most-viewed
 * Get most viewed published ads with pagination
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

function rowToAd(
    r: Record<string, unknown>,
    images: string[],
    userName?: string
) {
    return {
        id: r.id,
        userId: r.owner_id,
        userName: userName ?? undefined,
        type: r.type,
        status: r.status,
        title: r.title,
        description: r.description,
        price: r.price_mzn != null ? Number(r.price_mzn) : null,
        priceOnRequest: r.price_note != null && String(r.price_note).length > 0,
        location: r.city,
        province: r.province,
        neighborhood: r.neighborhood ?? undefined,
        categoryId: r.category,
        whatsapp: r.whatsapp,
        images,
        likes: 0,
        views: r.views as number,
        createdAt: r.created_at,
        updatedAt: r.updated_at,
    }
}

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const limit = Math.max(1, Math.min(100, parseInt(searchParams.get('limit') ?? '20', 10)))
        const offset = Math.max(0, parseInt(searchParams.get('offset') ?? '0', 10))

        const admin = createAdminClient()

        let query = admin
            .from('ads')
            .select('*')
            .eq('status', 'published')
            .order('views', { ascending: false })
            .order('updated_at', { ascending: false })
            .range(offset, offset + limit - 1)

        const { data: adsRows, error: adsError } = await query

        if (adsError) {
            const ser = serializeSupabaseError(adsError)
            console.error('[API/ADS/MOST-VIEWED] ads error:', ser)
            return NextResponse.json({ ok: false, ...ser }, { status: 500 })
        }

        const rows = (adsRows ?? []) as Array<{
            id: string;
            owner_id: string;
            [key: string]: unknown;
        }>
        const ownerIds = [...new Set(rows.map((r) => r.owner_id))]
        const { data: profiles } = await admin
            .from('profiles')
            .select('id, full_name, status')
            .in('id', ownerIds)

        const approvedIds = new Set(
            (profiles ?? []).filter((p: { status: string }) => p.status === 'approved').map((p: { id: string }) => p.id)
        )
        const profileMap = new Map((profiles ?? []).map((p: { id: string; full_name: string }) => [p.id, p.full_name]))

        const approvedRows = rows.filter((r) => approvedIds.has(r.owner_id))
        const adIds = approvedRows.map((r) => r.id)

        const { data: imgRows } = await admin
            .from('ad_images')
            .select('ad_id, path, sort_order')
            .in('ad_id', adIds)
            .order('sort_order', { ascending: true })

        const imagesByAd = new Map<string, { path: string; sort_order: number }[]>()
        for (const r of (imgRows ?? []) as { ad_id: string; path: string; sort_order: number }[]) {
            const list = imagesByAd.get(r.ad_id) ?? []
            list.push({ path: r.path, sort_order: r.sort_order })
            imagesByAd.set(r.ad_id, list)
        }

        const ads = approvedRows.map((r) => {
            const imgs = (imagesByAd.get(r.id as string) ?? []).sort((a, b) => a.sort_order - b.sort_order)
            return rowToAd(r, imgs.map((i) => buildPublicUrl(i.path)), profileMap.get(r.owner_id as string))
        })

        return NextResponse.json({ ads, total: ads.length })
    } catch (err: unknown) {
        const ser = serializeSupabaseError(err)
        console.error('[API/ADS/MOST-VIEWED] unexpected error:', ser)
        return NextResponse.json({ ok: false, message: ser.message }, { status: 500 })
    }
}
