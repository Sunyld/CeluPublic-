'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
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

const LOADING_DELAY_MS = 180;

export default function Home() {
    const { banners, ads, users, categories, loading, errors } = useApp();
    const [filterId, setFilterId] = useState<string>('');
    const [showLoading, setShowLoading] = useState(true);

    useEffect(() => {
        const t = setTimeout(() => setShowLoading(false), LOADING_DELAY_MS);
        return () => clearTimeout(t);
    }, []);

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
            return [];
        }
    }, [safeAds, safeUsers]);

    const filteredAds = useMemo(() => {
        if (!filterId) return [...publicAds].sort((a, b) => b.likes - a.likes).slice(0, 12);
        if (filterId === 'product') return publicAds.filter((a) => a.type === 'product').sort((a, b) => b.likes - a.likes).slice(0, 12);
        if (filterId === 'service') return publicAds.filter((a) => a.type === 'service').sort((a, b) => b.likes - a.likes).slice(0, 12);
        return publicAds.filter((a) => a.categoryId === filterId).sort((a, b) => b.likes - a.likes).slice(0, 12);
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
                if (!cancelled) setTrendingAds([]);
            }
        })();
        return () => {
            cancelled = true;
        };
    }, [safeAds, safeUsers]);

    const isLoading = showLoading || loading.ads || loading.categories || loading.banners;
    const hasErrors = errors.ads || errors.categories || errors.banners;

    return (
        <div className="min-h-screen min-w-0 bg-background">
            <Banner banners={safeBanners} />

            <div className="mx-auto min-w-0 max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                {hasErrors && (
                    <Card className="mb-6 border-destructive/20 bg-destructive/5">
                        <CardContent className="flex items-center gap-3 py-4">
                            <AlertCircle className="h-5 w-5 text-destructive" />
                            <div className="flex-1">
                                <p className="text-sm font-medium text-destructive">
                                    Não foi possível carregar alguns dados da plataforma.
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    A plataforma continua funcional, mas alguns anúncios podem não estar visíveis.
                                </p>
                            </div>
                            <AppButton
                                variant="outline"
                                size="sm"
                                onClick={() => window.location.reload()}
                            >
                                <RefreshCw className="h-4 w-4 mr-2" />
                                Recarregar
                            </AppButton>
                        </CardContent>
                    </Card>
                )}

                {safeCategories.length > 0 && (
                    <CategoryPills items={pillItems} activeId={filterId} onChange={setFilterId} />
                )}

                {isLoading ? (
                    <div className="mt-10 space-y-20">
                        <section>
                            <Skeleton className="mb-6 h-6 w-32" />
                            <div className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="flex min-w-0 flex-col">
                                        <Skeleton className="aspect-square w-full rounded-lg" />
                                        <Skeleton className="mx-auto mt-4 h-4 w-3/4" />
                                        <Skeleton className="mx-auto mt-2 h-3 w-1/2" />
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>
                ) : filteredAds.length === 0 ? (
                    <Card className="mt-12 border-dashed border-border">
                        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                            <Grid3X3 className="h-12 w-12 text-muted-foreground" />
                            <p className="mt-4 text-muted-foreground">
                                {filterId ? 'Nenhum anúncio nesta secção.' : 'Sem anúncios disponíveis no momento.'}
                            </p>
                            <AppButton variant="primary" asChild className="mt-4">
                                <Link href="/cadastro">Anunciar agora</Link>
                            </AppButton>
                        </CardContent>
                    </Card>
                ) : (
                    <section className="mt-10">
                        <h2 className="mb-6 text-lg font-semibold text-foreground">Destaques</h2>
                        <div className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
                            {filteredAds.map((ad) => (
                                <AdCard key={ad.id} ad={ad} />
                            ))}
                        </div>
                        {filteredAds.length >= 12 && (
                            <div className="mt-10 text-center">
                                <AppButton variant="outline" asChild>
                                    <Link href="/anuncios">Ver todos os anúncios</Link>
                                </AppButton>
                            </div>
                        )}
                    </section>
                )}

                {topLiked.length > 0 && !isLoading && (
                    <section className="mt-20 border-t border-border/40 pt-16">
                        <h2 className="mb-6 text-lg font-semibold text-foreground">Mais Favoritos</h2>
                        <div className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
                            {topLiked.map((ad) => (
                                <AdCard key={ad.id} ad={ad} />
                            ))}
                        </div>
                    </section>
                )}

                {trendingAds.length > 0 && !isLoading && (
                    <section className="mt-20 border-t border-border/40 pt-16">
                        <h2 className="mb-6 text-lg font-semibold text-foreground">Populares no WhatsApp</h2>
                        <p className="mb-4 text-sm text-muted-foreground">Anúncios com mais contactos nos últimos dias.</p>
                        <div className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
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
