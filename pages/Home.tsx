import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Banner } from '@/components/marketplace/banner';
import { CategoryPills, type CategoryPillItem } from '@/components/marketplace/CategoryPills';
import { AdCard } from '@/components/ads/AdCard';
import { useApp } from '@/context/AppContext';
import { getCachedPublicAds, getCachedClickStatsLast7Days, getCachedLikeCounts } from '@/lib/cachedData';
import { getTopLikedPublicAds, getTrendingPublicAds } from '@/lib/selectors/rankingSelectors';
import { AppButton } from '@/components/ui/app-button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Grid3X3, AlertCircle, RefreshCw } from 'lucide-react';
import { setPageTitleAndDescription } from '@/lib/seo';

const LOADING_DELAY_MS = 180;

/**
 * Home: banner, pills, em destaque e mais curtidos. Apenas anúncios de vendedores aprovados.
 * SAFE: Never crashes, always renders with fallback states.
 */
export function Home() {
  const { banners, ads, users, categories, loading, errors } = useApp();
  const [filterId, setFilterId] = useState<string>('');
  const [showLoading, setShowLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setShowLoading(false), LOADING_DELAY_MS);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    setPageTitleAndDescription(
      'CeluPublic – Marketplace de Produtos e Serviços em Moçambique',
      'Compre e divulgue produtos e serviços em Moçambique. Anúncios com contacto directo via WhatsApp.'
    );
  }, []);

  // Safe: guard against undefined/null arrays
  const safeCategories = categories ?? [];
  const safeAds = ads ?? [];
  const safeUsers = users ?? [];
  const safeBanners = banners ?? [];

  const pillItems = useMemo<CategoryPillItem[]>(() => {
    const base: CategoryPillItem[] = [
      { id: '', label: 'Todos' },
      { id: 'product', label: 'Produtos' },
      { id: 'service', label: 'Serviços' },
    ];
    const catPills = safeCategories.map((c) => ({ id: c.id, label: c.name }));
    return [...base, ...catPills];
  }, [safeCategories]);

  const publicAds = useMemo(() => {
    try {
      return getCachedPublicAds(safeAds, safeUsers);
    } catch (err: any) {
      // eslint-disable-next-line no-console
      console.error('[Home] Error in getCachedPublicAds:', err);
      return [];
    }
  }, [safeAds, safeUsers]);

  const filteredAds = useMemo(() => {
    if (!filterId) return [...publicAds].sort((a, b) => b.likes - a.likes);
    if (filterId === 'product') return publicAds.filter((a) => a.type === 'product').sort((a, b) => b.likes - a.likes);
    if (filterId === 'service') return publicAds.filter((a) => a.type === 'service').sort((a, b) => b.likes - a.likes);
    return publicAds.filter((a) => a.categoryId === filterId).sort((a, b) => b.likes - a.likes);
  }, [filterId, publicAds]);

  const [likeCounts, setLikeCounts] = useState<Record<string, number> | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const ids = publicAds.map((a) => a.id);
      if (ids.length === 0) {
        setLikeCounts({});
        return;
      }
      try {
        const counts = await getCachedLikeCounts(ids);
        if (!cancelled) setLikeCounts(counts);
      } catch (err: any) {
        // eslint-disable-next-line no-console
        console.error('[Home] Error loading like counts:', err);
        if (!cancelled) setLikeCounts({});
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [publicAds]);

  const topLiked = useMemo(() => {
    try {
      return getTopLikedPublicAds(safeAds, safeUsers, likeCounts || undefined, 8);
    } catch (err: any) {
      // eslint-disable-next-line no-console
      console.error('[Home] Error in getTopLikedPublicAds:', err);
      return [];
    }
  }, [safeAds, safeUsers, likeCounts]);

  const [trendingAds, setTrendingAds] = useState<typeof publicAds>([]);
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const stats = await getCachedClickStatsLast7Days();
        if (cancelled) return;
        const trending = getTrendingPublicAds(safeAds, safeUsers, stats.clicksByAdId, 8);
        const withClicks = trending.filter((ad) => (stats.clicksByAdId[ad.id] ?? 0) > 0);
        setTrendingAds(withClicks);
      } catch (err: any) {
        // eslint-disable-next-line no-console
        console.error('[Home] Error loading trending ads:', err);
        if (!cancelled) setTrendingAds([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [safeAds, safeUsers]);

  // Determine if we're in a loading state
  const isLoading = showLoading || loading.ads || loading.categories || loading.banners;
  const hasErrors = errors.ads || errors.categories || errors.banners;

  return (
    <div className="min-h-screen min-w-0 bg-background">
      {/* Safe: banners array might be empty, component handles it */}
      <Banner banners={safeBanners} />

      <div className="mx-auto min-w-0 max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Error banner (non-blocking) */}
        {hasErrors && (
          <Card className="mb-6 border-destructive/20 bg-destructive/5">
            <CardContent className="flex items-center gap-3 py-4">
              <AlertCircle className="h-5 w-5 text-destructive" />
              <div className="flex-1">
                <p className="text-sm font-medium text-destructive">
                  {errors.ads && 'Não foi possível carregar alguns anúncios.'}
                  {errors.categories && 'Não foi possível carregar categorias.'}
                  {errors.banners && 'Não foi possível carregar banners.'}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  A aplicação continua a funcionar, mas alguns dados podem estar incompletos.
                </p>
              </div>
              <AppButton
                variant="outline"
                size="sm"
                onClick={() => {
                  window.location.reload();
                }}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Recarregar
              </AppButton>
            </CardContent>
          </Card>
        )}

        {/* Categories pills - safe even if empty */}
        {safeCategories.length > 0 && (
          <CategoryPills items={pillItems} activeId={filterId} onChange={setFilterId} />
        )}

        {isLoading ? (
          <>
            <section className="mt-10">
              <Skeleton className="mb-6 h-6 w-32" />
              <div className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 sm:gap-y-10 lg:grid-cols-4 lg:gap-x-8 lg:gap-y-12">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex min-w-0 flex-col">
                    <Skeleton className="aspect-square w-full" />
                    <Skeleton className="mx-auto mt-4 h-4 max-w-[75%] w-full" />
                    <Skeleton className="mx-auto mt-2 h-3 max-w-[50%] w-full" />
                    <Skeleton className="mx-auto mt-2 h-8 w-24" />
                  </div>
                ))}
              </div>
            </section>
            <section className="mt-20 border-t border-border/40 pt-16">
              <Skeleton className="mb-8 h-6 w-28" />
              <div className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex flex-col">
                    <Skeleton className="aspect-square w-full" />
                    <Skeleton className="mt-4 h-4 w-full" />
                    <Skeleton className="mt-2 h-3 w-2/3" />
                  </div>
                ))}
              </div>
            </section>
          </>
        ) : filteredAds.length === 0 ? (
          <Card className="mt-12 border-dashed border-border">
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <Grid3X3 className="h-12 w-12 text-muted-foreground" />
              <p className="mt-4 text-muted-foreground">
                {filterId ? 'Nenhum anúncio nesta secção.' : 'Sem anúncios por enquanto.'}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {filterId ? 'Experimente outra categoria ou tipo.' : 'Seja o primeiro a anunciar no CeluPublic.'}
              </p>
              <AppButton variant="primary" asChild className="mt-4">
                <Link to="/cadastro">Criar conta e anunciar</Link>
              </AppButton>
            </CardContent>
          </Card>
        ) : (
          <section className="mt-10">
            <h2 className="mb-6 text-lg font-semibold text-foreground">Em destaque</h2>
            <div className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 sm:gap-y-10 lg:grid-cols-4 lg:gap-x-8 lg:gap-y-12">
              {filteredAds.map((ad) => (
                <AdCard key={ad.id} ad={ad} />
              ))}
            </div>
          </section>
        )}

        {topLiked.length > 0 && (
          <section className="mt-20 border-t border-border/40 pt-16">
            <h2 className="mb-6 text-lg font-semibold text-foreground">Mais curtidos</h2>
            <div className="mt-8 grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 sm:gap-y-10 lg:grid-cols-4 lg:gap-x-8 lg:gap-y-12">
              {topLiked.map((ad) => (
                <AdCard key={ad.id} ad={ad} />
              ))}
            </div>
          </section>
        )}

        {trendingAds.length > 0 && (
          <section className="mt-20 border-t border-border/40 pt-16">
            <h2 className="mb-6 text-lg font-semibold text-foreground">Em alta</h2>
            <p className="mb-4 text-sm text-muted-foreground">Anúncios com mais contactos via WhatsApp nos últimos 7 dias.</p>
            <div className="mt-8 grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 sm:gap-y-10 lg:grid-cols-4 lg:gap-x-8 lg:gap-y-12">
              {trendingAds.map((ad) => (
                <AdCard key={ad.id} ad={ad} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
