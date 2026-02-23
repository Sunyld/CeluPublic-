import type { LikesRepository } from '../likesRepo';

const PREFIX = 'CELU_LIKES:';

function getKey(userId: string): string {
  return `${PREFIX}${userId}`;
}

function load(userId: string): string[] {
  try {
    const raw = localStorage.getItem(getKey(userId));
    if (!raw) return [];
    const arr = JSON.parse(raw) as string[];
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

function save(userId: string, ids: string[]) {
  try {
    localStorage.setItem(getKey(userId), JSON.stringify(ids));
  } catch {
    // ignore
  }
}

export const likesRepo: LikesRepository = {
  async getUserLikes(userId: string) {
    return load(userId);
  },

  async toggleLike(adId: string, userId: string) {
    const list = load(userId);
    const idx = list.indexOf(adId);
    if (idx >= 0) {
      list.splice(idx, 1);
      save(userId, list);
      return false;
    }
    list.push(adId);
    save(userId, list);
    return true;
  },

  async getLikeCounts(_adIds: string[]) {
    // Local mode: contagens vêm do próprio objeto Ad.likes (mantém comportamento atual).
    return {};
  },
};

