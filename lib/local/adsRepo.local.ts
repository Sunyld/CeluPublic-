import type { Ad } from '@/types';
import type { AdsRepository } from '../adsRepo';
import { storage } from '@/lib/storage';
import { invalidatePrefix } from '@/lib/cache';
import { AppError, ERROR_CODES } from '@/lib/errors';
import { LIMITS } from '@/lib/constants';

const CACHE_KEY = 'ads_list';

export const adsRepo: AdsRepository = {
  async list(filters) {
    const ads = storage.getAds();
    let result = [...ads];
    if (filters?.userId) result = result.filter((a) => a.userId === filters.userId);
    if (filters?.status !== undefined) result = result.filter((a) => a.status === filters.status);
    result.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    return result;
  },

  async getById(id: string) {
    const ads = storage.getAds();
    return ads.find((a) => a.id === id) ?? null;
  },

  async create(data, options) {
    const bypassLimit = options?.bypassLimit === true;
    if (!bypassLimit && data.userId) {
      const ads = storage.getAds();
      const ownerAds = ads.filter((a) => a.userId === data.userId);
      let countProduct = 0;
      let countService = 0;
      for (const a of ownerAds) {
        if (a.type === 'product') countProduct++;
        else countService++;
      }
      if (data.type === 'product' && countProduct >= LIMITS.MAX_PRODUCTS) {
        throw new AppError(ERROR_CODES.LIMIT_REACHED, 'Limite de 10 produtos atingido.');
      }
      if (data.type === 'service' && countService >= LIMITS.MAX_SERVICES) {
        throw new AppError(ERROR_CODES.LIMIT_REACHED, 'Limite de 5 serviços atingido.');
      }
    }
    const now = new Date().toISOString();
    const status = data.status ?? 'published';
    const ad: Ad = {
      ...data,
      status,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
    };
    const ads = storage.getAds();
    storage.setAds([...ads, ad]);
    invalidatePrefix(CACHE_KEY);
    return ad;
  },

  async update(id: string, data) {
    const ads = storage.getAds();
    const index = ads.findIndex((a) => a.id === id);
    if (index === -1) return null;
    const now = new Date().toISOString();
    const updated: Ad = { ...ads[index], ...data, updatedAt: now };
    const next = [...ads];
    next[index] = updated;
    storage.setAds(next);
    invalidatePrefix(CACHE_KEY);
    return updated;
  },

  async delete(id: string) {
    const ads = storage.getAds();
    const next = ads.filter((a) => a.id !== id);
    if (next.length === ads.length) return false;
    storage.setAds(next);
    invalidatePrefix(CACHE_KEY);
    return true;
  },
};
