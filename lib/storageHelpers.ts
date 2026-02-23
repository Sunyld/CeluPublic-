/**
 * Storage helpers: normalize paths, generate URLs (public or signed).
 * CRITICAL RULES:
 * - Never construct URLs manually by concatenating strings.
 * - Always use Supabase API: getPublicUrl() or createSignedUrl().
 * - DB stores ONLY paths (never full URLs).
 * - UI resolves URLs async when needed (signed URLs require async).
 */

import { getSupabase } from './supabaseClient';

// Build/caching proof stamp (updated when this file changes)
export const __STORAGE_HELPERS_VERSION__ = '2026-02-20T00:00:00Z';

const SIGNED_URL_CACHE = new Map<string, { url: string; expiresAt: number }>();

/**
 * Checks if a value looks like a URL (http/https).
 */
export function isProbablyUrl(value: string): boolean {
  return value.startsWith('http://') || value.startsWith('https://');
}

/**
 * Normalizes a storage path or URL to a clean path string.
 * 
 * Accepts:
 * - Pure path: `banners/x/y.jpg` -> `banners/x/y.jpg`
 * - Public URL: `.../storage/v1/object/public/<bucket>/<path>` -> extracts `<path>`
 * - Wrong URL (no /public/): `.../storage/v1/object/<bucket>/<path>` -> extracts `<path>`
 * 
 * Returns: clean path without leading/trailing slashes.
 */
export function normalizeStoragePath(input: string, bucket: string): string {
  if (!input) return '';

  // If it's already a path (no http/https), clean it
  if (!isProbablyUrl(input)) {
    return input.replace(/^\/+|\/+$/g, ''); // Remove leading/trailing slashes
  }

  // Extract path from URL
  // Format: https://<project>.supabase.co/storage/v1/object/public/<bucket>/<path>
  // Or: https://<project>.supabase.co/storage/v1/object/sign/<bucket>/<path>?...
  // Or (wrong): https://<project>.supabase.co/storage/v1/object/<bucket>/<path>
  try {
    const url = new URL(input);
    // Match both correct (/public/) and wrong (no /public/) formats
    let pathMatch = url.pathname.match(new RegExp(`/storage/v1/object/(?:public|sign)/${bucket}/(.+)$`));
    if (!pathMatch) {
      // Try wrong format (no /public/)
      pathMatch = url.pathname.match(new RegExp(`/storage/v1/object/${bucket}/(.+)$`));
    }
    if (pathMatch && pathMatch[1]) {
      return decodeURIComponent(pathMatch[1]);
    }

    // Fallback: try to find bucket in pathname
    const bucketIndex = url.pathname.indexOf(`/${bucket}/`);
    if (bucketIndex !== -1) {
      const afterBucket = url.pathname.substring(bucketIndex + bucket.length + 1);
      const queryIndex = afterBucket.indexOf('?');
      const path = queryIndex !== -1 ? afterBucket.substring(0, queryIndex) : afterBucket;
      return decodeURIComponent(path);
    }
  } catch {
    // Invalid URL, try manual extraction
    const bucketIndex = input.indexOf(`/${bucket}/`);
    if (bucketIndex !== -1) {
      const afterBucket = input.substring(bucketIndex + bucket.length + 1);
      const queryIndex = afterBucket.indexOf('?');
      const path = queryIndex !== -1 ? afterBucket.substring(0, queryIndex) : afterBucket;
      return decodeURIComponent(path);
    }
  }

  // URL but not recognized as a Storage URL for this bucket
  // Returning '' avoids accidentally treating arbitrary external URLs as Storage paths.
  return '';
}

/**
 * Gets a public URL synchronously using Supabase API.
 * Use this ONLY when bucket is public and you need immediate URL (e.g., in render).
 * Never tries signed URL (signed URLs require async).
 */
export function getPublicUrl(bucket: string, path: string): string {
  const supabase = getSupabase();
  if (!supabase) return '';

  const normalizedPath = normalizeStoragePath(path, bucket);
  if (!normalizedPath) return '';

  const { data } = supabase.storage.from(bucket).getPublicUrl(normalizedPath);
  return data?.publicUrl || '';
}

/**
 * Gets a signed URL asynchronously.
 * Implements cache by key `${bucket}:${path}` with expiration.
 */
export async function getSignedUrl(
  bucket: string,
  path: string,
  ttlSeconds = 3600
): Promise<string> {
  const supabase = getSupabase();
  if (!supabase) return '';

  const normalizedPath = normalizeStoragePath(path, bucket);
  if (!normalizedPath) return '';

  // Check cache
  const cacheKey = `${bucket}:${normalizedPath}`;
  const cached = SIGNED_URL_CACHE.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.url;
  }

  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUrl(normalizedPath, ttlSeconds);

    if (error) {
      if (process.env.NODE_ENV === 'development') {
        // eslint-disable-next-line no-console
        console.error('[STORAGE] Failed to create signed URL:', {
          bucket,
          path: normalizedPath,
          error: error.message,
          code: (error as any)?.statusCode,
          fullError: error,
        });
      }
      return '';
    }

    if (data?.signedUrl) {
      // Cache signed URL
      SIGNED_URL_CACHE.set(cacheKey, {
        url: data.signedUrl,
        expiresAt: Date.now() + ttlSeconds * 1000,
      });
      return data.signedUrl;
    }
  } catch (err) {
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.error('[STORAGE] Error creating signed URL:', err);
    }
  }

  return '';
}

/**
 * Resolves storage URL (public or signed) asynchronously.
 * 
 * Strategy:
 * - If preferSigned = true: tries signed first, falls back to public.
 * - Otherwise: tries public first, falls back to signed.
 * 
 * Returns URL ready for use in <img src="...">.
 */
export async function resolveStorageUrl(
  bucket: string,
  pathOrUrl: string,
  options?: { preferSigned?: boolean }
): Promise<string> {
  const supabase = getSupabase();
  if (!supabase) return '';

  // If it's an external URL (not a Supabase Storage URL), keep it as-is.
  // This keeps placeholders like https://placehold.co/... working.
  if (
    isProbablyUrl(pathOrUrl) &&
    !pathOrUrl.includes('/storage/v1/object/') &&
    !pathOrUrl.includes(`/${bucket}/`)
  ) {
    return pathOrUrl;
  }

  const normalizedPath = normalizeStoragePath(pathOrUrl, bucket);
  if (!normalizedPath) return '';

  if (options?.preferSigned) {
    // Try signed first
    const signedUrl = await getSignedUrl(bucket, normalizedPath);
    if (signedUrl) return signedUrl;
    // Fallback to public
    return getPublicUrl(bucket, normalizedPath);
  }

  // Try public first (default for public buckets)
  const publicUrl = getPublicUrl(bucket, normalizedPath);
  if (publicUrl) {
    // For public buckets, public URL should work
    // But if bucket is private, we'll get 400/403 when loading, so we could test here
    // For now, return public URL and let UI handle errors
    return publicUrl;
  }

  // Fallback to signed
  return getSignedUrl(bucket, normalizedPath);
}

/**
 * Clears the signed URL cache.
 */
export function clearStorageUrlCache(bucket?: string, path?: string): void {
  if (bucket && path) {
    const cacheKey = `${bucket}:${normalizeStoragePath(path, bucket)}`;
    SIGNED_URL_CACHE.delete(cacheKey);
  } else {
    SIGNED_URL_CACHE.clear();
  }
}
