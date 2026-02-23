'use client';

import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { getAdsRepo } from '@/lib/repositories/adsRepo';
import { PLACEHOLDER_IMAGE } from '@/lib/constants';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AppButton } from '@/components/ui/app-button';
import { Badge } from '@/components/ui/badge';
import { Package, Eye, EyeOff, Trash2, User } from 'lucide-react';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import type { Ad, AdStatus } from '@/types';

const USE_SUPABASE = process.env.NEXT_PUBLIC_USE_SUPABASE === 'true';

export default function AdminAdsPage() {
    const { ads, setAds, refreshAds, users } = useApp();
    const [adToDelete, setAdToDelete] = useState<Ad | null>(null);

    const setAdStatus = async (adId: string, status: AdStatus) => {
        if (USE_SUPABASE) {
            const repo = getAdsRepo();
            await repo.update(adId, { status });
            await refreshAds();
        } else {
            setAds((prev) => prev.map((a) => (a.id === adId ? { ...a, status, updatedAt: new Date().toISOString() } : a)));
        }
    };

    const handleConfirmDelete = async () => {
        if (!adToDelete) return;
        if (USE_SUPABASE) {
            const repo = getAdsRepo();
            await repo.delete(adToDelete.id);
            await refreshAds();
        } else {
            setAds((prev) => prev.filter((a) => a.id !== adToDelete.id));
        }
        setAdToDelete(null);
    };

    const ownerName = (userId: string) => users.find((u) => u.id === userId)?.name ?? 'Utilizador desconhecido';

    return (
        <div className="space-y-6">
            <ConfirmDialog
                open={!!adToDelete}
                onOpenChange={(open) => !open && setAdToDelete(null)}
                title="Eliminar anúncio"
                description="Tem certeza que deseja eliminar este anúncio? Esta ação não pode ser desfeita."
                confirmLabel="Eliminar"
                cancelLabel="Cancelar"
                onConfirm={handleConfirmDelete}
                destructive
            />

            <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-bold tracking-tight">Anúncios</h1>
                <p className="text-sm text-muted-foreground">
                    Gestão centralizada de todos os anúncios da plataforma.
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                        <Package className="h-5 w-5 text-primary" />
                        Todos os anúncios ({ads.length})
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {ads.length === 0 ? (
                        <div className="py-20 text-center">
                            <Package className="mx-auto h-12 w-12 text-muted-foreground/30" />
                            <p className="mt-4 text-muted-foreground">Nenhum anúncio encontrado.</p>
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {ads.map((ad) => (
                                <div
                                    key={ad.id}
                                    className="group flex flex-col gap-4 rounded-xl border p-4 transition-colors hover:bg-muted/30 sm:flex-row sm:items-center"
                                >
                                    <img
                                        src={ad.images?.[0] || PLACEHOLDER_IMAGE}
                                        alt=""
                                        loading="lazy"
                                        className="h-16 w-16 rounded-lg object-cover bg-muted"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-semibold truncate text-foreground">{ad.title}</h3>
                                            <Badge variant={ad.status === 'published' ? 'default' : 'secondary'} className="h-5 text-[10px] px-1.5 capitalize">
                                                {ad.status === 'published' ? 'Ativo' : ad.status}
                                            </Badge>
                                        </div>
                                        <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                                            <span className="flex items-center gap-1">
                                                <User className="h-3 w-3" />
                                                {ownerName(ad.userId)}
                                            </span>
                                            <span>{ad.type === 'product' ? '📦 Produto' : '🔧 Serviço'}</span>
                                            <span>{ad.createdAt ? new Date(ad.createdAt).toLocaleDateString('pt-MZ') : ''}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 ml-auto">
                                        <AppButton
                                            variant={ad.status === 'published' ? 'outline' : 'default'}
                                            size="sm"
                                            onClick={() => setAdStatus(ad.id, ad.status === 'published' ? 'hidden' : 'published')}
                                            className="h-8 gap-1.5"
                                        >
                                            {ad.status === 'published' ? (
                                                <>
                                                    <EyeOff className="h-3.5 w-3.5" />
                                                    Ocultar
                                                </>
                                            ) : (
                                                <>
                                                    <Eye className="h-3.5 w-3.5" />
                                                    Publicar
                                                </>
                                            )}
                                        </AppButton>
                                        <AppButton
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-destructive hover:bg-destructive/10"
                                            onClick={() => setAdToDelete(ad)}
                                            title="Eliminar permanentemente"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </AppButton>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
