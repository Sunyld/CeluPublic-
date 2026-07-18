import type { Ad, AdStatus } from '@/types';

export interface AdsRepository {
  list(filters?: { userId?: string; status?: AdStatus }): Promise<Ad[]>;
  getById(id: string): Promise<Ad | null>;
  create(ad: Omit<Ad, 'id' | 'createdAt' | 'updatedAt'>, options?: { bypassLimit?: boolean }): Promise<Ad>;
  update(id: string, data: Partial<Omit<Ad, 'id' | 'userId'>>): Promise<Ad | null>;
  delete(id: string): Promise<boolean>;
}

export { adsRepo } from './local/adsRepo.local';
export { getAdsRepo } from './getAdsRepo';
