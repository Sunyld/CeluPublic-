import type { AdsRepository } from './adsRepo';
import { adsRepo } from './local/adsRepo.local';
import { adsRepoSupabase } from './supabase/adsRepo.supabase';
import { useSupabase } from '@/lib/supabaseClient';

/** Returns the ads repository. In modo backend real, usa sempre Supabase. */
export function getAdsRepo(): AdsRepository {
  if (useSupabase) {
    // eslint-disable-next-line no-console
    console.log('[REPO] Using Supabase ads repo');
    return adsRepoSupabase;
  }
  return adsRepo;
}
