import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useApp } from '@/context/AppContext';
import { getAdsRepo } from '@/lib/repositories/adsRepo';
import { useSupabase } from '@/lib/supabaseClient';
import { Plus, Trash2, Edit, Package, Wrench, Eye, EyeOff } from 'lucide-react';
import { LIMITS, PLACEHOLDER_IMAGE } from '@/lib/constants';
import type { Ad } from '@/types';
import { AppButton } from '@/components/ui/app-button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';

export function SellerAdsList() {
  const { user } = useAuth();
  const { getAdsByUser, setAds, refreshAds } = useApp();
  const [adToDelete, setAdToDelete] = useState<Ad | null>(null);

  const myAds = user ? getAdsByUser(user.id) : [];
  const products = myAds.filter((a) => a.type === 'product');
  const services = myAds.filter((a) => a.type === 'service');
  const canAddProduct = products.length < LIMITS.MAX_PRODUCTS;
  const canAddService = services.length < LIMITS.MAX_SERVICES;

  const handleConfirmDelete = async () => {
    if (!adToDelete) return;
    if (useSupabase) {
      await getAdsRepo().delete(adToDelete.id);
      await refreshAds();
    } else {
      setAds((prev) => prev.filter((a) => a.id !== adToDelete.id));
    }
    setAdToDelete(null);
  };

  const setAdStatus = async (adId: string, status: 'published' | 'hidden') => {
    if (useSupabase) {
      await getAdsRepo().update(adId, { status });
      await refreshAds();
    } else {
      setAds((prev) =>
        prev.map((a) =>
          a.id === adId ? { ...a, status, updatedAt: new Date().toISOString() } : a
        )
      );
    }
  };

  if (!user) return null;

  const renderList = (list: Ad[], type: 'product' | 'service', canAdd: boolean) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2 text-base">
          {type === 'product' ? <Package className="h-4 w-4" /> : <Wrench className="h-4 w-4" />}
          {type === 'product' ? 'Produtos' : 'Serviços'} ({list.length}/{type === 'product' ? LIMITS.MAX_PRODUCTS : LIMITS.MAX_SERVICES})
        </CardTitle>
        {canAdd && (
          <AppButton variant="primary" size="sm" asChild className="gap-1">
            <Link to={`/vendedor/novo?tipo=${type}`}>
              <Plus className="h-4 w-4" />
              Novo
            </Link>
          </AppButton>
        )}
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {list.length === 0 ? (
            <li className="text-sm text-muted-foreground">Nenhum anúncio ainda.</li>
          ) : (
            list.map((ad) => (
              <li
                key={ad.id}
                className="flex items-center gap-3 rounded-lg border p-3"
              >
                <img
                  src={ad.images?.[0] || PLACEHOLDER_IMAGE}
                  alt=""
                  loading="lazy"
                  className="h-12 w-12 rounded-lg object-cover"
                />
                <div className="min-w-0 flex-1">
                  <Link
                    to={`/anuncio/${ad.id}`}
                    className="block truncate font-medium hover:underline"
                  >
                    {ad.title}
                  </Link>
                  <span className="text-sm text-muted-foreground">
                    {ad.status === 'published' ? 'Publicado' : ad.status === 'hidden' ? 'Oculto' : 'Rascunho'}
                  </span>
                </div>
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
                  <Link to={`/vendedor/editar/${ad.id}`}>
                    <Edit className="h-4 w-4" />
                  </Link>
                </AppButton>
                <AppButton
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="text-destructive hover:bg-destructive/10"
                  onClick={() => setAdToDelete(ad)}
                  title="Excluir"
                >
                  <Trash2 className="h-4 w-4" />
                </AppButton>
              </li>
            ))
          )}
        </ul>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <ConfirmDialog
        open={!!adToDelete}
        onOpenChange={(open) => !open && setAdToDelete(null)}
        title="Excluir anúncio"
        description="Tem certeza que deseja excluir este anúncio? Esta ação não pode ser desfeita."
        confirmLabel="Eliminar"
        cancelLabel="Cancelar"
        onConfirm={handleConfirmDelete}
        destructive
      />
      <p className="text-sm text-muted-foreground">
        Gerir os seus anúncios. Produtos e serviços são listados em separado.
      </p>
      <div className="grid gap-6 md:grid-cols-2">
        {renderList(products, 'product', canAddProduct)}
        {renderList(services, 'service', canAddService)}
      </div>
    </div>
  );
}
