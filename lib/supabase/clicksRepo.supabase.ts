import type { ClickStats } from '@/types';
import type { ClicksRepository, ListClicksFilters, GetStatsFilters } from '../clicksRepo';
import { getSupabase } from '@/lib/supabaseClient';
import { toAppError, withTimeout } from '@/lib/errors';

export const clicksRepoSupabase: ClicksRepository = {
  async trackWhatsAppClick(adId: string, userId?: string) {
    const supabase = getSupabase();
    if (!supabase) return;
    const { error } = await supabase.from('ad_clicks').insert({
      ad_id: adId,
      user_id: userId ?? null,
      type: 'whatsapp',
    });
    if (error) {
      // eslint-disable-next-line no-console
      console.error('[SUPABASE ERROR][clicksRepo.trackWhatsAppClick]', error);
      throw error;
    }
  },

  async listClicks(_filters?: ListClicksFilters) {
    // Not used in Supabase mode for UI; return vazio.
    return [];
  },

  async getStats(filters?: GetStatsFilters): Promise<ClickStats> {
    const empty = (): ClickStats => ({ totalClicks: 0, clicksByAdId: {}, topAds: [] });
    const supabase = getSupabase();
    if (!supabase) return empty();

    const TIMEOUT_MS = 25_000;

    try {
      const useWindow = !!(filters?.from || filters?.to);
      const viewTable = useWindow ? 'ad_click_counts_7d' : 'ad_click_counts_all';

      const { data, error } = await withTimeout(
        supabase.from(viewTable).select('ad_id, clicks_total, clicks_7d'),
        TIMEOUT_MS,
        'Estatísticas de cliques'
      );

      if (!error && Array.isArray(data)) {
        const clicksByAdId: Record<string, number> = {};
        let total = 0;

        for (const row of data as any[]) {
          const adId = row.ad_id as string;
          const count = (row.clicks_total ?? row.clicks_7d ?? 0) as number;
          if (!adId) continue;
          clicksByAdId[adId] = count;
          total += count;
        }

        const topAds = Object.entries(clicksByAdId)
          .map(([adId, clicks]) => ({ adId, clicks }))
          .sort((a, b) => b.clicks - a.clicks);

        return {
          totalClicks: total,
          clicksByAdId,
          topAds,
        };
      }

      if (error) {
        const status = (error as any).status as number | undefined;
        const message = (error as any).message as string | undefined;
        const isViewMissing =
          status === 400 ||
          (message &&
            (message.includes('does not exist') ||
              message.includes('relation "ad_click_counts_') ||
              message.toLowerCase().includes('view')));

        if (!isViewMissing) {
          if (process.env.NODE_ENV === 'development') {
            // eslint-disable-next-line no-console
            console.error('[SUPABASE ERROR][clicksRepo.getStats]', error);
          }
          return empty();
        }
      }
    } catch (err) {
      if (process.env.NODE_ENV === 'development') {
        // eslint-disable-next-line no-console
        console.error('[SUPABASE ERROR][clicksRepo.getStats view]', err);
      }
    }

    try {
      let query = supabase.from('ad_clicks').select('ad_id, created_at');

      if (filters?.from) {
        query = query.gte('created_at', filters.from);
      }
      if (filters?.to) {
        query = query.lte('created_at', filters.to);
      }

      const { data, error } = await withTimeout(
        query,
        TIMEOUT_MS,
        'Estatísticas de cliques (fallback)'
      );

      if (error || !Array.isArray(data)) {
        if (error && process.env.NODE_ENV === 'development') {
          // eslint-disable-next-line no-console
          console.error('[SUPABASE ERROR][clicksRepo.getStats fallback]', error);
        }
        return empty();
      }

      const clicksByAdId: Record<string, number> = {};
      let total = 0;

      for (const row of data as any[]) {
        const adId = row.ad_id as string | undefined;
        if (!adId) continue;

        clicksByAdId[adId] = (clicksByAdId[adId] ?? 0) + 1;
        total += 1;
      }

      const topAds = Object.entries(clicksByAdId)
        .map(([adId, clicks]) => ({ adId, clicks }))
        .sort((a, b) => b.clicks - a.clicks);

      return {
        totalClicks: total,
        clicksByAdId,
        topAds,
      };
    } catch (err) {
      if (process.env.NODE_ENV === 'development') {
        // eslint-disable-next-line no-console
        console.error('[SUPABASE ERROR][clicksRepo.getStats fallback]', toAppError(err, { fallbackMessage: 'Não foi possível carregar estatísticas de cliques.' }));
      }
      return empty();
    }
  },
};

