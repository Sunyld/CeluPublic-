import type { CategoriesRepository } from './categoriesRepo';
import { categoriesRepo } from './local/categoriesRepo.local';
import { categoriesRepoSupabase } from './supabase/categoriesRepo.supabase';
import { useSupabase } from '@/lib/supabaseClient';

export function getCategoriesRepo(): CategoriesRepository {
  return useSupabase ? categoriesRepoSupabase : categoriesRepo;
}
