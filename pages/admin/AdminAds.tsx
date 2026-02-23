import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { getAdsRepo } from '@/lib/repositories/adsRepo';
import { useSupabase } from '@/lib/supabaseClient';
import { PLACEHOLDER_IMAGE } from '@/lib/constants';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AppButton } from '@/components/ui/app-button';
import { Badge } from '@/components/ui/badge';
import { Package, Eye, EyeOff, Trash2 } from 'lucide-react';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import type { Ad, AdStatus } from '@/types';

export function AdminAds() {
  const { ads, setAds, refreshAds, users } = useApp();
  const [adToDelete, setAdToDelete] = useState<Ad | null>(null);

  const setAdStatus = async (adId: string, status: AdStatus) => {
    if (useSupabase) {
      const repo = getAdsRepo();
      await repo.update(adId, { status });
      await refreshAds();
    } else {
      setAds((prev) => prev.map((a) => (a.id === adId ? { ...a, status, updatedAt: new Date().toISOString() } : a)));
    }
  };

  const handleConfirmDelete = async () => {
    if (!adToDelete) return;
    if (useSupabase) {
      const repo = getAdsRepo();
      await repo.delete(adToDelete.id);
      await refreshAds();
    } else {
      setAds((prev) => prev.filter((a) => a.id !== adToDelete.id));
    }
    setAdToDelete(null);
  };

  const ownerName = (userId: string) => users.find((u) => u.id === userId)?.name ?? userId;

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
      <div>
        <h2 className="text-lg font-semibold">Anúncios</h2>
        <p className="text-sm text-muted-foreground">
          Publicar, ocultar ou eliminar anúncios. Dono e estado de cada anúncio.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Package className="h-4 w-4" />
            Lista de anúncios ({ads.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {ads.length === 0 ? (
            <p className="py-8 text-center text-muted-foreground">Nenhum anúncio.</p>
          ) : (
            <ul className="space-y-3">
              {ads.map((ad) => (
                <li
                  key={ad.id}
                  className="flex flex-wrap items-center gap-4 rounded-lg border p-4"
                >
                  <img
                    src={ad.images?.[0] || PLACEHOLDER_IMAGE}
                    alt=""
                    loading="lazy"
                    className="h-14 w-14 rounded-lg object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium">{ad.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {ad.type} · Dono: {ownerName(ad.userId)} · {ad.status === 'published' ? 'Publicado' : ad.status === 'hidden' ? 'Oculto' : 'Rascunho'}
                    </p>
                  </div>
                  <Badge variant={ad.status === 'published' ? 'default' : 'secondary'}>
                    {ad.status === 'published' ? 'Publicado' : ad.status === 'hidden' ? 'Oculto' : 'Rascunho'}
                  </Badge>
                  <AppButton
                    variant={ad.status === 'published' ? 'outline' : 'primary'}
                    size="sm"
                    onClick={() => setAdStatus(ad.id, ad.status === 'published' ? 'hidden' : 'published')}
                    className="gap-1"
                  >
                    {ad.status === 'published' ? (
                      <>
                        <EyeOff className="h-4 w-4" />
                        Ocultar
                      </>
                    ) : (
                      <>
                        <Eye className="h-4 w-4" />
                        Publicar
                      </>
                    )}
                  </AppButton>
                  <AppButton
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:bg-destructive/10"
                    onClick={() => setAdToDelete(ad)}
                    title="Eliminar"
                  >
                    <Trash2 className="h-4 w-4" />
                  </AppButton>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
