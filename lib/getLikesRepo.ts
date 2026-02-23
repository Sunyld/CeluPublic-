import type { LikesRepository } from './likesRepo';
import { likesRepo } from './local/likesRepo.local';
import { likesRepoSupabase } from './supabase/likesRepo.supabase';
import { useSupabase } from '@/lib/supabaseClient';

export function getLikesRepo(): LikesRepository {
  return useSupabase ? likesRepoSupabase : likesRepo;
}

