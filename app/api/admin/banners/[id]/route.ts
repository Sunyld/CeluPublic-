import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'

const BANNERS_BUCKET = 'banner-images'

/**
 * Extrai o path limpo do image_path (pode ser path ou URL).
 */
function normalizePath(path: string): string {
  if (!path) return ''
  if (path.startsWith('http://') || path.startsWith('https://')) {
    const idx = path.indexOf(`/${BANNERS_BUCKET}/`)
    if (idx !== -1) {
      const after = path.substring(idx + BANNERS_BUCKET.length + 2)
      const q = after.indexOf('?')
      return q >= 0 ? after.substring(0, q) : after
    }
    return ''
  }
  return path.replace(/^\/+|\/+$/g, '')
}

/**
 * DELETE /api/admin/banners/[id]
 * Remove banner (row + storage object). Usa service role para garantir que funciona.
 */
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    if (!id) {
      return NextResponse.json({ error: 'ID é obrigatório' }, { status: 400 })
    }

    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
    }

    const { data: isAdmin } = await supabase.rpc('is_admin', { uid: user.id })
    if (!isAdmin) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .maybeSingle()
      if (profile?.role !== 'admin') {
        return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })
      }
    }

    const admin = createAdminClient()

    const { data: row, error: selectError } = await admin
      .from('banners')
      .select('image_path')
      .eq('id', id)
      .single()

    if (selectError || !row) {
      return NextResponse.json(
        { error: selectError?.message || 'Banner não encontrado' },
        { status: 404 }
      )
    }

    const path = (row as { image_path?: string }).image_path
    const cleanPath = normalizePath(path || '')

    const { error: delError } = await admin.from('banners').delete().eq('id', id)

    if (delError) {
      console.error('[API/ADMIN/BANNERS] Delete row error:', delError.message)
      return NextResponse.json(
        { error: delError.message },
        { status: 500 }
      )
    }

    if (cleanPath) {
      const { error: storageError } = await admin.storage
        .from(BANNERS_BUCKET)
        .remove([cleanPath])

      if (storageError) {
        console.warn('[API/ADMIN/BANNERS] Storage remove (non-fatal):', storageError.message)
      }
    }

    console.log('[API/ADMIN/BANNERS] Deleted banner:', id, 'path:', cleanPath || 'none')
    return NextResponse.json({ ok: true, id })
  } catch (err: unknown) {
    console.error('[API/ADMIN/BANNERS] DELETE unexpected error:', err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
