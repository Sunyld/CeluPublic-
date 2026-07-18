import type { Category } from '@/types';
import type { CategoriesRepository } from '../categoriesRepo';
import { storage } from '@/lib/storage';
import { CategoryIconService } from '@/lib/categoryIconService';

export const categoriesRepo: CategoriesRepository = {
  async list() {
    return storage.getCategories();
  },

  async create(data) {
    let icon = data.icon;
    
    // If no icon provided, use CategoryIconService to suggest one
    if (!icon) {
      const suggestion = CategoryIconService.suggestIcon(data.name);
      icon = suggestion.name;
    }
    
    const category: Category = {
      ...data,
      icon,
      id: crypto.randomUUID(),
    };
    const categories = storage.getCategories();
    storage.setCategories([...categories, category]);
    return category;
  },

  async update(id: string, data) {
    const categories = storage.getCategories();
    const index = categories.findIndex((c) => c.id === id);
    if (index === -1) return null;
    const updated: Category = { ...categories[index], ...data };
    const next = [...categories];
    next[index] = updated;
    storage.setCategories(next);
    return updated;
  },

  async delete(id: string) {
    const categories = storage.getCategories();
    const next = categories.filter((c) => c.id !== id);
    if (next.length === categories.length) return false;
    storage.setCategories(next);
    return true;
  },
};
