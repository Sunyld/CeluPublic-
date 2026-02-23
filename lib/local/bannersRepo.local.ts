import type { Banner } from '@/types';
import type { BannersRepository } from '../bannersRepo';
import { storage } from '@/lib/storage';

export const bannersRepo: BannersRepository = {
  async listPublic() {
    return storage.getBanners().filter((b) => b.active).sort((a, b) => a.order - b.order);
  },

  async listAll() {
    return storage.getBanners().sort((a, b) => a.order - b.order);
  },

  async getById(id: string) {
    return storage.getBanners().find((b) => b.id === id) ?? null;
  },

  async create(data) {
    const now = new Date().toISOString();
    const banner: Banner = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: now,
    };
    const banners = storage.getBanners();
    storage.setBanners([...banners, banner]);
    return banner;
  },

  async update(id: string, data) {
    const banners = storage.getBanners();
    const index = banners.findIndex((b) => b.id === id);
    if (index === -1) return null;
    const updated: Banner = { ...banners[index], ...data };
    const next = [...banners];
    next[index] = updated;
    storage.setBanners(next);
    return updated;
  },

  async delete(id: string) {
    const banners = storage.getBanners();
    const next = banners.filter((b) => b.id !== id);
    if (next.length === banners.length) return false;
    storage.setBanners(next);
    return true;
  },
};
