import type { Banner } from '@/types';
import type { BannersRepository } from '../bannersRepo';
import { getSupabase } from '@/lib/supabaseClient';
import { AppError, ERROR_CODES, withTimeout } from '@/lib/errors';
import { dataUrlToBlob } from '@/lib/imageCompression';
import { normalizeStoragePath, getPublicUrl } from '@/lib/storageHelpers';

// ── Helpers de MIME ──────────────────────────────────────────────────────────

/** Extrai o mime type de um data URL. Ex: 'data:image/png;base64,...' → 'image/png'. */
function detectDataUrlMime(dataUrl: string): string {
  const match = dataUrl.match(/^data:([a-z]+\/[a-z+.-]+);/i);
  return match?.[1]?.toLowerCase() ?? 'image/jpeg';
}

/** Mapeia mime type para extensão de ficheiro. */
function mimeToExt(mime: string): string {
  const map: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
    'image/gif': 'gif',
    'image/svg+xml': 'svg',
  };
  return map[mime] ?? 'jpg';
}

// Nome único do bucket de banners. Se mudar, alterar aqui e no Supabase.
export const BANNERS_BUCKET = 'banner-images';

type BannerRow = {
  id: string;
  title: string;
  image_path: string;
  link: string | null;
  active: boolean;
  sort_order: number;
  created_at: string;
};

function rowToBanner(row: BannerRow): Banner {
  // Normalize path and get URL (handles both paths and full URLs from DB)
  const normalizedPath = normalizeStoragePath(row.image_path, BANNERS_BUCKET);
  const imageUrl = normalizedPath ? getPublicUrl(BANNERS_BUCKET, normalizedPath) : '';

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

export const bannersRepoSupabase: BannersRepository = {
  async listPublic() {
    const supabase = getSupabase();
    if (!supabase) return [];

    const { data, error } = await supabase
      .from('banners')
      .select('*')
      .eq('active', true)
      .order('sort_order', { ascending: true });

    if (error) {
      // eslint-disable-next-line no-console
      console.error('[SUPABASE ERROR][bannersRepo.listPublic]', error);
      return [];
    }
    return (data ?? []).map((r) => rowToBanner(r as BannerRow));
  },

  async listAll() {
    const supabase = getSupabase();
    if (!supabase) return [];

    const { data, error } = await supabase
      .from('banners')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error) {
      // eslint-disable-next-line no-console
      console.error('[SUPABASE ERROR][bannersRepo.listAll]', error);
      return [];
    }
    return (data ?? []).map((r) => rowToBanner(r as BannerRow));
  },

  async getById(id: string) {
    const supabase = getSupabase();
    if (!supabase) return null;

    const { data, error } = await supabase.from('banners').select('*').eq('id', id).single();
    if (error || !data) {
      if (error) {
        // eslint-disable-next-line no-console
        console.error('[SUPABASE ERROR][bannersRepo.getById]', error);
      }
      return null;
    }
    return rowToBanner(data as BannerRow);
  },

  async create(data: Omit<Banner, 'id' | 'createdAt'>) {
    const supabase = getSupabase();
    if (!supabase) throw new AppError(ERROR_CODES.UNAUTHORIZED, 'Supabase not configured');

    const id = crypto.randomUUID();
    let imagePath: string;

    if (data.imageUrl.startsWith('data:')) {
      const blob = dataUrlToBlob(data.imageUrl);
      // Detectar contentType real do dataUrl para não forçar sempre jpeg
      const contentType = detectDataUrlMime(data.imageUrl);
      const ext = mimeToExt(contentType);
      imagePath = `banners/${id}/${crypto.randomUUID()}.${ext}`;

      // Verificar se o bucket existe antes de tentar upload.
      const { error: listError } = await withTimeout(
        supabase.storage.from(BANNERS_BUCKET).list('', { limit: 1 }),
        12_000,
        'Verificação do bucket de banners'
      );
      if (listError) {
        const status = (listError as any).status as number | undefined;
        const message = (listError as any).message as string | undefined;
        const isMissing =
          status === 404 ||
          (message &&
            (message.toLowerCase().includes('bucket') &&
              message.toLowerCase().includes('not found')));

        if (isMissing) {
          throw new AppError(
            ERROR_CODES.STORAGE_BUCKET_MISSING,
            `Bucket '${BANNERS_BUCKET}' não existe no Supabase. Crie o bucket no dashboard ou ajuste o nome na configuração.`,
            listError
          );
        }
      }

      const { error: uploadError } = await withTimeout(
        supabase.storage
          .from(BANNERS_BUCKET)
          .upload(imagePath, blob, { contentType, upsert: false }),
        12_000,
        'Upload do banner'
      );
      if (uploadError) {
        if (process.env.NODE_ENV === 'development') {
          // eslint-disable-next-line no-console
          console.error('[UPLOAD] Error uploading banner:', {
            bucket: BANNERS_BUCKET,
            path: imagePath,
            size: blob.size,
            contentType: 'image/jpeg',
            error: uploadError.message,
            statusCode: (uploadError as any)?.statusCode ?? (uploadError as any)?.status,
            fullError: uploadError,
          });
        }
        throw new AppError(
          ERROR_CODES.UNAUTHORIZED,
          `Erro ao fazer upload do banner: ${uploadError.message}`,
          uploadError
        );
      }
      if (process.env.NODE_ENV === 'development') {
        // eslint-disable-next-line no-console
        console.log('[UPLOAD] Banner uploaded successfully:', {
          bucket: BANNERS_BUCKET,
          path: imagePath,
          size: blob.size,
          ok: true,
        });
      }
    } else {
      // If it's not a data URL, it might be a full URL or existing path
      // Normalize it to ensure we store only the path
      imagePath = normalizeStoragePath(data.imageUrl, BANNERS_BUCKET);
      if (!imagePath) {
        throw new AppError(
          ERROR_CODES.UNAUTHORIZED,
          'URL ou path de imagem inválido para banner.'
        );
      }
    }

    const row = {
      id,
      title: data.title ?? '',
      image_path: imagePath,
      link: data.link ?? null,
      active: data.active ?? true,
      sort_order: data.order ?? 0,
    };

    const { data: inserted, error } = await supabase.from('banners').insert(row).select().single();
    if (error) {
      // eslint-disable-next-line no-console
      console.error('[SUPABASE ERROR][bannersRepo.create]', error);
      throw new AppError(ERROR_CODES.UNAUTHORIZED, error.message);
    }

    return rowToBanner(inserted as BannerRow);
  },

  async update(id: string, data: Partial<Omit<Banner, 'id'>>) {
    const supabase = getSupabase();
    if (!supabase) return null;

    const existing = await this.getById(id);
    if (!existing) return null;

    const updates: Record<string, unknown> = {};
    if (data.title != null) updates.title = data.title;
    if (data.link !== undefined) updates.link = data.link ?? null;
    if (data.active != null) updates.active = data.active;
    if (data.order != null) updates.sort_order = data.order;

    if (data.imageUrl != null) {
      if (data.imageUrl.startsWith('data:')) {
        // New image upload
        const { data: row, error: selectError } = await supabase.from('banners').select('image_path').eq('id', id).single();
        if (selectError) {
          // eslint-disable-next-line no-console
          console.error('[SUPABASE ERROR][bannersRepo.update select image_path]', selectError);
          throw selectError;
        }
        const oldPath = (row as { image_path: string } | null)?.image_path;
        const blob = dataUrlToBlob(data.imageUrl);
        // Detectar contentType real do dataUrl
        const contentType = detectDataUrlMime(data.imageUrl);
        const ext = mimeToExt(contentType);
        const newPath = `banners/${id}/${crypto.randomUUID()}.${ext}`;

        const { error: uploadError } = await withTimeout(
          supabase.storage
            .from(BANNERS_BUCKET)
            .upload(newPath, blob, { contentType, upsert: false }),
          12_000,
          'Upload do banner'
        );
        if (uploadError) {
          if (process.env.NODE_ENV === 'development') {
            // eslint-disable-next-line no-console
            console.error('[UPLOAD] Error uploading banner:', {
              bucket: BANNERS_BUCKET,
              path: newPath,
              size: blob.size,
              contentType: 'image/jpeg',
              error: uploadError.message,
              statusCode: (uploadError as any)?.statusCode ?? (uploadError as any)?.status,
              fullError: uploadError,
            });
          }
          throw uploadError;
        }
        if (process.env.NODE_ENV === 'development') {
          // eslint-disable-next-line no-console
          console.log('[UPLOAD] Banner uploaded successfully:', {
            bucket: BANNERS_BUCKET,
            path: newPath,
            size: blob.size,
            ok: true,
          });
        }
        updates.image_path = newPath;

        // Remove old file (don't fail if it doesn't exist)
        if (oldPath) {
          const normalizedOldPath = normalizeStoragePath(oldPath, BANNERS_BUCKET);
          if (normalizedOldPath) {
            const { error: removeError } = await supabase.storage.from(BANNERS_BUCKET).remove([normalizedOldPath]);
            if (removeError && process.env.NODE_ENV === 'development') {
              // eslint-disable-next-line no-console
              console.warn('[UPLOAD] Failed to remove old banner file (non-fatal):', {
                path: normalizedOldPath,
                error: removeError.message,
              });
            }
          }
        }
      } else {
        // URL or path provided - normalize to path only
        const normalizedPath = normalizeStoragePath(data.imageUrl, BANNERS_BUCKET);
        if (normalizedPath) {
          updates.image_path = normalizedPath;
        }
      }
    }

    const { data: updated, error } = await supabase.from('banners').update(updates).eq('id', id).select().single();
    if (error || !updated) {
      if (error) {
        // eslint-disable-next-line no-console
        console.error('[SUPABASE ERROR][bannersRepo.update]', error);
      }
      return null;
    }
    return rowToBanner(updated as BannerRow);
  },

  async delete(id: string) {
    const supabase = getSupabase();
    if (!supabase) return false;

    const { data: row, error: selectError } = await supabase.from('banners').select('image_path').eq('id', id).single();
    if (selectError) {
      // eslint-disable-next-line no-console
      console.error('[SUPABASE ERROR][bannersRepo.delete select image_path]', selectError);
      throw selectError;
    }
    const path = (row as { image_path: string } | null)?.image_path;
    const { error: delError } = await supabase.from('banners').delete().eq('id', id);
    if (delError) {
      // eslint-disable-next-line no-console
      console.error('[SUPABASE ERROR][bannersRepo.delete delete]', delError);
      throw delError;
    }
    if (path) {
      const normalizedPath = normalizeStoragePath(path, BANNERS_BUCKET);
      if (normalizedPath) {
        const { error: removeError } = await supabase.storage.from(BANNERS_BUCKET).remove([normalizedPath]);
        if (removeError && process.env.NODE_ENV === 'development') {
          // eslint-disable-next-line no-console
          console.warn('[SUPABASE ERROR][bannersRepo.delete remove] (non-fatal):', {
            path: normalizedPath,
            error: removeError.message,
          });
          // Don't throw - file might already be deleted
        }
      }
    }
    return true;
  },
};
