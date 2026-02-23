import type { AdClick, ClickStats } from '@/types';

export interface ListClicksFilters {
  from?: string; // ISO date
  to?: string;   // ISO date
  adId?: string;
}

export interface GetStatsFilters {
  from?: string;
  to?: string;
}

export interface ClicksRepository {
  trackWhatsAppClick(adId: string, userId?: string): Promise<void>;
  listClicks(filters?: ListClicksFilters): Promise<AdClick[]>;
  getStats(filters?: GetStatsFilters): Promise<ClickStats>;
}

export { clicksRepo } from './local/clicksRepo.local';
