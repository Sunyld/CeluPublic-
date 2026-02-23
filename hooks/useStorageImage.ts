/**
 * Hook to resolve storage image URL asynchronously.
 * Handles both public and private buckets, normalizes paths/URLs.
 * 
 * Usage:
 *   const { url, loading, error } = useStorageImage('banner-images', banner.imagePath);
 *   <img src={url || placeholder} />
 */

import { useEffect, useState } from 'react';
import { resolveStorageUrl } from '@/lib/storageHelpers';

type UseStorageImageResult = {
  url: string;
  loading: boolean;
  error: string | null;
};

export function useStorageImage(
  bucket: string,
  pathOrUrl: string | null | undefined,
  options?: { preferSigned?: boolean }
): UseStorageImageResult {
  const [url, setUrl] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!pathOrUrl) {
      setUrl('');
      setLoading(false);
      setError(null);
      return;
    }

    let cancelled = false;

    const resolve = async () => {
      setLoading(true);
      setError(null);

      try {
        const resolvedUrl = await resolveStorageUrl(bucket, pathOrUrl, options);
        if (!cancelled) {
          setUrl(resolvedUrl);
          setLoading(false);
          if (!resolvedUrl) {
            setError('Failed to resolve image URL');
          }
        }
      } catch (err: any) {
        if (!cancelled) {
          if (process.env.NODE_ENV === 'development') {
            // eslint-disable-next-line no-console
            console.error('[useStorageImage] Error resolving URL:', {
              bucket,
              pathOrUrl,
              error: err?.message,
            });
          }
          setError(err?.message || 'Failed to load image');
          setUrl('');
          setLoading(false);
        }
      }
    };

    resolve();

    return () => {
      cancelled = true;
    };
  }, [bucket, pathOrUrl, options?.preferSigned]);

  return { url, loading, error };
}
