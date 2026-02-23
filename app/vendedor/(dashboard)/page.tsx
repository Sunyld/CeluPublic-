'use client';

import { useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/providers/AuthProvider';
import { useApp } from '@/context/AppContext';
import { useToast } from '@/context/ToastContext';
import { Plus, Trash2, Edit, Package, Briefcase, Loader2 } from 'lucide-react';
import { LIMITS, PLACEHOLDER_IMAGE } from '@/lib/constants';
import type { Ad } from '@/types';
import { AppButton } from '@/components/ui/app-button';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { withTimeout } from '@/lib/errors';

const USE_SUPABASE = process.env.NEXT_PUBLIC_USE_SUPABASE === 'true';
const FETCH_TIMEOUT_MS = 12000;
const LOG_PREFIX = '[SELLER/DASHBOARD/DELETE]';

console.log('[SELLER/DASHBOARD/PAGE] PATCH_LOADED v3', new Date().toISOString());

export default function SellerDashboard() {
    const { user } = useAuth();
    const { getAdsByUser, setAds, refreshAds } = useApp();
    const showToast = useToast().showToast;
    const [adToDelete, setAdToDelete] = useState<Ad | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const adIdToDeleteRef = useRef<string | null>(null);

    const myAds = user ? getAdsByUser(user.id) : [];
    const products = myAds.filter((a) => a.type === 'product');
    const services = myAds.filter((a) => a.type === 'service');

    const canAddProduct = products.length < LIMITS.MAX_PRODUCTS;
    const canAddService = services.length < LIMITS.MAX_SERVICES;

    const handleConfirmDelete = useCallback(async () => {
        const idToDelete = adToDelete?.id ?? adIdToDeleteRef.current;
        console.log(LOG_PREFIX, 'handleConfirmDelete chamado adId=', idToDelete);
        if (!idToDelete) {
            console.warn(LOG_PREFIX, 'confirmado sem adId');
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
                    throw new Error(errorMsg);
                }
                setAds((prev) => prev.filter((a) => a.id !== idToDelete));
                showToast({ variant: 'success', description: 'Anúncio apagado.' });
                console.log(LOG_PREFIX, 'sucesso adId=', idToDelete);
                void refreshAds();
            } else {
                setAds((prev) => prev.filter((a) => a.id !== idToDelete));
                showToast({ variant: 'success', description: 'Anúncio apagado.' });
            }
        } catch (e) {
            const msg = e instanceof Error ? e.message : 'Erro ao eliminar.';
            console.error(LOG_PREFIX, 'erro adId=', idToDelete, 'message=', msg);
            showToast({ variant: 'error', description: msg });
        } finally {
            setDeletingId(null);
            setAdToDelete(null);
            adIdToDeleteRef.current = null;
        }
    }, [adToDelete, USE_SUPABASE, setAds, showToast, refreshAds]);

    if (!user) return null;

    return (
        <div className="space-y-8" data-testid="patch-loaded">
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
                <h1 className="text-2xl font-bold text-foreground">Meu painel</h1>
                <p className="mt-1 text-muted-foreground">Olá, {user.name}. Gerencie os seus anúncios aqui.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <div className="rounded-2xl border border-border bg-card p-6">
                    <div className="flex items-center justify-between">
                        <h2 className="flex items-center gap-2 font-semibold text-foreground">
                            <Package size={22} className="text-primary" />
                            Produtos ({products.length}/{LIMITS.MAX_PRODUCTS})
                        </h2>
                        {canAddProduct && (
                            <AppButton variant="primary" size="sm" asChild className="gap-1">
                                <Link href="/vendedor/anuncios/novo?tipo=product">
                                    <Plus size={18} />
                                    Novo
                                </Link>
                            </AppButton>
                        )}
                    </div>
                    <ul className="mt-4 space-y-3">
                        {products.length === 0 ? (
                            <li className="py-8 text-center text-sm text-muted-foreground">Nenhum produto ainda.</li>
                        ) : (
                            products.map((ad) => (
                                <li key={ad.id} className="flex items-center gap-3 rounded-xl border border-border p-3">
                                    <img
                                        src={ad.images?.[0] || PLACEHOLDER_IMAGE}
                                        alt=""
                                        loading="lazy"
                                        className="h-12 w-12 rounded-lg object-cover"
                                    />
                                    <div className="min-w-0 flex-1">
                                        <Link href={`/anuncio/${ad.id}`} className="block truncate font-medium text-foreground hover:underline">
                                            {ad.title}
                                        </Link>
                                        <span className="text-sm text-muted-foreground">
                                            {ad.status === 'published' ? 'Publicado' : ad.status === 'hidden' ? 'Oculto' : 'Rascunho'}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <AppButton variant="ghost" size="icon" asChild title="Editar">
                                            <Link href={`/vendedor/anuncios/editar/${ad.id}`}>
                                                <Edit size={18} />
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
                                            {deletingId === ad.id ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
                                        </AppButton>
                                    </div>
                                </li>
                            ))
                        )}
                    </ul>
                </div>

                <div className="rounded-2xl border border-border bg-card p-6">
                    <div className="flex items-center justify-between">
                        <h2 className="flex items-center gap-2 font-semibold text-foreground">
                            <Briefcase size={22} className="text-primary" />
                            Serviços ({services.length}/{LIMITS.MAX_SERVICES})
                        </h2>
                        {canAddService && (
                            <AppButton variant="primary" size="sm" asChild className="gap-1">
                                <Link href="/vendedor/anuncios/novo?tipo=service">
                                    <Plus size={18} />
                                    Novo
                                </Link>
                            </AppButton>
                        )}
                    </div>
                    <ul className="mt-4 space-y-3">
                        {services.length === 0 ? (
                            <li className="py-8 text-center text-sm text-muted-foreground">Nenhum serviço ainda.</li>
                        ) : (
                            services.map((ad) => (
                                <li key={ad.id} className="flex items-center gap-3 rounded-xl border border-border p-3">
                                    <img
                                        src={ad.images?.[0] || PLACEHOLDER_IMAGE}
                                        alt=""
                                        loading="lazy"
                                        className="h-12 w-12 rounded-lg object-cover"
                                    />
                                    <div className="min-w-0 flex-1">
                                        <Link href={`/anuncio/${ad.id}`} className="block truncate font-medium text-foreground hover:underline">
                                            {ad.title}
                                        </Link>
                                        <span className="text-sm text-muted-foreground">
                                            {ad.status === 'published' ? 'Publicado' : ad.status === 'hidden' ? 'Oculto' : 'Rascunho'}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <AppButton variant="ghost" size="icon" asChild title="Editar">
                                            <Link href={`/vendedor/anuncios/editar/${ad.id}`}>
                                                <Edit size={18} />
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
                                            {deletingId === ad.id ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
                                        </AppButton>
                                    </div>
                                </li>
                            ))
                        )}
                    </ul>
                </div>
            </div>
        </div>
    );
}
