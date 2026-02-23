import type { Category } from '@/types';

export interface CategoriesRepository {
  list(): Promise<Category[]>;
  create(data: Omit<Category, 'id' | 'adCount'>): Promise<Category>;
  update(id: string, data: Partial<Omit<Category, 'id' | 'adCount'>>): Promise<Category | null>;
  delete(id: string): Promise<boolean>;
}

export { categoriesRepo } from './local/categoriesRepo.local';
