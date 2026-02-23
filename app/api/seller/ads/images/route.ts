import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';
import { serializeSupabaseError } from '@/lib/supabase/error';

const BUCKET = 'ad-images';

export async function POST(request: Request) {
    try {
        // 1. Authenticate user
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
        }

        const formData = await request.formData();
        const file = formData.get('file') as File;
        const adId = formData.get('adId') as string;
        const order = parseInt(formData.get('order') as string || '0');

        if (!file || !adId) {
            return NextResponse.json({ error: 'Ficheiro e adId são obrigatórios' }, { status: 400 });
        }

        // 2. Security Check: Ensure user owns the ad
        // We use admin client to check ownership safely
        const supabaseAdmin = createAdminClient();
        const { data: ad, error: adError } = await supabaseAdmin
            .from('ads')
            .select('owner_id')
            .eq('id', adId)
            .single();

        if (adError || !ad) {
            return NextResponse.json({ error: 'Anúncio não encontrado' }, { status: 404 });
        }

        if (ad.owner_id !== user.id) {
            // Check if admin
            const { data: profile } = await supabaseAdmin.from('profiles').select('role').eq('id', user.id).maybeSingle();
            if (!profile || profile.role !== 'admin') {
                return NextResponse.json({ error: 'Acesso negado: não é dono do anúncio' }, { status: 403 });
            }
        }

        // 3. Upload to Storage
        const fileExt = file.name.split('.').pop() || 'jpg';
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
        const filePath = `${user.id}/${adId}/${fileName}`;

        const buffer = Buffer.from(await file.arrayBuffer());

        const { error: uploadError } = await supabaseAdmin.storage
            .from(BUCKET)
            .upload(filePath, buffer, {
                contentType: file.type,
                upsert: true
            });

        if (uploadError) {
            const ser = serializeSupabaseError(uploadError);
            console.error('[API/ADS/IMAGES] Upload error:', ser);
            return NextResponse.json({ error: ser.message }, { status: 500 });
        }

        // 4. Insert into database
        const { error: dbError } = await supabaseAdmin
            .from('ad_images')
            .insert({
                ad_id: adId,
                path: filePath,
                sort_order: order
            });

        if (dbError) {
            await supabaseAdmin.storage.from(BUCKET).remove([filePath]);
            const ser = serializeSupabaseError(dbError);
            console.error('[API/ADS/IMAGES] DB insert error:', ser);
            return NextResponse.json({ error: ser.message }, { status: 500 });
        }

        return NextResponse.json({ path: filePath, success: true });

    } catch (err: unknown) {
        const ser = serializeSupabaseError(err);
        console.error('[API/ADS/IMAGES] Unexpected error:', ser);
        return NextResponse.json({ error: ser.message ?? 'Erro interno' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const path = searchParams.get('path');
        const adId = searchParams.get('adId');

        if (!path || !adId) {
            return NextResponse.json({ error: 'Path e adId são obrigatórios' }, { status: 400 });
        }

        const supabaseAdmin = createAdminClient();

        // Ownership check
        const { data: ad } = await supabaseAdmin.from('ads').select('owner_id').eq('id', adId).single();
        if (ad?.owner_id !== user.id) {
            const { data: profile } = await supabaseAdmin.from('profiles').select('role').eq('id', user.id).maybeSingle();
            if (!profile || profile.role !== 'admin') {
                return NextResponse.json({ error: 'Acesso negado' }, { status: 403 });
            }
        }

        // 1. Delete from DB
        const { error: dbError } = await supabaseAdmin
            .from('ad_images')
            .delete()
            .eq('ad_id', adId)
            .eq('path', path);

        if (dbError) {
            const ser = serializeSupabaseError(dbError);
            return NextResponse.json({ error: ser.message }, { status: 500 });
        }

        // 2. Delete from Storage
        const { error: storageError } = await supabaseAdmin.storage.from(BUCKET).remove([path]);

        return NextResponse.json({ success: true });

    } catch (err: unknown) {
        const ser = serializeSupabaseError(err);
        return NextResponse.json({ error: ser.message ?? 'Erro interno' }, { status: 500 });
    }
}
