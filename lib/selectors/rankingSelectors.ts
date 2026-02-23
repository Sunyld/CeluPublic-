/**
 * Ranking: Mais curtidos (by likes) and Em alta (by WhatsApp clicks in last 7 days).
 * Only public ads (status === 'published' + owner approved).
 */
import type { Ad, User } from '@/types';
import { getPublicAds } from './adsSelectors';

export type LikesMap = Record<string, number>;

/** Popular: sort public ads by likes desc. */
export function getTopLikedPublicAds(
  ads: Ad[],
  users: User[],
  likeCounts?: LikesMap,
  limit = 8
): Ad[] {
  const publicAds = getPublicAds(ads, users);
  if (!likeCounts) {
    return [...publicAds].sort((a, b) => b.likes - a.likes).slice(0, limit);
  }
  return [...publicAds]
    .sort((a, b) => {
      const la = likeCounts[a.id] ?? a.likes;
      const lb = likeCounts[b.id] ?? b.likes;
      return lb - la;
    })
    .slice(0, limit);
}

/** Clicks count per adId (e.g. from getStats for last 7 days). */
export type ClicksByAdId = Record<string, number>;

/** Trending: sort public ads by whatsapp clicks (last 7 days) desc. */
export function getTrendingPublicAds(
  ads: Ad[],
  users: User[],
  clicksByAdId: ClicksByAdId,
  limit = 8
): Ad[] {
  const publicAds = getPublicAds(ads, users);
  const publicIds = new Set(publicAds.map((a) => a.id));
  return [...publicAds]
    .sort((a, b) => {
      const clicksA = clicksByAdId[a.id] ?? 0;
      const clicksB = clicksByAdId[b.id] ?? 0;
      if (clicksB !== clicksA) return clicksB - clicksA;
      return b.likes - a.likes;
    })
    .filter((a) => (clicksByAdId[a.id] ?? 0) > 0 || publicIds.has(a.id))
    .slice(0, limit);
}
