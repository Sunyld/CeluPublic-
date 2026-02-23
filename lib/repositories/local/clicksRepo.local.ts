/**
 * Local implementation: ad clicks stored in localStorage.
 * TODO Supabase: replace with ad_clicks table (id, ad_id, created_at, type).
 * Suggested index: (created_at), (ad_id, created_at) for stats by ad and by date.
 */
import type { AdClick, ClickStats } from '@/types';
import type { ClicksRepository } from '../clicksRepo';
import { storage } from '@/lib/storage';
import { invalidatePrefix } from '@/lib/cache';

const CACHE_PREFIX_CLICK_STATS = 'clickStats'; // invalidates clickStats:7d:v1 etc.

function genId(): string {
  return typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `click-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

export const clicksRepo: ClicksRepository = {
  async trackWhatsAppClick(adId: string, _userId?: string) {
    const now = new Date().toISOString();
    const click: AdClick = {
      id: genId(),
      adId,
      createdAt: now,
      type: 'whatsapp',
    };
    const clicks = storage.getAdClicks();
    storage.setAdClicks([...clicks, click]);
    invalidatePrefix(CACHE_PREFIX_CLICK_STATS);
  },

  async listClicks(filters) {
    let list = [...storage.getAdClicks()];
    if (filters?.adId) list = list.filter((c) => c.adId === filters.adId);
    if (filters?.from) {
      const fromMs = new Date(filters.from).getTime();
      list = list.filter((c) => new Date(c.createdAt).getTime() >= fromMs);
    }
    if (filters?.to) {
      const toMs = new Date(filters.to).getTime();
      list = list.filter((c) => new Date(c.createdAt).getTime() <= toMs);
    }
    list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return list;
  },

  async getStats(filters): Promise<ClickStats> {
    const list = await this.listClicks({
      from: filters?.from,
      to: filters?.to,
    });
    const clicksByAdId: Record<string, number> = {};
    for (const c of list) {
      clicksByAdId[c.adId] = (clicksByAdId[c.adId] ?? 0) + 1;
    }
    const topAds = Object.entries(clicksByAdId)
      .map(([adId, clicks]) => ({ adId, clicks }))
      .sort((a, b) => b.clicks - a.clicks);
    return {
      totalClicks: list.length,
      clicksByAdId,
      topAds,
    };
  },
};
