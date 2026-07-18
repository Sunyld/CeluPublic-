/**
 * Supabase implementation: ads + ad_images tables + Storage.
 * Requires migrations 20250114000000 (profiles) and 20250214000000 (ads, ad_images).
 */
import type { Ad, AdStatus } from '@/types';
import type { AdsRepository } from '../adsRepo';
import { getSupabase } from '@/lib/supabaseClient';
import { AppError, ERROR_CODES } from '@/lib/errors';
import { LIMITS } from '@/lib/constants';
import { normalizeStoragePath, getPublicUrl } from '@/lib/storageHelpers';
import type { SupabaseClient } from '@supabase/supabase-js';

const BUCKET = 'ad-images';

type AdsRow = {
  id: string;
  owner_id: string;
  type: string;
  status: string;
  title: string;
  description: string;
  price_mzn: number | null;
  price_note: string | null;
  province: string;
  city: string;
  neighborhood: string | null;
  category: string;
  whatsapp: string;
  created_at: string;
  updated_at: string;
};

function rowToAd(
  row: AdsRow,
  imagePaths: { path: string; sort_order: number }[],
  ownerName?: string
): Ad {
  const sorted = [...imagePaths].sort((a, b) => a.sort_order - b.sort_order);
  // Normalize paths and get URLs (handles both paths and full URLs from DB)
  // Note: We return public URLs here for immediate render, but UI should use useStorageImage hook for async resolution
  const images = sorted.map((i) => {
    const normalizedPath = normalizeStoragePath(i.path, BUCKET);
    return normalizedPath ? getPublicUrl(BUCKET, normalizedPath) : '';
  });
  return {
    id: row.id,
    userId: row.owner_id,
    userName: ownerName,
    type: row.type as 'product' | 'service',
    status: row.status as AdStatus,
    title: row.title,
    description: row.description,
    price: row.price_mzn != null ? Number(row.price_mzn) : null,
    priceOnRequest: row.price_note != null && row.price_note.length > 0,
    location: row.city,
    province: row.province,
    neighborhood: row.neighborhood ?? undefined,
    categoryId: row.category,
    whatsapp: row.whatsapp,
    images,
    likes: 0,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

async function fetchImagesForAds(supabase: SupabaseClient, adIds: string[]): Promise<Map<string, { path: string; sort_order: number }[]>> {
  if (adIds.length === 0) return new Map();
  try {
    const { data, error } = await supabase
      .from('ad_images')
      .select('ad_id, path, sort_order')
      .in('ad_id', adIds)
      .order('sort_order', { ascending: true });
    if (error) {
      // eslint-disable-next-line no-console
      console.error('[SUPABASE ERROR][adsRepo.fetchImagesForAds]', error);
      // Don't throw - return empty map to allow app to continue
      return new Map();
    }
    const map = new Map<string, { path: string; sort_order: number }[]>();
    for (const r of (data as { ad_id: string; path: string; sort_order: number }[]) ?? []) {
      const list = map.get(r.ad_id) ?? [];
      list.push({ path: r.path, sort_order: r.sort_order });
      map.set(r.ad_id, list);
    }
    return map;
  } catch (err: any) {
    // eslint-disable-next-line no-console
    console.error('[SUPABASE ERROR][adsRepo.fetchImagesForAds] unexpected error:', err);
    // Return empty map instead of throwing
    return new Map();
  }
}

export const adsRepoSupabase: AdsRepository = {
  async list(filters) {
    const supabase = getSupabase();
    if (!supabase) return [];

    let query = supabase
      .from('ads')
      .select('*')
      .order('updated_at', { ascending: false });

    if (filters?.userId) query = query.eq('owner_id', filters.userId);
    if (filters?.status !== undefined) query = query.eq('status', filters.status);

    const { data, error } = await query;
    if (error) {
      // eslint-disable-next-line no-console
      console.error('[SUPABASE ERROR][adsRepo.list]', error);
      // Check for RLS recursion error (42P17) - don't crash
      if (error.code === '42P17' || error.message?.includes('recursion') || error.message?.includes('infinite')) {
        // eslint-disable-next-line no-console
        console.error('[DB] RLS recursion detected (42P17) in adsRepo.list - ensure migration 20250216_fix_profiles_rls_NO_RECURSION_HARD.sql is applied');
        return [];
      }
      // Don't throw - return empty array to allow app to continue
      if (error.code === 'PGRST116' || error.message?.includes('policy')) return [];
      // eslint-disable-next-line no-console
      console.warn('[DB] adsRepo.list error (non-fatal):', error.message);
      return [];
    }

    const rows = (data ?? []) as AdsRow[];
    const adIds = rows.map((r) => r.id);
    const imagesMap = await fetchImagesForAds(supabase, adIds);

    return rows.map((r) => {
      const images = imagesMap.get(r.id) ?? [];
      return rowToAd(r, images, undefined);
    });
  },

  async getById(id: string) {
    const supabase = getSupabase();
    if (!supabase) return null;

    const { data: adData, error: adError } = await supabase
      .from('ads')
      .select('*')
      .eq('id', id)
      .single();

    if (adError || !adData) {
      if (adError) {
        // eslint-disable-next-line no-console
        console.error('[SUPABASE ERROR][adsRepo.getById]', adError);
      }
      return null;
    }

    const { data: imgData, error: imgError } = await supabase
      .from('ad_images')
      .select('path, sort_order')
      .eq('ad_id', id)
      .order('sort_order', { ascending: true });
    if (imgError) {
      // eslint-disable-next-line no-console
      console.error('[SUPABASE ERROR][adsRepo.getById images]', imgError);
      // Don't throw - continue with empty images array
      // eslint-disable-next-line no-console
      console.warn('[DB] adsRepo.getById images error (non-fatal):', imgError.message);
    }

    const row = adData as AdsRow;
    const images = (imgData ?? []) as { path: string; sort_order: number }[];
    try {
      return rowToAd(row, images, undefined);
    } catch (err: any) {
      // eslint-disable-next-line no-console
      console.error('[SUPABASE ERROR][adsRepo.getById rowToAd]', err);
      return null;
    }
  },

  async create(data, options) {
    const supabase = getSupabase();
    if (!supabase) throw new AppError(ERROR_CODES.UNAUTHORIZED, 'Supabase not configured');

    const bypassLimit = options?.bypassLimit === true;
    if (!bypassLimit && data.userId) {
      const { data: existing, error: existingError } = await supabase
        .from('ads')
        .select('id, type')
        .eq('owner_id', data.userId);
      if (existingError) {
        // eslint-disable-next-line no-console
        console.error('[SUPABASE ERROR][adsRepo.create existing]', existingError);
        throw existingError;
      }
      const list = (existing ?? []) as { type: string }[];
      const countProduct = list.filter((r) => r.type === 'product').length;
      const countService = list.filter((r) => r.type === 'service').length;
      if (data.type === 'product' && countProduct >= LIMITS.MAX_PRODUCTS) {
        throw new AppError(ERROR_CODES.LIMIT_REACHED, 'Limite de 10 produtos atingido.');
      }
      if (data.type === 'service' && countService >= LIMITS.MAX_SERVICES) {
        throw new AppError(ERROR_CODES.LIMIT_REACHED, 'Limite de 5 serviços atingido.');
      }
    }

    const province = data.province ?? '';
    const row = {
      owner_id: data.userId,
      type: data.type,
      status: data.status ?? 'published',
      title: data.title,
      description: data.description,
      price_mzn: data.price != null ? data.price : null,
      price_note: data.priceOnRequest ? 'Sob consulta' : null,
      province,
      city: data.location,
      neighborhood: data.neighborhood ?? null,
      category: data.categoryId,
      whatsapp: data.whatsapp,
    };

    const { data: inserted, error } = await supabase.from('ads').insert(row).select().single();
    if (error) {
      // eslint-disable-next-line no-console
      console.error('[SUPABASE ERROR][adsRepo.create]', error);
      throw new AppError(ERROR_CODES.UNAUTHORIZED, error.message);
    }

    const adRow = inserted as AdsRow;
    return rowToAd(adRow, [], data.userName);
  },

  async update(id: string, data) {
    const supabase = getSupabase();
    if (!supabase) return null;

    const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (data.title != null) updates.title = data.title;
    if (data.description != null) updates.description = data.description;
    if (data.price != null) updates.price_mzn = data.price;
    if (data.price === null) updates.price_mzn = null;
    if (data.priceOnRequest != null) updates.price_note = data.priceOnRequest ? 'Sob consulta' : null;
    if (data.province != null) updates.province = data.province;
    if (data.location != null) updates.city = data.location;
    if (data.neighborhood !== undefined) updates.neighborhood = data.neighborhood || null;
    if (data.categoryId != null) updates.category = data.categoryId;
    if (data.whatsapp != null) updates.whatsapp = data.whatsapp;
    if (data.type != null) updates.type = data.type;
    if (data.status != null) updates.status = data.status;

    const { data: updated, error } = await supabase
      .from('ads')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error || !updated) {
      if (error) {
        // eslint-disable-next-line no-console
        console.error('[SUPABASE ERROR][adsRepo.update]', error);
      }
      return null;
    }
    const existing = await this.getById(id);
    return existing;
  },

  async delete(id: string) {
    const supabase = getSupabase();
    if (!supabase) return false;

    const { error } = await supabase.from('ads').delete().eq('id', id);
    if (error) {
      // eslint-disable-next-line no-console
      console.error('[SUPABASE ERROR][adsRepo.delete]', error);
      throw error;
    }
    return true;
  },
};

/** Insert image rows for an ad (after uploading files to Storage). */
export async function insertAdImages(
  adId: string,
  paths: { path: string; sort_order: number }[]
): Promise<void> {
  const supabase = getSupabase();
  if (!supabase) return;
  if (paths.length === 0) return;
  // CRITICAL: Normalize all paths before inserting to DB (ensure no URLs)
  const rows = paths.map((p) => {
    const normalizedPath = normalizeStoragePath(p.path, BUCKET);
    if (!normalizedPath) {
      if ((process.env.NODE_ENV === "development")) {
        // eslint-disable-next-line no-console
        console.warn('[UPLOAD] Skipping invalid path in insertAdImages:', p.path);
      }
      return null;
    }
    return { ad_id: adId, path: normalizedPath, sort_order: p.sort_order };
  }).filter((r): r is { ad_id: string; path: string; sort_order: number } => r !== null);
  
  if (rows.length === 0) return;
  
  const { error } = await supabase.from('ad_images').insert(rows);
  if (error) {
    // eslint-disable-next-line no-console
    console.error('[SUPABASE ERROR][adsRepo.insertAdImages]', error);
    throw error;
  }
}

/** Delete one image row and remove from Storage. */
export async function deleteAdImage(adId: string, path: string): Promise<void> {
  const supabase = getSupabase();
  if (!supabase) return;
  const normalizedPath = normalizeStoragePath(path, BUCKET);
  if (!normalizedPath) {
    if ((process.env.NODE_ENV === "development")) {
      // eslint-disable-next-line no-console
      console.warn('[UPLOAD] Invalid path in deleteAdImage:', path);
    }
    return;
  }
  
  // Delete from DB (match by normalized path or original path for compatibility)
  const { error } = await supabase
    .from('ad_images')
    .delete()
    .eq('ad_id', adId)
    .or(`path.eq.${normalizedPath},path.eq.${path}`);
  if (error) {
    // eslint-disable-next-line no-console
    console.error('[SUPABASE ERROR][adsRepo.deleteAdImage rows]', error);
    throw error;
  }
  
  // Remove from storage (don't fail if file doesn't exist)
  const { error: storageError } = await supabase.storage.from(BUCKET).remove([normalizedPath]);
  if (storageError && (process.env.NODE_ENV === "development")) {
    // eslint-disable-next-line no-console
    console.warn('[UPLOAD] Failed to remove image from storage (non-fatal):', {
      path: normalizedPath,
      error: storageError.message,
    });
    // Don't throw - file might already be deleted
  }
}

/** Delete all image rows for an ad (and optionally remove objects from Storage). */
export async function deleteAllAdImages(adId: string): Promise<void> {
  const supabase = getSupabase();
  if (!supabase) return;
  const { data: rows, error } = await supabase.from('ad_images').select('path').eq('ad_id', adId);
  if (error) {
    // eslint-disable-next-line no-console
    console.error('[SUPABASE ERROR][adsRepo.deleteAllAdImages select]', error);
    throw error;
  }
  // Normalize all paths before removing from storage
  const paths = (rows ?? [])
    .map((r: { path: string }) => normalizeStoragePath(r.path, BUCKET))
    .filter((p): p is string => !!p);
  
  const { error: delError } = await supabase.from('ad_images').delete().eq('ad_id', adId);
  if (delError) {
    // eslint-disable-next-line no-console
    console.error('[SUPABASE ERROR][adsRepo.deleteAllAdImages delete]', delError);
    throw delError;
  }
  
  // Remove from storage (don't fail if files don't exist)
  if (paths.length > 0) {
    const { error: storageError } = await supabase.storage.from(BUCKET).remove(paths);
    if (storageError && (process.env.NODE_ENV === "development")) {
      // eslint-disable-next-line no-console
      console.warn('[UPLOAD] Failed to remove some images from storage (non-fatal):', {
        paths,
        error: storageError.message,
      });
      // Don't throw - files might already be deleted
    }
  }
}
