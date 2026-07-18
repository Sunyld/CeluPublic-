import Link from 'next/link';
import { Heart, MessageCircle } from 'lucide-react';
import { AppButton } from '@/components/ui/app-button';
import { cn } from '@/lib/utils';

export interface MarketplaceAdCardProps {
  title: string;
  price: string;
  image: string;
  imageAlt?: string;
  badges: React.ReactNode;
  location: string;
  likedCount: number;
  isLiked: boolean;
  onLike: (e: React.MouseEvent) => void;
  href: string;
  description?: string;
  whatsappHref?: string;
  categoryLabel?: string;
  /** Called when WhatsApp CTA is clicked (before navigation). Use for conversion tracking. */
  onWhatsAppClick?: () => void;
}

const hasValidWhatsApp = (href?: string) => href && href !== '#';

/**
 * Card minimalista: imagem, título, preço, CTA WhatsApp (ou indisponível) e link para detalhe.
 */
export function MarketplaceAdCard({
  title,
  price,
  image,
  imageAlt = title,
  likedCount,
  isLiked,
  onLike,
  href,
  whatsappHref,
  onWhatsAppClick,
}: MarketplaceAdCardProps) {
  const canContact = hasValidWhatsApp(whatsappHref);

  return (
    <div className="group flex min-w-0 flex-col">
      <div className="relative aspect-square w-full min-w-0 overflow-hidden bg-muted">
        <Link href={href} className="block h-full w-full rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
          <img
            src={image}
            alt={imageAlt}
            loading="lazy"
            className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
          />
        </Link>
        <AppButton
          type="button"
          variant="ghost"
          size="icon"
          onClick={onLike}
          className="absolute right-2 top-2 h-8 w-8 rounded-full bg-background/80 opacity-0 transition-opacity group-hover:opacity-100 focus:opacity-100"
          aria-label={isLiked ? 'Remover like' : 'Gostar'}
        >
          <Heart
            className={cn('h-4 w-4', isLiked && 'fill-destructive text-destructive')}
            aria-hidden
          />
        </AppButton>
      </div>
      <div className="mt-4 flex min-w-0 flex-col items-center text-center">
        <Link
          href={href}
          className="line-clamp-2 min-w-0 break-words text-sm font-medium text-foreground hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded"
        >
          {title}
        </Link>
        <span className="mt-1 text-sm text-muted-foreground">{price}</span>

        <div className="mt-2 flex flex-col gap-1">
          {canContact ? (
            <AppButton variant="outline" size="sm" className="gap-1.5" asChild>
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => onWhatsAppClick?.()}
              >
                <MessageCircle className="h-3.5 w-3.5" />
                WhatsApp
              </a>
            </AppButton>
          ) : (
            <span className="text-xs text-muted-foreground">Indisponível</span>
          )}
          <Link
            href={href}
            className="rounded text-xs font-medium text-primary hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            Ver detalhes
          </Link>
        </div>
      </div>
    </div>
  );
}
