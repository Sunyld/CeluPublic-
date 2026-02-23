import type { Banner } from '@/types';

export interface BannersRepository {
  listPublic(): Promise<Banner[]>;
  listAll(): Promise<Banner[]>;
  getById(id: string): Promise<Banner | null>;
  create(data: Omit<Banner, 'id' | 'createdAt'>): Promise<Banner>;
  update(id: string, data: Partial<Omit<Banner, 'id'>>): Promise<Banner | null>;
  delete(id: string): Promise<boolean>;
}

export { bannersRepo } from './local/bannersRepo.local';
