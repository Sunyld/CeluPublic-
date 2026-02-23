/**
 * Persistência local para MVP.
 * Permite que o app funcione sem backend; depois pode ser trocado por Supabase.
 */

import type { Ad, AdStatus, AdClick, Category, User, Banner, LikedAdIds } from '../types';

const KEYS = {
  ADS: 'celupublic_ads',
  CATEGORIES: 'celupublic_categories',
  USERS: 'celupublic_users',
  BANNERS: 'celupublic_banners',
  LIKED_IDS: 'celupublic_liked',
  CURRENT_USER: 'celupublic_current_user',
  AD_CLICKS: 'celupublic_ad_clicks',
} as const;

function get<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw == null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function set(key: string, value: unknown): void {
  localStorage.setItem(key, JSON.stringify(value));
}

type AdStored = Ad | (Omit<Ad, 'status'> & { published?: boolean });

function normalizeAd(a: AdStored): Ad {
  const status: AdStatus =
    'status' in a && a.status != null
      ? a.status
      : (a as { published?: boolean }).published === true
        ? 'published'
        : 'draft';
  const { published, ...rest } = a as Ad & { published?: boolean };
  return { ...rest, status };
}

export const storage = {
  getAds(): Ad[] {
    const raw = get<AdStored[]>(KEYS.ADS, []);
    return raw.map(normalizeAd);
  },
  setAds(ads: Ad[]) {
    set(KEYS.ADS, ads);
  },

  getCategories(): Category[] {
    return get(KEYS.CATEGORIES, []);
  },
  setCategories(categories: Category[]) {
    set(KEYS.CATEGORIES, categories);
  },

  getUsers(): User[] {
    return get(KEYS.USERS, []);
  },
  setUsers(users: User[]) {
    set(KEYS.USERS, users);
  },

  getBanners(): Banner[] {
    return get(KEYS.BANNERS, []);
  },
  setBanners(banners: Banner[]) {
    set(KEYS.BANNERS, banners);
  },

  getLikedIds(): LikedAdIds {
    return get(KEYS.LIKED_IDS, {});
  },
  setLikedIds(ids: LikedAdIds) {
    set(KEYS.LIKED_IDS, ids);
  },

  getCurrentUserId(): string | null {
    return get(KEYS.CURRENT_USER, null);
  },
  setCurrentUserId(id: string | null) {
    set(KEYS.CURRENT_USER, id);
  },

  getAdClicks(): AdClick[] {
    return get(KEYS.AD_CLICKS, []);
  },
  setAdClicks(clicks: AdClick[]) {
    set(KEYS.AD_CLICKS, clicks);
  },
};
