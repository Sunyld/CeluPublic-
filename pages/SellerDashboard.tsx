import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { getAdsRepo } from '@/lib/repositories/adsRepo';
import { useSupabase } from '@/lib/supabaseClient';
import { Plus, Trash2, Edit, Package, Briefcase } from 'lucide-react';
import { LIMITS } from '@/lib/constants';
import { PLACEHOLDER_IMAGE } from '@/lib/constants';
import type { Ad } from '@/types';
import { AppButton } from '@/components/ui/app-button';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';

export function SellerDashboard() {
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

  if (!user) return null;

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
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
      <h1 className="text-2xl font-bold text-foreground">Meu painel</h1>
      <p className="mt-1 text-muted-foreground">Olá, {user.name}. Gerencie os seus anúncios.</p>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 font-semibold text-foreground">
              <Package size={22} />
              Produtos ({products.length}/{LIMITS.MAX_PRODUCTS})
            </h2>
            {canAddProduct && (
              <AppButton variant="primary" size="sm" asChild className="gap-1">
                <Link to="/vendedor/novo?tipo=product">
                  <Plus size={18} />
                  Novo
                </Link>
              </AppButton>
            )}
          </div>
          <ul className="mt-4 space-y-3">
            {products.length === 0 ? (
              <li className="text-sm text-muted-foreground">Nenhum produto ainda.</li>
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
                    <Link to={`/anuncio/${ad.id}`} className="block truncate font-medium text-foreground hover:underline">
                      {ad.title}
                    </Link>
                    <span className="text-sm text-muted-foreground">{ad.status === 'published' ? 'Publicado' : ad.status === 'hidden' ? 'Oculto' : 'Rascunho'}</span>
                  </div>
                  <Link to={`/vendedor/editar/${ad.id}`} className="rounded p-2 text-muted-foreground hover:bg-muted" title="Editar">
                    <Edit size={18} />
                  </Link>
                  <AppButton type="button" variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10" onClick={() => setAdToDelete(ad)} title="Excluir">
                    <Trash2 size={18} />
                  </AppButton>
                </li>
              ))
            )}
          </ul>
        </div>
        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 font-semibold text-foreground">
              <Briefcase size={22} />
              Serviços ({services.length}/{LIMITS.MAX_SERVICES})
            </h2>
            {canAddService && (
              <AppButton variant="primary" size="sm" asChild className="gap-1">
                <Link to="/vendedor/novo?tipo=service">
                  <Plus size={18} />
                  Novo
                </Link>
              </AppButton>
            )}
          </div>
          <ul className="mt-4 space-y-3">
            {services.length === 0 ? (
              <li className="text-sm text-muted-foreground">Nenhum serviço ainda.</li>
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
                    <Link to={`/anuncio/${ad.id}`} className="block truncate font-medium text-foreground hover:underline">
                      {ad.title}
                    </Link>
                    <span className="text-sm text-muted-foreground">{ad.status === 'published' ? 'Publicado' : ad.status === 'hidden' ? 'Oculto' : 'Rascunho'}</span>
                  </div>
                  <Link to={`/vendedor/editar/${ad.id}`} className="rounded p-2 text-muted-foreground hover:bg-muted" title="Editar">
                    <Edit size={18} />
                  </Link>
                  <AppButton type="button" variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10" onClick={() => setAdToDelete(ad)} title="Excluir">
                    <Trash2 size={18} />
                  </AppButton>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
