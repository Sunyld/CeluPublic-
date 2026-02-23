import { useState, useEffect, useRef, useCallback } from 'react';
import type { Banner as BannerType } from '@/types';
import { AppButton } from '@/components/ui/app-button';
import { useStorageImage } from '@/hooks/useStorageImage';

const AUTOPLAY_MS = 5000;

/**
 * Banners full-width: autoplay quando >1, fade suave, pausa ao hover.
 */
interface BannerCarouselProps {
  banners: BannerType[];
}

export function BannerCarousel({ banners }: BannerCarouselProps) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const active = banners.filter((b) => b.active).sort((a, b) => a.order - b.order);
  const current = active[index];

  const goNext = useCallback(() => {
    if (active.length <= 1) return;
    setIndex((i) => (i + 1) % active.length);
  }, [active.length]);

  useEffect(() => {
    if (active.length <= 1 || paused) return;
    intervalRef.current = setInterval(goNext, AUTOPLAY_MS);
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [active.length, paused, goNext]);

  if (active.length === 0) return null;

  return (
    <section
      className="relative w-full overflow-hidden bg-slate-200"
      onMouseEnter={() => active.length > 1 && setPaused(true)}
      onMouseLeave={() => active.length > 1 && setPaused(false)}
    >
      <div className="relative w-full min-h-[200px] sm:min-h-[280px] md:min-h-[360px]">
        <BannerSlide current={current} index={index} />
        {current?.title && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 text-white z-10">
            <h2 className="text-xl font-bold md:text-2xl">{current.title}</h2>
          </div>
        )}
      </div>
      {active.length > 1 && (
        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2 z-10">
          {active.map((_, i) => (
            <AppButton
              key={i}
              type="button"
              variant="ghost"
              size="icon"
              className={`h-2 min-w-0 rounded-full p-0 transition-all ${i === index ? 'w-6 bg-white' : 'w-2 bg-white/60'}`}
              onClick={() => setIndex(i)}
              aria-label={`Banner ${i + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}

function BannerSlide({ current, index }: { current: BannerType | undefined; index: number }) {
  const { url: resolvedUrl } = useStorageImage('banner-images', current?.imageUrl ?? null);
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    setOpacity(0);
    const t = setTimeout(() => setOpacity(1), 30);
    return () => clearTimeout(t);
  }, [index]);

  if (!current) return null;
  return (
    <img
      key={index}
      src={resolvedUrl || current.imageUrl}
      alt={current.title || 'Banner'}
      className="h-full w-full object-contain object-center md:object-cover md:object-center transition-opacity duration-500"
      style={{ minHeight: '200px', maxHeight: '50vh', opacity }}
    />
  );
}
