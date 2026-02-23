import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';
import crypto from 'crypto';

const BANNERS_BUCKET = 'banner-images';

function rowToBanner(row: { id: string; title: string; image_path: string; link: string | null; active: boolean; sort_order: number; created_at: string }) {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const path = (row.image_path || '').replace(/^\/+|\/+$/g, '');
  const imageUrl = path ? `${base}/storage/v1/object/public/${BANNERS_BUCKET}/${path}` : '';
  return {
    id: row.id,
    title: row.title,
    imageUrl,
    link: row.link ?? undefined,
    active: row.active,
    order: row.sort_order,
    createdAt: row.created_at,
  };
}

/**
 * GET /api/admin/banners
 * Lista todos os banners (admin). Usa service role para evitar RLS.
 */
export async function GET() {
  try {
    const supabase = await createClient();
    if (!supabase) return NextResponse.json({ error: 'Supabase não configurado' }, { status: 503 });
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }
    const { data: isAdmin } = await supabase.rpc('is_admin', { uid: user.id });
    if (!isAdmin) {
      const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).maybeSingle();
      if (profile?.role !== 'admin') {
        return NextResponse.json({ error: 'Acesso negado' }, { status: 403 });
      }
    }
    const admin = createAdminClient();
    const { data, error } = await admin.from('banners').select('*').order('sort_order', { ascending: true });
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    const banners = (data ?? []).map(rowToBanner);
    return NextResponse.json({ banners });
  } catch (err: unknown) {
    console.error('[API/ADMIN/BANNERS] GET error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
    try {
        // 1. Verify user is Admin
        const supabase = await createClient();
        if (!supabase) return NextResponse.json({ error: 'Supabase não configurado' }, { status: 503 });
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
        }

        // Check is_admin via RPC
        const { data: isAdmin, error: rpcError } = await supabase.rpc('is_admin', { uid: user.id });

        if (rpcError || !isAdmin) {
            // Fallback to profile check if RPC fails or returns false
            const { data: profile } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', user.id)
                .single();

            if (profile?.role !== 'admin') {
                return NextResponse.json({ error: 'Acesso negado: Apenas administradores' }, { status: 403 });
            }
        }

        // 2. Parse FormData
        const formData = await request.formData();
        const title = formData.get('title') as string;
        const link = (formData.get('link') as string) || '';
        const active = formData.get('active') === 'true';
        const order = parseInt(formData.get('order') as string) || 0;
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'A imagem é obrigatória' }, { status: 400 });
        }

        const supabaseAdmin = createAdminClient();

        // 3. Check bucket and Upload
        const { data: buckets } = await supabaseAdmin.storage.listBuckets();
        const bucketExists = buckets?.some(b => b.id === 'banner-images');

        if (!bucketExists) {
            return NextResponse.json({
                error: 'Ficheiro de armazenamento (bucket) não encontrado',
                details: 'O bucket "banner-images" não existe. Crie-o no dashboard do Supabase.'
            }, { status: 500 });
        }

        const fileExt = file.name.split('.').pop() || 'jpg';
        const fileName = `${crypto.randomUUID()}.${fileExt}`;
        const filePath = `banners/${fileName}`;

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const { error: uploadError } = await supabaseAdmin
            .storage
            .from('banner-images')
            .upload(filePath, buffer, {
                contentType: file.type,
                upsert: true
            });

        if (uploadError) {
            console.error('[API/BANNERS] Upload error:', uploadError);
            return NextResponse.json({
                error: 'Erro no upload da imagem',
                details: uploadError.message
            }, { status: 500 });
        }

        // 4. Insert into DB (Service Role) — tabela banners tem image_path, não image_url
        const { data: banner, error: dbError } = await supabaseAdmin
            .from('banners')
            .insert({
                title: (title && typeof title === 'string') ? title.trim() : '',
                link: link || null,
                image_path: filePath,
                active,
                sort_order: order
            })
            .select()
            .single();

        if (dbError) {
            console.error('[API/BANNERS] DB Insert error:', dbError);
            return NextResponse.json({
                error: 'Erro ao salvar no banco',
                details: dbError.message
            }, { status: 500 });
        }

        return NextResponse.json(banner);

    } catch (err: any) {
        console.error('[API/BANNERS] Unexpected error:', err);
        return NextResponse.json({
            error: 'Erro interno no servidor',
            details: err.message,
            stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
        }, { status: 500 });
    }
}

export async function PATCH(request: Request) {
    try {
        const supabase = await createClient();
        if (!supabase) return NextResponse.json({ error: 'Supabase não configurado' }, { status: 503 });
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
        }

        // Admin check
        const { data: isAdmin } = await supabase.rpc('is_admin', { uid: user.id });
        if (!isAdmin) {
            const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).maybeSingle();
            if (!profile || profile.role !== 'admin') {
                return NextResponse.json({ error: 'Acesso negado' }, { status: 403 });
            }
        }

        const formData = await request.formData();
        const id = formData.get('id') as string;
        const active = formData.get('active') === 'true';
        // support optional fields
        const title = formData.get('title') as string | null;
        const link = formData.get('link') as string | null;
        const order = formData.get('order') ? parseInt(formData.get('order') as string) : undefined;

        if (!id) return NextResponse.json({ error: 'ID é obrigatório' }, { status: 400 });

        const supabaseAdmin = createAdminClient();
        const updates: any = { active };
        if (title !== null) updates.title = title;
        if (link !== null) updates.link = link;
        if (order !== undefined) updates.sort_order = order;
        updates.updated_at = new Date().toISOString();

        const { data: banner, error: dbError } = await supabaseAdmin
            .from('banners')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (dbError) {
            return NextResponse.json({ error: dbError.message }, { status: 500 });
        }

        return NextResponse.json(banner);
    } catch (err: any) {
        return NextResponse.json({ error: 'Erro' }, { status: 500 });
    }
}
