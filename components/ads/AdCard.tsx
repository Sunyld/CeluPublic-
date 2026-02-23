import { useRef, useState } from 'react';
import { Package, Wrench } from 'lucide-react';
import type { Ad } from '@/types';
import { useApp } from '@/context/AppContext';
import { useAuthOptional } from '@/components/providers/AuthProvider';
import { PLACEHOLDER_IMAGE } from '@/lib/constants';
import { buildWhatsAppUrl } from '@/lib/whatsapp';
import { getClicksRepo } from '@/lib/repositories/getClicksRepo';
import { getLikesRepo } from '@/lib/repositories/getLikesRepo';
import { invalidateLikeCountsCache } from '@/lib/cachedData';
import { LoginToLikeDialog } from '@/components/shared/LoginToLikeDialog';
import { trackEvent } from '@/lib/analytics';
import { Badge } from '@/components/ui/badge';
import { MarketplaceAdCard } from '@/components/marketplace/ad-card';
import { useStorageImage } from '@/hooks/useStorageImage';

const WHATSAPP_CLICK_THROTTLE_MS = 1000;

interface AdCardProps {
  ad: Ad;
  showLike?: boolean;
}

/**
 * Ad card for the marketplace: uses the reusable MarketplaceAdCard (card-12 style).
 */
export function AdCard({ ad, showLike: _showLike = true }: AdCardProps) {
  const { getCategoryById, likedIds, toggleLike } = useApp();
  const auth = useAuthOptional();
  const user = auth?.user ?? null;
  const lastWhatsAppClickAt = useRef(0);
  const category = getCategoryById(ad.categoryId);
  const imageUrl = ad.images?.[0] || PLACEHOLDER_IMAGE;
  const { url: resolvedImageUrl } = useStorageImage('ad-images', imageUrl);
  const isLiked = !!likedIds[ad.id];
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);

  const handleWhatsAppClick = () => {
    const now = Date.now();
    if (now - lastWhatsAppClickAt.current < WHATSAPP_CLICK_THROTTLE_MS) return;
    lastWhatsAppClickAt.current = now;
    getClicksRepo().trackWhatsAppClick(ad.id, user?.id);
    trackEvent('whatsapp_click', { adId: ad.id });
  };

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      setLoginDialogOpen(true);
      return;
    }
    const optimisticNext = !isLiked;
    toggleLike(ad.id);
    getLikesRepo()
      .toggleLike(ad.id, user.id)
      .then((liked) => {
        if (liked !== optimisticNext) {
          toggleLike(ad.id);
        }
        invalidateLikeCountsCache();
      })
      .catch(() => {
        toggleLike(ad.id);
      });
  };

  const whatsappUrl = ad.whatsapp?.trim() ? buildWhatsAppUrl(ad, category?.name) : undefined;
  const price =
    ad.priceOnRequest || ad.price == null ? 'Sob consulta' : `${ad.price} MT`;

  const badges = (
    <>
      <Badge variant="outline" className="rounded-sm gap-1">
        {ad.type === 'product' ? <Package className="h-3 w-3" /> : <Wrench className="h-3 w-3" />}
        {ad.type === 'product' ? 'Produto' : 'Serviço'}
      </Badge>
      {category && (
        <Badge variant="secondary" className="rounded-sm">
          {category.name}
        </Badge>
      )}
    </>
  );

  return (
    <>
      <MarketplaceAdCard
        title={ad.title}
        price={price}
        image={resolvedImageUrl || imageUrl}
        imageAlt={ad.title}
        badges={badges}
        location={ad.location}
        likedCount={ad.likes}
        isLiked={isLiked}
        onLike={handleLike}
        href={`/anuncio/${ad.id}`}
        description={ad.description}
        whatsappHref={whatsappUrl}
        categoryLabel={category?.name}
        onWhatsAppClick={handleWhatsAppClick}
      />
      <LoginToLikeDialog
        open={loginDialogOpen}
        onOpenChange={setLoginDialogOpen}
        onLogin={() => {
          window.location.href = '/entrar';
        }}
      />
    </>
  );
}
