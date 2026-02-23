/**
 * GET e PATCH /api/vendedor/anuncios/[id]
 * Carregar e atualizar anúncio. Valida ownership.
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

async function ensureOwnerOrAdmin(supabase: Awaited<ReturnType<typeof createClient>>, userId: string, ownerId: string) {
    if (userId === ownerId) return true
    const { data } = await supabase.rpc('is_admin', { uid: userId })
    if (data === true) return true
    const { data: p } = await supabase.from('profiles').select('role').eq('id', userId).maybeSingle()
    return p?.role === 'admin'
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

export const dynamic = 'force-dynamic'

export async function GET(
    _request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        if (!id) return NextResponse.json({ error: 'id obrigatório' }, { status: 400 })

        const supabase = await createClient()
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
            return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
        }

        const admin = createAdminClient()
        const { data: adRow, error: adErr } = await admin
            .from('ads')
            .select('*')
            .eq('id', id)
            .maybeSingle()

        if (adErr || !adRow) {
            return NextResponse.json({ error: 'Anúncio não encontrado' }, { status: 404 })
        }

        const ownerId = adRow.owner_id as string
        if (!(await ensureOwnerOrAdmin(supabase, user.id, ownerId))) {
            return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })
        }

        const { data: imgRows } = await admin
            .from('ad_images')
            .select('path, sort_order')
            .eq('ad_id', id)
            .order('sort_order', { ascending: true })

        const imgs = ((imgRows ?? []) as { path: string; sort_order: number }[])
            .sort((a, b) => a.sort_order - b.sort_order)
            .map((i) => buildPublicUrl(i.path))

        const { data: profile } = await admin
            .from('profiles')
            .select('full_name')
            .eq('id', ownerId)
            .maybeSingle()

        const ad = rowToAd(adRow, imgs, (profile as { full_name: string })?.full_name)
        return NextResponse.json(ad)
    } catch (err: unknown) {
        const ser = serializeSupabaseError(err)
        console.error('[API/VENDEDOR/ANUNCIOS/GET] error:', ser)
        return NextResponse.json({ error: ser.message }, { status: 500 })
    }
}

function dataUrlToBuffer(dataUrl: string): { buffer: Buffer; ext: string } {
    const match = dataUrl.match(/^data:image\/(jpeg|jpg|png|webp|gif);base64,(.+)$/i)
    const base64 = match?.[2] ?? dataUrl.replace(/^data:[^;]+;base64,/, '')
    const mime = match?.[1]?.toLowerCase() ?? 'jpeg'
    const extMap: Record<string, string> = { jpeg: 'jpg', jpg: 'jpg', png: 'png', webp: 'webp', gif: 'gif' }
    const ext = extMap[mime] ?? 'jpg'
    return { buffer: Buffer.from(base64, 'base64'), ext }
}

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        if (!id) return NextResponse.json({ error: 'id obrigatório' }, { status: 400 })

        const supabase = await createClient()
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
            return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
        }

        const admin = createAdminClient()
        const { data: adRow, error: adErr } = await admin
            .from('ads')
            .select('owner_id')
            .eq('id', id)
            .maybeSingle()

        if (adErr || !adRow) {
            return NextResponse.json({ error: 'Anúncio não encontrado' }, { status: 404 })
        }

        const ownerId = adRow.owner_id as string
        if (!(await ensureOwnerOrAdmin(supabase, user.id, ownerId))) {
            return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })
        }

        const body = await request.json().catch(() => ({}))
        const images = Array.isArray(body?.images) ? body.images : []
        if (images.length > LIMITS.MAX_AD_IMAGES) {
            return NextResponse.json(
                { error: `Máximo ${LIMITS.MAX_AD_IMAGES} imagens permitidas.` },
                { status: 400 }
            )
        }

        const updates: Record<string, unknown> = { updated_at: new Date().toISOString() }
        if (body?.title != null) updates.title = String(body.title).trim()
        if (body?.description != null) updates.description = String(body.description).trim()
        if (body?.price != null) updates.price_mzn = Number(body.price)
        if (body?.price === null) updates.price_mzn = null
        if (body?.priceOnRequest != null) updates.price_note = body.priceOnRequest ? 'Sob consulta' : null
        if (body?.province != null) updates.province = String(body.province).trim()
        if (body?.city != null || body?.location != null) updates.city = String(body.city ?? body.location ?? '').trim()
        if (body?.neighborhood !== undefined) updates.neighborhood = body.neighborhood?.trim() || null
        if (body?.categoryId != null) updates.category = String(body.categoryId).trim()
        if (body?.whatsapp != null) updates.whatsapp = String(body.whatsapp).replace(/\D/g, '')
        if (body?.type != null) updates.type = body.type === 'service' ? 'service' : 'product'
        if (body?.status != null) updates.status = body.status

        if (Object.keys(updates).length > 1) {
            const { error: upErr } = await admin.from('ads').update(updates).eq('id', id)
            if (upErr) {
                const ser = serializeSupabaseError(upErr)
                console.error('[API/VENDEDOR/ANUNCIOS/PATCH] update error:', ser)
                return NextResponse.json({ error: ser.message }, { status: 500 })
            }
        }

        const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
        const urlPrefix = `${baseUrl}/storage/v1/object/public/${BUCKET}/`

        function urlToPath(url: string): string | null {
            if (typeof url !== 'string' || !url.startsWith('http')) return null
            const idx = url.indexOf(urlPrefix)
            if (idx === -1) return null
            return url.slice(idx + urlPrefix.length).replace(/^\/+|\/+$/g, '') || null
        }

        const pathsToKeep: string[] = []
        const dataUrls: string[] = []
        for (const img of images) {
            if (typeof img === 'string' && img.startsWith('data:')) {
                dataUrls.push(img)
            } else if (typeof img === 'string' && img.startsWith('http')) {
                const p = urlToPath(img)
                if (p) pathsToKeep.push(p)
            }
        }

        const { data: existing } = await admin.from('ad_images').select('path').eq('ad_id', id)
        const existingPaths = (existing ?? []).map((r: { path: string }) => r.path)
        const pathsToDelete = existingPaths.filter((p) => !pathsToKeep.includes(p))

        if (pathsToDelete.length > 0) {
            await admin.storage.from(BUCKET).remove(pathsToDelete)
        }

        const toUpload = dataUrls.slice(0, Math.max(0, LIMITS.MAX_AD_IMAGES - pathsToKeep.length))
        const allPaths: string[] = [...pathsToKeep]

        for (let i = 0; i < toUpload.length; i++) {
            const dataUrl = toUpload[i]
            try {
                const { buffer, ext } = dataUrlToBuffer(dataUrl)
                const filename = `${crypto.randomUUID()}.${ext}`
                const path = `${user.id}/${id}/${filename}`
                const contentType = ext === 'jpg' ? 'image/jpeg' : `image/${ext}`

                const { error: uploadErr } = await admin.storage
                    .from(BUCKET)
                    .upload(path, buffer, { contentType, upsert: true })

                if (uploadErr) continue
                allPaths.push(path)
            } catch (e) {
                console.error('[API/VENDEDOR/ANUNCIOS/PATCH] image upload error:', e)
            }
        }

        await admin.from('ad_images').delete().eq('ad_id', id)
        for (let i = 0; i < allPaths.length; i++) {
            await admin.from('ad_images').insert({ ad_id: id, path: allPaths[i], sort_order: i })
        }

        const { data: updated } = await admin.from('ads').select('*').eq('id', id).single()
        const { data: imgRows } = await admin.from('ad_images').select('path, sort_order').eq('ad_id', id).order('sort_order', { ascending: true })
        const imgs = ((imgRows ?? []) as { path: string; sort_order: number }[])
            .sort((a, b) => a.sort_order - b.sort_order)
            .map((i) => buildPublicUrl(i.path))

        const ad = rowToAd(updated ?? {}, imgs)
        return NextResponse.json(ad)
    } catch (err: unknown) {
        const ser = serializeSupabaseError(err)
        console.error('[API/VENDEDOR/ANUNCIOS/PATCH] error:', ser)
        return NextResponse.json({ ok: false, message: ser.message }, { status: 500 })
    }
}

/**
 * DELETE /api/vendedor/anuncios/[id]
 * Só owner ou admin. Remove ad_images (rows + storage) e depois ads.
 */
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params
    console.log('========================================');
    console.log('[API/SELLER/ADS/DELETE] REQUEST RECEBIDA');
    console.log('[API/SELLER/ADS/DELETE] adId=', id ?? 'undefined');
    console.log('[API/SELLER/ADS/DELETE] method=', request.method);
    console.log('[API/SELLER/ADS/DELETE] url=', request.url);
    console.log('========================================');
    try {
        if (!id) {
            console.error('[API/SELLER/ADS/DELETE] fail adId=missing code=MISSING_ID message=id obrigatório')
            return NextResponse.json({ ok: false, message: 'id obrigatório', code: 'MISSING_ID' }, { status: 400 })
        }

        const supabase = await createClient()
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
            console.error('[API/SELLER/ADS/DELETE] fail adId=', id, 'code=UNAUTHORIZED message=', authError?.message ?? 'Não autenticado')
            return NextResponse.json({ ok: false, message: 'Não autenticado', code: 'UNAUTHORIZED' }, { status: 401 })
        }

        const admin = createAdminClient()
        const { data: adRow, error: adErr } = await admin
            .from('ads')
            .select('owner_id')
            .eq('id', id)
            .maybeSingle()

        if (adErr) {
            const ser = serializeSupabaseError(adErr)
            console.error('[API/SELLER/ADS/DELETE] select ad error:', ser.message, ser.code)
            return NextResponse.json({ ok: false, message: ser.message ?? 'Erro ao verificar anúncio', code: ser.code }, { status: 500 })
        }
        if (!adRow) {
            console.error('[API/SELLER/ADS/DELETE] fail adId=', id, 'code=NOT_FOUND message=Anúncio não encontrado')
            return NextResponse.json({ ok: false, message: 'Anúncio não encontrado', code: 'NOT_FOUND' }, { status: 404 })
        }

        const ownerId = adRow.owner_id as string
        if (!(await ensureOwnerOrAdmin(supabase, user.id, ownerId))) {
            console.error('[API/SELLER/ADS/DELETE] fail adId=', id, 'code=FORBIDDEN message=Acesso negado')
            return NextResponse.json({ ok: false, message: 'Acesso negado. Só o dono do anúncio ou um administrador pode apagá-lo.', code: 'FORBIDDEN' }, { status: 403 })
        }

        // 1) Paths das imagens para apagar do storage
        const { data: imgRows } = await admin.from('ad_images').select('path').eq('ad_id', id)
        const paths = (imgRows ?? []).map((r: { path: string }) => r.path)

        // 2) Remover ficheiros do bucket (não falhar se ficheiro não existir)
        if (paths.length > 0) {
            const { error: storageErr } = await admin.storage.from(BUCKET).remove(paths)
            if (storageErr) {
                console.warn('[API/SELLER/ADS/DELETE] storage remove (non-fatal):', storageErr.message, 'paths:', paths.length)
            }
        }

        // 3) Apagar linhas ad_images (antes do ad por FK)
        const { error: delImgErr } = await admin.from('ad_images').delete().eq('ad_id', id)
        if (delImgErr) {
            const ser = serializeSupabaseError(delImgErr)
            console.error('[API/SELLER/ADS/DELETE] delete ad_images error:', ser.message)
            return NextResponse.json({ ok: false, message: ser.message ?? 'Erro ao apagar imagens', code: 'DB_ERROR' }, { status: 500 })
        }

        // 4) Apagar linha do anúncio
        const { error: delAdErr } = await admin.from('ads').delete().eq('id', id)
        if (delAdErr) {
            const ser = serializeSupabaseError(delAdErr)
            console.error('[API/SELLER/ADS/DELETE] delete ads error:', ser.message)
            return NextResponse.json({ ok: false, message: ser.message ?? 'Erro ao apagar anúncio', code: 'DB_ERROR' }, { status: 500 })
        }

        console.log('[API/SELLER/ADS/DELETE] ok adId=', id, 'images=', paths.length)
        return NextResponse.json({ ok: true })
    } catch (err: unknown) {
        const ser = serializeSupabaseError(err)
        console.error('[API/SELLER/ADS/DELETE] fail adId=', id, 'code=INTERNAL message=', ser.message, 'details=', ser.code ?? '')
        return NextResponse.json({ ok: false, message: ser.message ?? 'Erro ao eliminar anúncio', code: 'INTERNAL' }, { status: 500 })
    }
}
