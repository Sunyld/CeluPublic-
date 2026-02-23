'use client';

import { useState, useEffect } from 'react';
import type { Banner as BannerType } from '@/types';
import Link from 'next/link';
import { AppButton } from '@/components/ui/app-button';
import { cn } from '@/lib/utils';
import { useStorageImage } from '@/hooks/useStorageImage';

interface BannerProps {
  banners: BannerType[];
}

export function Banner({ banners }: BannerProps) {
  const [index, setIndex] = useState(0);
  const active = banners.filter((b) => b.active).sort((a, b) => a.order - b.order);
  const current = active[index];
  // Hook must run unconditionally (same order every render) — pass path only when we have a slide.
  const { url: resolvedUrl } = useStorageImage('banner-images', current?.imageUrl ?? null);

  useEffect(() => {
    if (active.length <= 1) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % active.length), 5000);
    return () => clearInterval(id);
  }, [active.length]);

  if (active.length === 0) return null;

  return (
    <section className="relative w-full overflow-hidden bg-muted">
      <div className="relative w-full aspect-[4/3] min-h-[220px] md:aspect-[21/9] md:min-h-[280px]">
        <img
          src={resolvedUrl || current.imageUrl}
          alt={current.title || 'Banner'}
          className="absolute inset-0 h-full w-full object-contain object-center md:object-cover md:object-center"
        />
        {(current.title || current.link) && (
          <div className="absolute left-0 top-0 flex h-full flex-col justify-center p-6 md:p-10 bg-gradient-to-r from-background/40 to-transparent">
            {current.title && (
              <h2 className="text-2xl font-bold tracking-tight text-white drop-shadow-md md:text-4xl max-w-lg">
                {current.title}
              </h2>
            )}
            {current.link && (
              current.link.startsWith('http') ? (
                <a
                  href={current.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center text-sm font-semibold text-white bg-primary px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors shadow-sm"
                >
                  Saiba mais →
                </a>
              ) : (
                <Link
                  href={current.link}
                  className="mt-4 inline-flex items-center text-sm font-semibold text-white bg-primary px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors shadow-sm w-fit"
                >
                  Saiba mais →
                </Link>
              )
            )}
          </div>
        )}
      </div>
      {active.length > 1 && (
        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
          {active.map((_, i) => (
            <button
              key={i}
              type="button"
              className={cn(
                'h-2 rounded-full transition-all duration-300',
                i === index ? 'w-8 bg-white' : 'w-2 bg-white/50 hover:bg-white/70'
              )}
              onClick={() => setIndex(i)}
              aria-label={`Banner ${i + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
