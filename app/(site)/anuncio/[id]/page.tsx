'use client';

import { useState, useRef, useEffect, use } from 'react';
import Link from 'next/link';
import {
    Heart,
    MapPin,
    MessageCircle,
    ChevronRight,
    ArrowLeft,
    Package,
    Wrench,
    Share2,
    Flag,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { getRelatedPublicAds, isAdOwnerApproved } from '@/lib/selectors/adsSelectors';
import { PLACEHOLDER_IMAGE } from '@/lib/constants';
import { getAdminWhatsapp } from '@/lib/settingsHelpers';
import { buildWhatsAppUrl } from '@/lib/whatsapp';
import { trackEvent } from '@/lib/analytics';
import { AdCard } from '@/components/ads/AdCard';
import { AppButton } from '@/components/ui/app-button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { useAuthOptional } from '@/components/providers/AuthProvider';
import { getLikesRepo } from '@/lib/repositories/getLikesRepo';
import { getClicksRepo } from '@/lib/repositories/getClicksRepo';
import { invalidateLikeCountsCache } from '@/lib/cachedData';
import { LoginToLikeDialog } from '@/components/shared/LoginToLikeDialog';
import { useStorageImage } from '@/hooks/useStorageImage';
import type { Ad } from '@/types';

export default function AdDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const { getAdById, getCategoryById, toggleLike, likedIds, ads, users, publicSettings } = useApp();
    const auth = useAuthOptional();
    const user = auth?.user ?? null;
    const [fetchedAd, setFetchedAd] = useState<Ad | null | undefined>(undefined);
    const [galleryIndex, setGalleryIndex] = useState(0);
    const [reportOpen, setReportOpen] = useState(false);
    const [loginDialogOpen, setLoginDialogOpen] = useState(false);
    const lastWhatsAppClickAt = useRef(0);
    const WHATSAPP_CLICK_THROTTLE_MS = 1000;

    const adFromContext = getAdById(id);
    useEffect(() => {
        if (adFromContext) {
            setFetchedAd(undefined);
            return;
        }
        let cancelled = false;
        fetch(`/api/ads/${id}/public`, { cache: 'no-store' })
            .then((r) => {
                if (cancelled) return;
                if (!r.ok) {
                    setFetchedAd(null);
                    return;
                }
                return r.json();
            })
            .then((data) => {
                if (cancelled || !data?.ad) {
                    if (!cancelled) setFetchedAd(null);
                    return;
                }
                setFetchedAd(data.ad as Ad);
            })
            .catch(() => {
                if (!cancelled) setFetchedAd(null);
            });
        return () => { cancelled = true; };
    }, [id, adFromContext]);

    const ad = adFromContext ?? (fetchedAd !== undefined ? fetchedAd : null);
    const ownerApproved = ad ? (users?.length ? isAdOwnerApproved(ad, users) : true) : false;
    const category = ad ? getCategoryById(ad.categoryId) : undefined;
    const related = ad && ownerApproved ? getRelatedPublicAds(ad, ads, users, 4) : [];
    const isLiked = ad ? !!likedIds[ad.id] : false;
    const images = ad?.images?.length ? ad.images : [PLACEHOLDER_IMAGE];
    const currentImage = images[galleryIndex];
    const { url: resolvedCurrentImage } = useStorageImage('ad-images', currentImage);
    const hasWhatsApp = !!ad?.whatsapp?.trim();
    const whatsappUrl = ad && hasWhatsApp ? buildWhatsAppUrl(ad, category?.name) : '#';
    const priceStr =
        ad?.priceOnRequest || ad?.price == null ? 'Sob consulta' : `${ad.price} MT`;

    useEffect(() => {
        if (!ad || !ownerApproved || ad.status !== 'published') return;
        trackEvent('ad_view', { adId: ad.id });
    }, [ad, ownerApproved]);

    const handleWhatsAppClick = () => {
        if (!ad) return;
        const now = Date.now();
        if (now - lastWhatsAppClickAt.current < WHATSAPP_CLICK_THROTTLE_MS) return;
        lastWhatsAppClickAt.current = now;
        getClicksRepo().trackWhatsAppClick(ad.id, user?.id);
        trackEvent('whatsapp_click', { adId: ad.id });
    };

    const handleShare = () => {
        if (typeof navigator !== 'undefined' && navigator.share) {
            navigator.share({
                title: ad?.title,
                url: window.location.href,
                text: ad?.title,
            }).catch(() => { });
        } else {
            navigator.clipboard?.writeText(window.location.href);
        }
    };

    const breadcrumbs = [
        { label: 'Início', href: '/' },
        { label: 'Anúncios', href: '/anuncios' },
        { label: ad?.title ?? 'Anúncio', href: '#' },
    ];

    if (fetchedAd === undefined && !adFromContext) {
        return (
            <div className="mx-auto max-w-7xl px-4 py-12 text-center">
                <p className="text-muted-foreground">A carregar...</p>
            </div>
        );
    }

    if (!ad || !ownerApproved || ad.status !== 'published') {
        return (
            <div className="mx-auto max-w-7xl px-4 py-12 text-center">
                <h1 className="text-2xl font-bold">Anúncio não encontrado</h1>
                <p className="mt-2 text-muted-foreground">
                    Este anúncio não existe ou não está disponível.
                </p>
                <AppButton variant="link" asChild className="mt-4 gap-1">
                    <Link href="/anuncios">
                        <ArrowLeft className="h-4 w-4" /> Voltar aos anúncios
                    </Link>
                </AppButton>
            </div>
        );
    }

    const adminWhatsAppUrl = `https://wa.me/${getAdminWhatsapp(publicSettings)}?text=${encodeURIComponent(`Olá, quero reportar o anúncio: ${ad?.title ?? ''} (${typeof window !== 'undefined' ? window.location.href : ''})`)}`;

    return (
        <div className="mx-auto w-full min-w-0 max-w-7xl bg-background p-4 text-foreground md:p-8">
            <Dialog open={reportOpen} onOpenChange={setReportOpen}>
                <DialogContent className="max-w-[calc(100vw-2rem)] sm:max-w-[400px]">
                    <DialogHeader>
                        <DialogTitle>Reportar anúncio</DialogTitle>
                        <DialogDescription>
                            Se este anúncio for suspeito ou violar as regras, entre em contacto com o administrador.
                        </DialogDescription>
                    </DialogHeader>
                    <AppButton asChild className="gap-2 mt-2">
                        <a href={adminWhatsAppUrl} target="_blank" rel="noopener noreferrer" onClick={() => setReportOpen(false)}>
                            <MessageCircle className="h-4 w-4" />
                            Falar com o Admin no WhatsApp
                        </a>
                    </AppButton>
                </DialogContent>
            </Dialog>

            <nav
                aria-label="Breadcrumb"
                className="mb-4 flex min-w-0 flex-wrap items-center gap-x-1 text-sm text-muted-foreground"
            >
                {breadcrumbs.map((item, index) => (
                    <span key={index} className="flex min-w-0 items-center">
                        {index < breadcrumbs.length - 1 ? (
                            <Link href={item.href} className="hover:text-primary transition-colors">
                                {item.label}
                            </Link>
                        ) : (
                            <span className="break-words text-foreground">{item.label}</span>
                        )}
                        {index < breadcrumbs.length - 1 && (
                            <ChevronRight className="mx-1 h-4 w-4" />
                        )}
                    </span>
                ))}
            </nav>

            <div className="mb-6 flex items-center justify-between">
                <AppButton variant="ghost" size="sm" asChild className="gap-1 text-muted-foreground">
                    <Link href="/anuncios">
                        <ArrowLeft className="h-4 w-4" /> Voltar
                    </Link>
                </AppButton>
                <div className="flex flex-wrap items-center gap-2">
                    <AppButton
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => {
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
                        }}
                        aria-label={isLiked ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
                    >
                        <Heart
                            className={cn('h-5 w-5', isLiked && 'fill-destructive text-destructive')}
                        />
                    </AppButton>
                    <AppButton
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={handleShare}
                        aria-label="Partilhar"
                    >
                        <Share2 className="h-5 w-5" />
                    </AppButton>
                    <AppButton
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="gap-1.5 text-muted-foreground"
                        onClick={() => setReportOpen(true)}
                        aria-label="Reportar anúncio"
                    >
                        <Flag className="h-4 w-4" />
                        Reportar
                    </AppButton>
                </div>
            </div>

            <main className="grid min-w-0 grid-cols-1 gap-8 md:gap-12 lg:grid-cols-2">
                <div className="flex min-w-0 flex-col gap-4">
                    <div className="relative aspect-[4/5] w-full min-w-0 overflow-hidden rounded-xl border bg-muted">
                        <img
                            src={resolvedCurrentImage || currentImage}
                            alt={ad.title}
                            className="h-full w-full object-cover object-center transition-opacity duration-300"
                        />
                    </div>
                    {images.length > 1 && (
                        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Galeria de imagens">
                            {images.map((src, index) => (
                                <AppButton
                                    key={index}
                                    type="button"
                                    variant={galleryIndex === index ? 'default' : 'outline'}
                                    size="icon"
                                    onClick={() => setGalleryIndex(index)}
                                    className={cn(
                                        'h-14 w-14 shrink-0 overflow-hidden rounded-lg p-0',
                                        galleryIndex === index && 'ring-2 ring-primary ring-offset-2'
                                    )}
                                    aria-label={`Ver imagem ${index + 1}`}
                                    aria-selected={galleryIndex === index}
                                >
                                    <img
                                        src={src}
                                        alt=""
                                        loading="lazy"
                                        className="h-full w-full object-cover"
                                    />
                                </AppButton>
                            ))}
                        </div>
                    )}
                </div>

                <div className="flex min-w-0 flex-col">
                    <h1 id="ad-title" className="break-words text-2xl font-bold tracking-tight md:text-3xl lg:text-4xl">{ad.title}</h1>
                    <div className="mt-2">
                        <span className="text-4xl font-bold text-primary">{priceStr}</span>
                    </div>

                    <div className="my-6 flex flex-wrap gap-2">
                        {hasWhatsApp ? (
                            <AppButton variant="primary" size="lg" className="flex-1 gap-2 min-w-0" asChild>
                                <a
                                    href={whatsappUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={handleWhatsAppClick}
                                >
                                    <MessageCircle className="h-5 w-5 shrink-0" />
                                    Contactar via WhatsApp
                                </a>
                            </AppButton>
                        ) : (
                            <AppButton variant="secondary" size="lg" className="flex-1 gap-2 min-w-0" disabled>
                                <MessageCircle className="h-5 w-5 shrink-0" />
                                Contactar indisponível
                            </AppButton>
                        )}
                        <AppButton
                            type="button"
                            variant="outline"
                            size="lg"
                            className="flex-1 gap-2"
                            onClick={() => {
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
                            }}
                        >
                            <Heart
                                className={cn('h-5 w-5', isLiked && 'fill-destructive text-destructive')}
                            />
                            {isLiked ? 'Curtido' : 'Gostar'}
                        </AppButton>
                    </div>

                    <div className="mb-6 flex flex-wrap gap-2">
                        <Badge variant="secondary" className="gap-1 py-1 px-3 text-sm font-normal">
                            {ad.type === 'product' ? (
                                <Package className="h-4 w-4" />
                            ) : (
                                <Wrench className="h-4 w-4" />
                            )}
                            {ad.type === 'product' ? 'Produto' : 'Serviço'}
                        </Badge>
                        {category && (
                            <Badge variant="secondary" className="py-1 px-3 text-sm font-normal">
                                {category.name}
                            </Badge>
                        )}
                        <Badge variant="outline" className="gap-1 py-1 px-3 text-sm font-normal">
                            <MapPin className="h-4 w-4" />
                            {[ad.location, ad.neighborhood].filter(Boolean).join(', ')}
                        </Badge>
                    </div>

                    <p className="leading-relaxed text-muted-foreground whitespace-pre-wrap">
                        {ad.description}
                    </p>

                    {ad.userId && (
                        <div className="mt-8 border-t pt-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <Avatar className="h-12 w-12">
                                        <AvatarImage src="" alt={ad.userName} />
                                        <AvatarFallback>{(ad.userName || 'U').charAt(0).toUpperCase()}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-semibold">{ad.userName || 'Vendedor'}</p>
                                        <p className="text-sm text-muted-foreground">Vendedor Verificado</p>
                                    </div>
                                </div>
                                <AppButton variant="link" className="text-primary" asChild>
                                    <Link href="/anuncios">Ver mais anúncios →</Link>
                                </AppButton>
                            </div>
                        </div>
                    )}
                </div>
            </main>

            <LoginToLikeDialog
                open={loginDialogOpen}
                onOpenChange={setLoginDialogOpen}
                onLogin={() => {
                    window.location.href = '/entrar';
                }}
            />

            {related.length > 0 && (
                <section className="mt-16">
                    <h2 className="mb-6 text-lg font-semibold text-foreground">Anúncios relacionados</h2>
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {related.map((r) => (
                            <AdCard key={r.id} ad={r} />
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}
