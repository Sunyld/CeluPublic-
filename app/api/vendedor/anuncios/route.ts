/**
 * GET e POST /api/vendedor/anuncios
 * GET: lista anúncios do owner autenticado (todos os status).
 * POST: publicar anúncio (ads + ad_images + storage upload).
 */
import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'
import { serializeSupabaseError } from '@/lib/supabase/error'
import { LIMITS } from '@/lib/constants'

const BUCKET = 'ad-images'

function buildPublicUrl(path: string): string {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    if (!url) return ''
    const clean = path.replace(/^\/+|\/+$/g, '')
    return `${url}/storage/v1/object/public/${BUCKET}/${clean}`
}

function rowToAd(r: Record<string, unknown>, images: string[], userName?: string) {
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

function dataUrlToBuffer(dataUrl: string): { buffer: Buffer; ext: string } {
    const match = dataUrl.match(/^data:image\/(jpeg|jpg|png|webp|gif);base64,(.+)$/i)
    const base64 = match?.[2] ?? dataUrl.replace(/^data:[^;]+;base64,/, '')
    const mime = match?.[1]?.toLowerCase() ?? 'jpeg'
    const extMap: Record<string, string> = {
        jpeg: 'jpg', jpg: 'jpg', png: 'png', webp: 'webp', gif: 'gif',
    }
    const ext = extMap[mime] ?? 'jpg'
    return { buffer: Buffer.from(base64, 'base64'), ext }
}

async function ensureApprovedSeller(supabase: Awaited<ReturnType<typeof createClient>>, userId: string) {
    const { data: rpc } = await supabase.rpc('is_admin', { uid: userId })
    if (rpc === true) return { ok: true, isAdmin: true }

    const { data: profile, error } = await supabase
        .from('profiles')
        .select('status, role')
        .eq('id', userId)
        .maybeSingle()

    if (error || !profile) {
        return { ok: false, message: 'Perfil não encontrado' }
    }
    if (profile.status !== 'approved') {
        return { ok: false, message: 'Conta não aprovada. Aguarde a ativação.' }
    }
    if (profile.role !== 'seller' && profile.role !== 'admin') {
        return { ok: false, message: 'Acesso reservado a vendedores.' }
    }
    return { ok: true, isAdmin: false }
}

export const dynamic = 'force-dynamic'

export async function GET() {
    try {
        const supabase = await createClient()
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
            return NextResponse.json({ ok: false, message: 'Não autenticado' }, { status: 401 })
        }

        const admin = createAdminClient()
        const { data: rows, error } = await admin
            .from('ads')
            .select('*')
            .eq('owner_id', user.id)
            .order('updated_at', { ascending: false })

        if (error) {
            const ser = serializeSupabaseError(error)
            console.error('[API/VENDEDOR/ANUNCIOS] GET error:', ser)
            return NextResponse.json({ ok: false, message: ser.message }, { status: 500 })
        }

        const adIds = (rows ?? []).map((r: { id: string }) => r.id)
        const { data: imgRows } = adIds.length > 0
            ? await admin.from('ad_images').select('ad_id, path, sort_order').in('ad_id', adIds).order('sort_order', { ascending: true })
            : { data: [] }

        const imagesByAd = new Map<string, { path: string; sort_order: number }[]>()
        for (const r of (imgRows ?? []) as { ad_id: string; path: string; sort_order: number }[]) {
            const list = imagesByAd.get(r.ad_id) ?? []
            list.push({ path: r.path, sort_order: r.sort_order })
            imagesByAd.set(r.ad_id, list)
        }

        const ads = (rows ?? []).map((r: Record<string, unknown>) => {
            const list = (imagesByAd.get(r.id as string) ?? []).sort((a, b) => a.sort_order - b.sort_order)
            const imgs = list.map((i) => buildPublicUrl(i.path))
            return rowToAd(r, imgs)
        })

        return NextResponse.json({ ads })
    } catch (err: unknown) {
        const ser = serializeSupabaseError(err)
        console.error('[API/VENDEDOR/ANUNCIOS] GET unexpected error:', ser)
        return NextResponse.json({ ok: false, message: ser.message }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const supabase = await createClient()
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
            return NextResponse.json({ ok: false, message: 'Não autenticado' }, { status: 401 })
        }

        const check = await ensureApprovedSeller(supabase, user.id)
        if (!check.ok) {
            return NextResponse.json({ ok: false, message: check.message }, { status: 403 })
        }

        const body = await request.json().catch(() => ({}))
        const title = String(body?.title ?? '').trim()
        const description = String(body?.description ?? '').trim()
        const province = String(body?.province ?? '').trim()
        const city = String(body?.city ?? body?.location ?? '').trim()
        const neighborhood = (body?.neighborhood ?? '').trim() || null
        const categoryId = String(body?.categoryId ?? body?.category ?? '').trim()
        const whatsapp = String(body?.whatsapp ?? '').replace(/\D/g, '')
        const type = body?.type === 'service' ? 'service' : 'product'
        const priceOnRequest = Boolean(body?.priceOnRequest)
        const price = priceOnRequest || body?.price == null || body?.price === '' ? null : Number(body.price)
        const images = Array.isArray(body?.images) ? body.images : []
        if (images.length > LIMITS.MAX_AD_IMAGES) {
            return NextResponse.json(
                { ok: false, message: `Máximo ${LIMITS.MAX_AD_IMAGES} imagens permitidas.` },
                { status: 400 }
            )
        }

        if (!title || !city || !province || !categoryId || !whatsapp) {
            return NextResponse.json(
                { ok: false, message: 'Título, província, cidade, categoria e WhatsApp são obrigatórios' },
                { status: 400 }
            )
        }

        const admin = createAdminClient()

        const { data: existing } = await admin
            .from('ads')
            .select('id, type')
            .eq('owner_id', user.id)

        const list = (existing ?? []) as { type: string }[]
        const countProduct = list.filter((r) => r.type === 'product').length
        const countService = list.filter((r) => r.type === 'service').length
        if (type === 'product' && countProduct >= LIMITS.MAX_PRODUCTS) {
            return NextResponse.json(
                { ok: false, message: `Limite de ${LIMITS.MAX_PRODUCTS} produtos atingido.` },
                { status: 400 }
            )
        }
        if (type === 'service' && countService >= LIMITS.MAX_SERVICES) {
            return NextResponse.json(
                { ok: false, message: `Limite de ${LIMITS.MAX_SERVICES} serviços atingido.` },
                { status: 400 }
            )
        }

        const adRow = {
            owner_id: user.id,
            type,
            status: 'published',
            title,
            description,
            price_mzn: price,
            price_note: priceOnRequest ? 'Sob consulta' : null,
            province,
            city,
            neighborhood,
            category: categoryId,
            whatsapp,
        }

        const { data: inserted, error: insertError } = await admin
            .from('ads')
            .insert(adRow)
            .select('id')
            .single()

        if (insertError) {
            const ser = serializeSupabaseError(insertError)
            console.error('[API/VENDEDOR/ANUNCIOS] insert ads error:', ser)
            return NextResponse.json(
                { ok: false, ...ser },
                { status: 500 }
            )
        }

        const adId = (inserted as { id: string }).id
        console.log('[ADS/CREATE] adId:', adId, 'ownerId:', user.id.slice(0, 8), 'imagesCount:', images.length)

        const dataUrls = images.filter((x: unknown) => typeof x === 'string' && (x as string).startsWith('data:'))
        const toUpload = dataUrls.slice(0, LIMITS.MAX_AD_IMAGES)
        const uploadedPaths: string[] = []
        let insertedCount = 0

        for (let i = 0; i < toUpload.length; i++) {
            const dataUrl = toUpload[i] as string
            try {
                const { buffer, ext } = dataUrlToBuffer(dataUrl)
                const filename = `${crypto.randomUUID()}.${ext}`
                const path = `${user.id}/${adId}/${filename}`
                const contentType = ext === 'jpg' ? 'image/jpeg' : `image/${ext}`

                const { error: uploadError } = await admin.storage
                    .from(BUCKET)
                    .upload(path, buffer, { contentType, upsert: true })

                console.log('[ADS/UPLOAD] bucket:', BUCKET, 'path:', path, 'bytes:', buffer.length, 'contentType:', contentType, 'status:', uploadError ? 'error' : 'ok')
                if (uploadError) {
                    console.error('[API/VENDEDOR/ANUNCIOS] storage upload error:', serializeSupabaseError(uploadError))
                    continue
                }
                uploadedPaths.push(path)

                const { error: imgError } = await admin
                    .from('ad_images')
                    .insert({ ad_id: adId, path, sort_order: i })

                if (imgError) {
                    console.error('[API/VENDEDOR/ANUNCIOS] ad_images insert error:', serializeSupabaseError(imgError))
                } else {
                    insertedCount++
                }
            } catch (e) {
                console.error('[API/VENDEDOR/ANUNCIOS] image process error:', e)
            }
        }

        console.log('[ADS/DB] inserted ad_images count:', insertedCount)
        if (toUpload.length > 0 && insertedCount === 0) {
            if (uploadedPaths.length > 0) {
                await admin.storage.from(BUCKET).remove(uploadedPaths)
                console.warn('[ADS/CREATE] cleanup: removed', uploadedPaths.length, 'uploaded files')
            }
            await admin.from('ads').delete().eq('id', adId)
            console.warn('[ADS/CREATE] rollback: deleted ad', adId, '(no ad_images inserted)')
            return NextResponse.json(
                { ok: false, message: 'Falha ao guardar imagens. Tente novamente.' },
                { status: 500 }
            )
        }
        return NextResponse.json({ ok: true, adId })
    } catch (err: unknown) {
        const ser = serializeSupabaseError(err)
        console.error('[API/VENDEDOR/ANUNCIOS] unexpected error:', ser)
        return NextResponse.json(
            { ok: false, message: ser.message ?? 'Erro interno' },
            { status: 500 }
        )
    }
}
