'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/providers/AuthProvider';
import { useApp } from '@/context/AppContext';
import { useToast } from '@/context/ToastContext';
import { Plus, Trash2, Edit, Package, Wrench, Eye, EyeOff, Loader2, RefreshCw } from 'lucide-react';
import { LIMITS, PLACEHOLDER_IMAGE } from '@/lib/constants';
import type { Ad } from '@/types';
import { AppButton } from '@/components/ui/app-button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { withTimeout } from '@/lib/errors';

const USE_SUPABASE = process.env.NEXT_PUBLIC_USE_SUPABASE === 'true';
const FETCH_TIMEOUT_MS = 12000;
const LOG_PREFIX = '[SELLER/ADS/DELETE]';

console.log('[SELLER/ADS/PAGE] PATCH_LOADED v3', new Date().toISOString());

export default function SellerAdsList() {
    const { user } = useAuth();
    const { getAdsByUser, setAds, refreshAds } = useApp();
    const showToast = useToast().showToast;
    const [adToDelete, setAdToDelete] = useState<Ad | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [sellerAds, setSellerAds] = useState<Ad[] | null>(null);
    const [loadingAds, setLoadingAds] = useState(false);
    const adIdToDeleteRef = useRef<string | null>(null);

    const loadSellerAds = useCallback(async () => {
        if (!user || !USE_SUPABASE) return;
        setLoadingAds(true);
        try {
            const r = await withTimeout(
                fetch('/api/vendedor/anuncios', { cache: 'no-store' }),
                FETCH_TIMEOUT_MS,
                'Carregar anúncios'
            );
            const d = await r.json();
            if (r.ok && Array.isArray(d.ads)) {
                setSellerAds(d.ads);
            } else {
                setSellerAds(null);
            }
        } catch (e) {
            showToast({ variant: 'error', description: e instanceof Error ? e.message : 'Erro ao carregar anúncios.' });
            setSellerAds(null);
        } finally {
            setLoadingAds(false);
        }
    }, [user, showToast]);

    useEffect(() => {
        if (!user || !USE_SUPABASE) return;
        setLoadingAds(true);
        void loadSellerAds();
    }, [user, USE_SUPABASE, loadSellerAds]);

    const myAds = USE_SUPABASE && sellerAds !== null
        ? sellerAds
        : (user ? getAdsByUser(user.id) : []);
    const products = myAds.filter((a) => a.type === 'product');
    const services = myAds.filter((a) => a.type === 'service');
    const canAddProduct = products.length < LIMITS.MAX_PRODUCTS;
    const canAddService = services.length < LIMITS.MAX_SERVICES;

    const handleConfirmDelete = useCallback(async () => {
        const idToDelete = adToDelete?.id ?? adIdToDeleteRef.current;
        console.log(LOG_PREFIX, 'handleConfirmDelete chamado adId=', idToDelete, 'adToDelete=', !!adToDelete, 'ref=', adIdToDeleteRef.current);
        if (!idToDelete) {
            console.warn(LOG_PREFIX, 'confirmado sem adId adToDelete=', !!adToDelete, 'ref=', adIdToDeleteRef.current);
            setAdToDelete(null);
            adIdToDeleteRef.current = null;
            return;
        }
        console.log(LOG_PREFIX, 'confirmado no modal adId=', idToDelete);
        setDeletingId(idToDelete);
        showToast({ variant: 'info', description: 'A eliminar...' });

        const url = `/api/vendedor/anuncios/${idToDelete}`;
        const method = 'DELETE';
        console.log(LOG_PREFIX, 'antes do fetch', { url, method, USE_SUPABASE });

        const previousSellerAds = sellerAds ?? null;

        try {
            if (USE_SUPABASE) {
                console.log(LOG_PREFIX, 'iniciando fetch DELETE para', url);
                const r = await withTimeout(
                    fetch(url, { method, cache: 'no-store', credentials: 'include' }),
                    FETCH_TIMEOUT_MS,
                    'Eliminar anúncio'
                );
                const d = await r.json().catch((err) => {
                    console.error(LOG_PREFIX, 'erro ao parsear JSON:', err);
                    return {};
                });
                console.log(LOG_PREFIX, 'resposta status=', r.status, 'body=', JSON.stringify(d));
                if (!r.ok) {
                    const errorMsg = typeof d.message === 'string' ? d.message : `Erro HTTP ${r.status}`;
                    console.error(LOG_PREFIX, 'resposta não ok:', errorMsg);
                    throw new Error(errorMsg);
                }
                console.log(LOG_PREFIX, 'sucesso! removendo do estado adId=', idToDelete);
                setSellerAds((prev) => (prev ? prev.filter((a) => a.id !== idToDelete) : null));
                setAds((prev) => prev.filter((a) => a.id !== idToDelete));
                showToast({ variant: 'success', description: 'Anúncio apagado.' });
                console.log(LOG_PREFIX, 'sucesso adId=', idToDelete);
                void loadSellerAds();
                void refreshAds();
            } else {
                console.log(LOG_PREFIX, 'modo local: removendo do estado adId=', idToDelete);
                setAds((prev) => prev.filter((a) => a.id !== idToDelete));
                showToast({ variant: 'success', description: 'Anúncio apagado.' });
            }
        } catch (e) {
            const msg = e instanceof Error ? e.message : 'Erro ao eliminar.';
            console.error(LOG_PREFIX, 'erro adId=', idToDelete, 'message=', msg, 'error=', e);
            showToast({ variant: 'error', description: msg });
            if (USE_SUPABASE && previousSellerAds) {
                console.log(LOG_PREFIX, 'rollback: restaurando lista anterior');
                setSellerAds(previousSellerAds);
            }
        } finally {
            setDeletingId(null);
            setAdToDelete(null);
            adIdToDeleteRef.current = null;
        }
    }, [adToDelete, USE_SUPABASE, sellerAds, setAds, showToast, loadSellerAds, refreshAds]);

    const setAdStatus = async (adId: string, status: 'published' | 'hidden') => {
        try {
            if (USE_SUPABASE) {
                const r = await withTimeout(
                    fetch(`/api/vendedor/anuncios/${adId}`, {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ status }),
                    }),
                    FETCH_TIMEOUT_MS,
                    'Atualizar estado'
                );
                if (!r.ok) {
                    const d = await r.json().catch(() => ({}));
                    throw new Error(d.message ?? 'Erro ao atualizar');
                }
                showToast({ variant: 'success', description: status === 'published' ? 'Anúncio publicado.' : 'Anúncio oculto.' });
                await loadSellerAds();
                await refreshAds();
            } else {
                setAds((prev) =>
                    prev.map((a) =>
                        a.id === adId ? { ...a, status, updatedAt: new Date().toISOString() } : a
                    )
                );
            }
        } catch (e) {
            showToast({ variant: 'error', description: e instanceof Error ? e.message : 'Erro ao atualizar.' });
        }
    };

    if (!user) return null;

    if (USE_SUPABASE && loadingAds && sellerAds === null) {
        return (
            <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">A carregar anúncios...</p>
            </div>
        );
    }

    if (USE_SUPABASE && !loadingAds && sellerAds === null && user) {
        return (
            <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4">
                <p className="text-sm text-muted-foreground">Não foi possível carregar os anúncios.</p>
                <AppButton variant="outline" onClick={() => loadSellerAds()} className="gap-2">
                    <RefreshCw className="h-4 w-4" />
                    Tentar novamente
                </AppButton>
            </div>
        );
    }

    const renderList = (list: Ad[], type: 'product' | 'service', canAdd: boolean) => (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-base">
                    {type === 'product' ? <Package className="h-4 w-4 text-primary" /> : <Wrench className="h-4 w-4 text-primary" />}
                    {type === 'product' ? 'Produtos' : 'Serviços'} ({list.length}/{type === 'product' ? LIMITS.MAX_PRODUCTS : LIMITS.MAX_SERVICES})
                </CardTitle>
                {canAdd && (
                    <AppButton variant="primary" size="sm" asChild className="gap-1">
                        <Link href={`/vendedor/anuncios/novo?tipo=${type}`}>
                            <Plus className="h-4 w-4" />
                            Novo
                        </Link>
                    </AppButton>
                )}
            </CardHeader>
            <CardContent>
                <ul className="space-y-3">
                    {list.length === 0 ? (
                        <li className="py-8 text-center text-sm text-muted-foreground">Nenhum anúncio ainda.</li>
                    ) : (
                        list.map((ad) => (
                            <li
                                key={ad.id}
                                className="flex items-center gap-3 rounded-xl border border-border p-3"
                            >
                                <img
                                    src={ad.images?.[0] || PLACEHOLDER_IMAGE}
                                    alt=""
                                    loading="lazy"
                                    className="h-12 w-12 rounded-lg object-cover"
                                />
                                <div className="min-w-0 flex-1">
                                    <Link
                                        href={`/anuncio/${ad.id}`}
                                        className="block truncate font-medium hover:underline text-foreground"
                                    >
                                        {ad.title}
                                    </Link>
                                    <span className="text-sm text-muted-foreground">
                                        {ad.status === 'published' ? 'Publicado' : ad.status === 'hidden' ? 'Oculto' : 'Rascunho'}
                                    </span>
                                </div>
                                <div className="flex items-center gap-1">
                                    {ad.status !== 'published' && (
                                        <AppButton variant="ghost" size="icon" title="Publicar" onClick={() => setAdStatus(ad.id, 'published')}>
                                            <Eye className="h-4 w-4" />
                                        </AppButton>
                                    )}
                                    {ad.status === 'published' && (
                                        <AppButton variant="ghost" size="icon" title="Ocultar" onClick={() => setAdStatus(ad.id, 'hidden')}>
                                            <EyeOff className="h-4 w-4" />
                                        </AppButton>
                                    )}
                                    <AppButton variant="ghost" size="icon" asChild title="Editar">
                                        <Link href={`/vendedor/anuncios/editar/${ad.id}`}>
                                            <Edit className="h-4 w-4" />
                                        </Link>
                                    </AppButton>
                                    <AppButton
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="text-destructive hover:bg-destructive/10"
                                        disabled={deletingId === ad.id}
                                        onClick={() => {
                                            console.log(LOG_PREFIX, 'clique Excluir adId=', ad.id);
                                            adIdToDeleteRef.current = ad.id;
                                            setAdToDelete(ad);
                                        }}
                                        title="Excluir"
                                    >
                                        {deletingId === ad.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                                    </AppButton>
                                </div>
                            </li>
                        ))
                    )}
                </ul>
            </CardContent>
        </Card>
    );

    return (
        <div className="space-y-6" data-testid="patch-loaded">
            <div className="sr-only">PATCH_LOADED v3</div>
            <ConfirmDialog
                open={!!adToDelete}
                onOpenChange={(open) => {
                    if (!open) {
                        setAdToDelete(null);
                        adIdToDeleteRef.current = null;
                    }
                }}
                title="Excluir anúncio"
                description="Tem certeza que deseja excluir este anúncio? Esta ação não pode ser desfeita."
                confirmLabel="Eliminar"
                cancelLabel="Cancelar"
                onConfirm={handleConfirmDelete}
                destructive
                loading={deletingId !== null}
            />
            <div>
                <h1 className="text-2xl font-bold text-foreground">Meus anúncios</h1>
                <p className="text-sm text-muted-foreground">
                    Gerir os seus anúncios publicados e rascunhos.
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {renderList(products, 'product', canAddProduct)}
                {renderList(services, 'service', canAddService)}
            </div>
        </div>
    );
}
