/**
 * Public ad selectors: only published ads whose owner has status "approved".
 * Use these for Home, AdListing, AdDetail related ads — not for admin or seller dashboard.
 */

import type { Ad, User } from '@/types';

function approvedOwnerIds(users: User[]): Set<string> {
  const set = new Set<string>();
  // Safe: guard against undefined/null
  if (!users || !Array.isArray(users)) return set;
  for (const u of users) {
    if (u?.status === 'approved' && u?.id) set.add(u.id);
  }
  return set;
}

/** Public ads: status published + owner approved, sorted by updatedAt desc. */
export function getPublicAds(ads: Ad[], users: User[]): Ad[] {
  if (!ads || !Array.isArray(ads)) return [];
  try {
    const approved = users?.length ? approvedOwnerIds(users) : null;
    return ads
      .filter((a) => {
        if (!a?.userId || a?.status !== 'published') return false;
        if (approved === null) return true;
        return approved.has(a.userId);
      })
      .sort((a, b) => {
        const timeA = a?.updatedAt ? new Date(a.updatedAt).getTime() : 0;
        const timeB = b?.updatedAt ? new Date(b.updatedAt).getTime() : 0;
        return timeB - timeA;
      });
  } catch (err: any) {
    // eslint-disable-next-line no-console
    console.error('[SELECTORS] Error in getPublicAds:', err);
    return [];
  }
}

/** Top ranked public ads by likes. */
export function getTopRankedPublicAds(ads: Ad[], users: User[], limit = 8): Ad[] {
  const publicAds = getPublicAds(ads, users ?? []);
  return [...publicAds].sort((a, b) => b.likes - a.likes).slice(0, limit);
}

/** Public ads in a category. */
export function getAdsByCategoryPublic(ads: Ad[], users: User[], categoryId: string): Ad[] {
  const approved = users?.length ? approvedOwnerIds(users) : null;
  return ads
    .filter((a) => a.status === 'published' && a.categoryId === categoryId && (approved === null || approved.has(a.userId)))
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
}

/** Related public ads (same category or type), excluding given ad. */
export function getRelatedPublicAds(ad: Ad, ads: Ad[], users: User[], limit = 4): Ad[] {
  const approved = users?.length ? approvedOwnerIds(users) : null;
  return ads
    .filter(
      (a) =>
        a.status === 'published' &&
        a.id !== ad.id &&
        (a.categoryId === ad.categoryId || a.type === ad.type) &&
        (approved === null || approved.has(a.userId))
    )
    .sort((a, b) => b.likes - a.likes)
    .slice(0, limit);
}

/** Whether the ad's owner is approved (for use in AdDetail: hide ad if not). */
export function isAdOwnerApproved(ad: Ad, users: User[]): boolean {
  const u = users.find((x) => x.id === ad.userId);
  return u?.status === 'approved';
}
