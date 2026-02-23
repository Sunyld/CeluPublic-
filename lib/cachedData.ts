/**
 * Cached computed data: public ads list and click stats (7d).
 * Uses src/lib/cache.ts with TTL; invalidate on ad/user/click mutations.
 */
import type { Ad, User } from '@/types';
import { getCache, setCache, invalidate } from './cache';
import { getPublicAds } from './selectors/adsSelectors';
import { getClicksRepo } from './repositories/getClicksRepo';
import { getLikesRepo } from './repositories/getLikesRepo';
import { useSupabase } from './supabaseClient';

const PUBLIC_ADS_KEY = 'publicAds:v1';
const PUBLIC_ADS_TTL_MS = 60_000; // 60s

const CLICK_STATS_7D_KEY = 'clickStats:7d:v1';
const CLICK_STATS_TTL_MS = 30_000; // 30s

const LIKE_COUNTS_KEY = 'likeCounts:v1';
const LIKE_COUNTS_TTL_MS = 30_000;

export function getCachedPublicAds(ads: Ad[], users: User[]): Ad[] {
  const cached = getCache<Ad[]>(PUBLIC_ADS_KEY);
  if (cached != null) return cached;
  const result = getPublicAds(ads, users);
  setCache(PUBLIC_ADS_KEY, result, PUBLIC_ADS_TTL_MS);
  return result;
}

export function invalidatePublicAdsCache(): void {
  invalidate(PUBLIC_ADS_KEY);
}

export async function getCachedClickStatsLast7Days(): Promise<{
  totalClicks: number;
  clicksByAdId: Record<string, number>;
  topAds: { adId: string; clicks: number }[];
}> {
  const cached = getCache<{ totalClicks: number; clicksByAdId: Record<string, number>; topAds: { adId: string; clicks: number }[] }>(CLICK_STATS_7D_KEY);
  if (cached != null) return cached;
  try {
    const to = new Date();
    const from = new Date(to.getTime() - 7 * 24 * 60 * 60 * 1000);
    const stats = await getClicksRepo().getStats({
      from: from.toISOString(),
      to: to.toISOString(),
    });
    setCache(CLICK_STATS_7D_KEY, stats, CLICK_STATS_TTL_MS);
    return stats;
  } catch (err: any) {
    // eslint-disable-next-line no-console
    console.error('[CACHE] Failed to load click stats:', err);
    // Return empty stats instead of throwing
    const emptyStats = { totalClicks: 0, clicksByAdId: {}, topAds: [] };
    setCache(CLICK_STATS_7D_KEY, emptyStats, CLICK_STATS_TTL_MS);
    return emptyStats;
  }
}

export function invalidateClickStatsCache(): void {
  invalidate(CLICK_STATS_7D_KEY);
}

export async function getCachedLikeCounts(adIds: string[]): Promise<Record<string, number>> {
  if (!useSupabase) return {};
  const cached = getCache<Record<string, number>>(LIKE_COUNTS_KEY);
  if (cached != null) return cached;
  try {
    const counts = await getLikesRepo().getLikeCounts(adIds);
    setCache(LIKE_COUNTS_KEY, counts, LIKE_COUNTS_TTL_MS);
    return counts;
  } catch (err: any) {
    // eslint-disable-next-line no-console
    console.error('[CACHE] Failed to load like counts:', err);
    // Return empty map instead of throwing
    const emptyCounts: Record<string, number> = {};
    setCache(LIKE_COUNTS_KEY, emptyCounts, LIKE_COUNTS_TTL_MS);
    return emptyCounts;
  }
}

export function invalidateLikeCountsCache(): void {
  invalidate(LIKE_COUNTS_KEY);
}
