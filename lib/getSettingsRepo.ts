import type { SettingsRepository } from './settingsRepo';
import { settingsRepo } from './local/settingsRepo.local';
import { settingsRepoSupabase } from './supabase/settingsRepo.supabase';
import { useSupabase } from '@/lib/supabaseClient';

export function getSettingsRepo(): SettingsRepository {
  return useSupabase ? settingsRepoSupabase : settingsRepo;
}
