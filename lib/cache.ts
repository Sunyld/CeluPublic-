/**
 * Simple in-app cache with TTL. Used for ads list and other data to avoid reprocessing.
 * Invalidate when data is mutated (create/update/delete).
 */

const CACHE_PREFIX = 'celupublic_cache_';
const META_KEY = CACHE_PREFIX + 'meta';

type Meta = Record<string, { expires: number }>;

function getMeta(): Meta {
  try {
    const raw = localStorage.getItem(META_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function setMeta(meta: Meta) {
  try {
    localStorage.setItem(META_KEY, JSON.stringify(meta));
  } catch {
    // ignore
  }
}

/**
 * Get cached value. Returns null if missing or expired.
 */
export function getCache<T>(key: string): T | null {
  try {
    const meta = getMeta();
    const entry = meta[key];
    if (!entry || Date.now() > entry.expires) return null;
    const raw = localStorage.getItem(CACHE_PREFIX + key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

/**
 * Set cache with TTL in milliseconds.
 */
export function setCache<T>(key: string, value: T, ttlMs: number): void {
  try {
    const meta = getMeta();
    meta[key] = { expires: Date.now() + ttlMs };
    setMeta(meta);
    localStorage.setItem(CACHE_PREFIX + key, JSON.stringify(value));
  } catch {
    // ignore
  }
}

/**
 * Remove key from cache and storage.
 */
export function invalidate(key: string): void {
  try {
    const meta = getMeta();
    delete meta[key];
    setMeta(meta);
    localStorage.removeItem(CACHE_PREFIX + key);
  } catch {
    // ignore
  }
}

/**
 * Invalidate all keys that start with prefix (e.g. "ads" invalidates "ads_list", "ads_123").
 */
export function invalidatePrefix(prefix: string): void {
  try {
    const meta = getMeta();
    let changed = false;
    for (const k of Object.keys(meta)) {
      if (k.startsWith(prefix)) {
        delete meta[k];
        localStorage.removeItem(CACHE_PREFIX + k);
        changed = true;
      }
    }
    if (changed) setMeta(meta);
  } catch {
    // ignore
  }
}
