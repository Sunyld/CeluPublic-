import type { Category } from '@/types';
import type { CategoriesRepository } from '../categoriesRepo';
import { getSupabase } from '@/lib/supabaseClient';
import { AppError, ERROR_CODES } from '@/lib/errors';

type CategoryRow = {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  created_at: string;
};

function rowToCategory(row: CategoryRow): Category {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    icon: row.icon ?? undefined,
  };
}

export const categoriesRepoSupabase: CategoriesRepository = {
  async list() {
    const supabase = getSupabase();
    if (!supabase) return [];

    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      // eslint-disable-next-line no-console
      console.error('[SUPABASE ERROR][categoriesRepo.list]', error);
      // Check for RLS recursion error (42P17) - don't crash
      if (error.code === '42P17' || error.message?.includes('recursion') || error.message?.includes('infinite')) {
        // eslint-disable-next-line no-console
        console.error('[DB] RLS recursion detected (42P17) in categoriesRepo.list - ensure migration 20250216_fix_profiles_rls_NO_RECURSION_HARD.sql is applied');
        return [];
      }
      // Don't throw - return empty array to allow app to continue
      if (error.code === 'PGRST116') return [];
      // eslint-disable-next-line no-console
      console.warn('[DB] categoriesRepo.list error (non-fatal):', error.message);
      return [];
    }
    return (data ?? []).map((r) => rowToCategory(r as CategoryRow));
  },

  async create(data) {
    const supabase = getSupabase();
    if (!supabase) throw new AppError(ERROR_CODES.UNAUTHORIZED, 'Supabase not configured');

    const row = {
      name: data.name,
      slug: data.slug,
      icon: data.icon ?? null,
    };

    const { data: inserted, error } = await supabase.from('categories').insert(row).select().single();
    if (error) {
      // eslint-disable-next-line no-console
      console.error('[SUPABASE ERROR][categoriesRepo.create]', error);
      throw new AppError(ERROR_CODES.UNAUTHORIZED, error.message);
    }
    return rowToCategory(inserted as CategoryRow);
  },

  async update(id: string, data) {
    const supabase = getSupabase();
    if (!supabase) return null;

    const updates: Record<string, unknown> = {};
    if (data.name != null) updates.name = data.name;
    if (data.slug != null) updates.slug = data.slug;
    if (data.icon !== undefined) updates.icon = data.icon ?? null;

    const { data: updated, error } = await supabase
      .from('categories')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error || !updated) {
      if (error) {
        // eslint-disable-next-line no-console
        console.error('[SUPABASE ERROR][categoriesRepo.update]', error);
      }
      return null;
    }
    return rowToCategory(updated as CategoryRow);
  },

  async delete(id: string) {
    const supabase = getSupabase();
    if (!supabase) return false;
    const { error } = await supabase.from('categories').delete().eq('id', id);
    if (error) {
      // eslint-disable-next-line no-console
      console.error('[SUPABASE ERROR][categoriesRepo.delete]', error);
      throw error;
    }
    return true;
  },
};
