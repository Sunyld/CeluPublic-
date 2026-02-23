import type { ClicksRepository } from './clicksRepo';
import { clicksRepo } from './local/clicksRepo.local';
import { clicksRepoSupabase } from './supabase/clicksRepo.supabase';
import { useSupabase } from '@/lib/supabaseClient';

export function getClicksRepo(): ClicksRepository {
  return useSupabase ? clicksRepoSupabase : clicksRepo;
}

