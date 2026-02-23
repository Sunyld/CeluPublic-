'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { getPublicAds, getAdsByCategoryPublic } from '@/lib/selectors/adsSelectors';
import { CIDADES_POR_PROVINCIA, PROVINCIAS_MOCAMBIQUE } from '@/lib/constants';
import { AdCard } from '@/components/ads/AdCard';
import { AppButton } from '@/components/ui/app-button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Package, Wrench, Tag, ArrowLeft, MapPin } from 'lucide-react';

const LOADING_DELAY_MS = 150;

function buildSearch(
    opts: { categoria?: string; tipo?: string; provincia?: string; cidade?: string }
): string {
    const p = new URLSearchParams();
    if (opts.categoria) p.set('categoria', opts.categoria);
    if (opts.tipo) p.set('tipo', opts.tipo);
    if (opts.provincia) p.set('provincia', opts.provincia);
    if (opts.cidade) p.set('cidade', opts.cidade);
    const s = p.toString();
    return s ? `?${s}` : '';
}

export default function AdListingPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    const categoryId = searchParams.get('categoria') || '';
    const type = searchParams.get('tipo') as 'product' | 'service' | null;
    const province = searchParams.get('provincia') || '';
    const city = searchParams.get('cidade') || '';

    const { ads, users, getCategoryById, categories } = useApp();

    const category = useMemo(() => categoryId ? getCategoryById(categoryId) : null, [categoryId, getCategoryById]);

    useEffect(() => {
        const t = setTimeout(() => setLoading(false), LOADING_DELAY_MS);
        return () => clearTimeout(t);
    }, []);

    const citiesInProvince = useMemo(() => province ? (CIDADES_POR_PROVINCIA[province] ?? []) : [], [province]);

    const filtered = useMemo(() => {
        const allAds = categoryId
            ? getAdsByCategoryPublic(ads, users, categoryId)
            : getPublicAds(ads, users);
        let f = allAds;
        if (type) f = f.filter((a) => a.type === type);
        if (province) {
            const citiesSet = new Set(citiesInProvince);
            f = f.filter((a) => citiesSet.has(a.location));
        }
        if (city) f = f.filter((a) => a.location === city);
        return f;
    }, [ads, users, categoryId, type, province, city, citiesInProvince]);

    const clearFilters = () => router.push('/anuncios');

    const setProvince = (p: string) => {
        router.push(`/anuncios${buildSearch({ categoria: categoryId || undefined, tipo: type || undefined, provincia: p || undefined })}`);
    };

    const setCity = (c: string) => {
        router.push(`/anuncios${buildSearch({ categoria: categoryId || undefined, tipo: type || undefined, provincia: province || undefined, cidade: c || undefined })}`);
    };

    return (
        <div className="mx-auto min-w-0 max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <div className="mb-6 flex min-w-0 items-center gap-2">
                <Tag className="h-6 w-6 shrink-0 text-primary" aria-hidden />
                <h1 className="min-w-0 truncate text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                    {category ? category.name : 'Anúncios'}
                </h1>
            </div>
            <p className="text-muted-foreground">{filtered.length} resultado(s)</p>

            <div className="mt-6 space-y-4">
                <div className="flex flex-wrap gap-2">
                    <AppButton variant={!categoryId && !type && !province && !city ? 'primary' : 'outline'} size="sm" asChild>
                        <Link href="/anuncios">Todos</Link>
                    </AppButton>
                    <AppButton variant={type === 'product' ? 'primary' : 'outline'} size="sm" asChild className="gap-1">
                        <Link href={`/anuncios${buildSearch({ categoria: categoryId || undefined, tipo: 'product', provincia: province || undefined, cidade: city || undefined })}`}>
                            <Package className="h-4 w-4" /> Produtos
                        </Link>
                    </AppButton>
                    <AppButton variant={type === 'service' ? 'primary' : 'outline'} size="sm" asChild className="gap-1">
                        <Link href={`/anuncios${buildSearch({ categoria: categoryId || undefined, tipo: 'service', provincia: province || undefined, cidade: city || undefined })}`}>
                            <Wrench className="h-4 w-4" /> Serviços
                        </Link>
                    </AppButton>
                    {categories.map((c) => (
                        <AppButton
                            key={c.id}
                            variant={categoryId === c.id ? 'primary' : 'outline'}
                            size="sm"
                            asChild
                        >
                            <Link href={`/anuncios${buildSearch({ categoria: c.id, tipo: type || undefined, provincia: province || undefined, cidade: city || undefined })}`}>{c.name}</Link>
                        </AppButton>
                    ))}
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    <MapPin className="h-4 w-4 shrink-0 text-muted-foreground" />
                    <select
                        aria-label="Província"
                        value={province}
                        onChange={(e) => setProvince(e.target.value)}
                        className="h-9 rounded-md border border-input bg-background px-3 py-1.5 text-sm min-w-0 max-w-[180px]"
                    >
                        <option value="">Todas as províncias</option>
                        {PROVINCIAS_MOCAMBIQUE.map((p) => (
                            <option key={p} value={p}>{p}</option>
                        ))}
                    </select>
                    <select
                        aria-label="Cidade"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        disabled={!province}
                        className="h-9 rounded-md border border-input bg-background px-3 py-1.5 text-sm disabled:opacity-50 min-w-0 max-w-[180px]"
                    >
                        <option value="">Todas as cidades</option>
                        {citiesInProvince.map((c) => (
                            <option key={c} value={c}>{c}</option>
                        ))}
                    </select>
                    {(categoryId || type || province || city) && (
                        <AppButton variant="ghost" size="sm" onClick={clearFilters} className="gap-1 text-muted-foreground">
                            <ArrowLeft className="h-4 w-4" /> Limpar filtros
                        </AppButton>
                    )}
                </div>
            </div>

            {loading ? (
                <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="flex min-w-0 flex-col">
                            <Skeleton className="aspect-square w-full rounded-lg" />
                            <Skeleton className="mx-auto mt-4 h-4 max-w-[75%] w-full" />
                            <Skeleton className="mx-auto mt-2 h-3 max-w-[50%] w-full" />
                            <Skeleton className="mx-auto mt-2 h-8 w-24" />
                        </div>
                    ))}
                </div>
            ) : filtered.length === 0 ? (
                <Card className="mt-8 border-dashed">
                    <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                        <Tag className="h-12 w-12 text-muted-foreground" />
                        <p className="mt-4 text-muted-foreground">Nenhum anúncio encontrado com estes filtros.</p>
                        <AppButton variant="outline" onClick={clearFilters} className="mt-4 gap-1">
                            <ArrowLeft className="h-4 w-4" /> Limpar filtros
                        </AppButton>
                    </CardContent>
                </Card>
            ) : (
                <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {filtered.map((ad) => (
                        <AdCard key={ad.id} ad={ad} />
                    ))}
                </div>
            )}
        </div>
    );
}
