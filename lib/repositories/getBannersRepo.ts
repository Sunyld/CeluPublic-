import type { BannersRepository } from './bannersRepo';
import { bannersRepo } from './local/bannersRepo.local';
import { bannersRepoSupabase } from './supabase/bannersRepo.supabase';
import { useSupabase } from '@/lib/supabaseClient';

export function getBannersRepo(): BannersRepository {
  return useSupabase ? bannersRepoSupabase : bannersRepo;
}
