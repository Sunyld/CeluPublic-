/**
 * GET /api/ads/public
 * Lista anúncios: publicados (published + owner approved) + se autenticado, os próprios (qualquer status).
 * Usa service role. Funciona para anônimo e autenticado.
 */
import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'
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
        createdAt: r.created_at,
        updatedAt: r.updated_at,
    }
}

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const category = searchParams.get('category') ?? ''
        const q = searchParams.get('q') ?? ''
        const city = searchParams.get('city') ?? ''
        const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10))
        const limit = 100
        const offset = (page - 1) * limit

        const admin = createAdminClient()
        const supabase = await createClient()
        if (!supabase) return NextResponse.json({ error: 'Supabase não configurado' }, { status: 503 })
        const { data: { user } } = await supabase.auth.getUser()

        let query = admin
            .from('ads')
            .select(`
                id, owner_id, type, status, title, description, price_mzn, price_note,
                province, city, neighborhood, category, whatsapp, created_at, updated_at
            `)
            .order('updated_at', { ascending: false })
            .range(offset, offset + limit - 1)

        if (category) query = query.eq('category', category)
        if (city) query = query.eq('city', city)
        if (q && q.trim()) {
            const term = `%${q.trim()}%`
            query = query.or(`title.ilike.${term},description.ilike.${term}`)
        }

        const { data: adsRows, error: adsError } = await query

        if (adsError) {
            const ser = serializeSupabaseError(adsError)
            console.error('[API/ADS/PUBLIC] ads error:', ser)
            return NextResponse.json({ ok: false, ...ser }, { status: 500 })
        }

        let rows = (adsRows ?? []) as Array<{
            id: string
            owner_id: string
            type: string
            status: string
            title: string
            description: string
            price_mzn: number | null
            price_note: string | null
            province: string
            city: string
            neighborhood: string | null
            category: string
            whatsapp: string
            created_at: string
            updated_at: string
        }>

        let ownAds: typeof rows = []
        if (user) {
            const { data: own } = await admin
                .from('ads')
                .select(`
                    id, owner_id, type, status, title, description, price_mzn, price_note,
                    province, city, neighborhood, category, whatsapp, created_at, updated_at
                `)
                .eq('owner_id', user.id)
            ownAds = (own ?? []) as typeof rows
        }

        const ownerIds = [...new Set([...rows.map((r) => r.owner_id), ...ownAds.map((r) => r.owner_id)])]
        const { data: profiles } = await admin
            .from('profiles')
            .select('id, full_name, status')
            .in('id', ownerIds)

        const approvedIds = new Set(
            (profiles ?? []).filter((p: { status: string }) => p.status === 'approved').map((p: { id: string }) => p.id)
        )
        const profileMap = new Map((profiles ?? []).map((p: { id: string; full_name: string }) => [p.id, p.full_name]))

        const publicRows = rows.filter((r) => r.status === 'published' && approvedIds.has(r.owner_id))
        const ownIds = new Set(ownAds.map((r) => r.id))
        const merged = [...ownAds, ...publicRows.filter((r) => !ownIds.has(r.id))]
        const adIds = merged.map((r) => r.id)
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

        const ads = merged.map((r) => {
            const imgs = (imagesByAd.get(r.id) ?? []).sort((a, b) => a.sort_order - b.sort_order)
            return rowToAd(r, imgs.map((i) => buildPublicUrl(i.path)), profileMap.get(r.owner_id))
        })

        console.log('[API/ADS/PUBLIC] returning', ads.length, 'ads')
        return NextResponse.json({ ads, total: ads.length })
    } catch (err: unknown) {
        const ser = serializeSupabaseError(err)
        console.error('[API/ADS/PUBLIC] unexpected error:', ser)
        return NextResponse.json({ ok: false, message: ser.message }, { status: 500 })
    }
}
