'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers/AuthProvider';
import { useApp } from '@/context/AppContext';
import { useToast } from '@/context/ToastContext';
import { LIMITS, PLACEHOLDER_IMAGE, CIDADES_POR_PROVINCIA, PROVINCIAS_MOCAMBIQUE } from '@/lib/constants';
import { compressImage } from '@/lib/imageCompression';
import { getMessageForError, withTimeout } from '@/lib/errors';
import type { Ad, AdType } from '@/types';
import { AppButton } from '@/components/ui/app-button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, X, Loader2 } from 'lucide-react';

const MAX_IMAGES = LIMITS.MAX_AD_IMAGES;
const ACCEPT_IMAGES = 'image/jpeg,image/png,image/webp';
const USE_SUPABASE = process.env.NEXT_PUBLIC_USE_SUPABASE === 'true';

function dataUrlMime(dataUrl: string): string {
    const match = dataUrl.match(/^data:([a-z]+\/[a-z+.-]+);/i);
    return match?.[1]?.toLowerCase() ?? 'image/jpeg';
}

function mimeToExt(mime: string): string {
    const map: Record<string, string> = {
        'image/jpeg': 'jpg',
        'image/jpg': 'jpg',
        'image/png': 'png',
        'image/webp': 'webp',
        'image/gif': 'gif',
    };
    return map[mime] ?? 'jpg';
}

function getProvinceForCity(city: string): string {
    for (const [prov, cities] of Object.entries(CIDADES_POR_PROVINCIA)) {
        if (cities.includes(city)) return prov;
    }
    return '';
}

export type AdFormProps = {
    initialAd?: Ad | null;
    defaultType?: AdType;
};

const FETCH_TIMEOUT_MS = 12000;

export function AdForm({ initialAd, defaultType = 'product' }: AdFormProps) {
    const { user } = useAuth();
    const { setAds, refreshAds, categories, getAdsByUser } = useApp();
    const showToast = useToast().showToast;
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const isEdit = Boolean(initialAd);

    const [title, setTitle] = useState(initialAd?.title ?? '');
    const [description, setDescription] = useState(initialAd?.description ?? '');
    const [price, setPrice] = useState<string>(initialAd?.price != null ? String(initialAd.price) : '');
    const [priceOnRequest, setPriceOnRequest] = useState(initialAd?.priceOnRequest ?? false);
    const [province, setProvince] = useState(initialAd ? getProvinceForCity(initialAd.location) : '');
    const [location, setLocation] = useState(initialAd?.location ?? '');
    const [neighborhood, setNeighborhood] = useState(initialAd?.neighborhood ?? '');
    const [categoryId, setCategoryId] = useState(initialAd?.categoryId ?? '');
    const [whatsapp, setWhatsapp] = useState(initialAd?.whatsapp ?? '');
    const [type, setType] = useState<AdType>(initialAd?.type ?? defaultType);
    const [images, setImages] = useState<string[]>(initialAd?.images?.length ? [...initialAd.images] : []);
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const cities = province ? (CIDADES_POR_PROVINCIA[province] ?? []) : [];

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files?.length) return;
        setError('');
        const remaining = MAX_IMAGES - images.length;
        if (remaining <= 0) {
            setError(`Máximo de ${MAX_IMAGES} imagens.`);
            e.target.value = '';
            return;
        }
        const toAdd = Array.from(files).slice(0, remaining).filter((f) =>
            /^image\/(jpeg|png|webp)$/i.test(f.type)
        );
        try {
            const dataUrls = await Promise.all(toAdd.map(compressImage));
            setImages((prev) => [...prev, ...dataUrls].slice(0, MAX_IMAGES));
        } catch {
            setError('Erro ao processar as imagens.');
        }
        e.target.value = '';
    };

    const removeImage = (index: number) => {
        setImages((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!user) return;

        const products = getAdsByUser(user.id).filter((a) => a.type === 'product');
        const services = getAdsByUser(user.id).filter((a) => a.type === 'service');

        if (!isEdit) {
            if (type === 'product' && products.length >= LIMITS.MAX_PRODUCTS) {
                setError(`Limite de ${LIMITS.MAX_PRODUCTS} produtos atingido.`);
                return;
            }
            if (type === 'service' && services.length >= LIMITS.MAX_SERVICES) {
                setError(`Limite de ${LIMITS.MAX_SERVICES} serviços atingido.`);
                return;
            }
        }

        const priceNum = priceOnRequest || !price.trim() ? null : Number(price.replace(/\D/g, '')) || null;

        setSubmitting(true);
        setError('');
        showToast({ variant: 'info', description: 'A processar...' });
        try {
            if (isEdit && initialAd) {
                const imagesToSend = images.filter((img) => img.startsWith('data:'));
                const imagesToKeep = images.filter((img) => img.startsWith('http'));
                const allImages = [...imagesToKeep, ...imagesToSend].slice(0, MAX_IMAGES);
                if (allImages.length > MAX_IMAGES) {
                    setError(`Máximo de ${MAX_IMAGES} imagens.`);
                    setSubmitting(false);
                    return;
                }
                const payload = {
                    title: title.trim(),
                    description: description.trim(),
                    price: priceNum,
                    priceOnRequest,
                    province: province.trim(),
                    city: location.trim(),
                    neighborhood: neighborhood.trim() || undefined,
                    categoryId,
                    whatsapp: whatsapp.replace(/\D/g, ''),
                    type,
                    status: initialAd.status,
                    images: allImages,
                };
                const r = await withTimeout(
                    fetch(`/api/vendedor/anuncios/${initialAd.id}`, {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload),
                        cache: 'no-store',
                    }),
                    FETCH_TIMEOUT_MS,
                    'Guardar alterações'
                );
                const data = await r.json().catch(() => ({}));
                if (!r.ok) {
                    throw new Error(data.error ?? data.message ?? 'Erro ao atualizar');
                }
                if (USE_SUPABASE) await refreshAds();
                showToast({ variant: 'success', description: 'Anúncio atualizado com sucesso.' });
                setTimeout(() => router.push('/vendedor'), 800);
            } else {
                const imagesToSend = images.filter((img) => img.startsWith('data:'));
                const payload = {
                    title: title.trim(),
                    description: description.trim(),
                    price: priceNum,
                    priceOnRequest,
                    province: province.trim(),
                    city: location.trim(),
                    neighborhood: neighborhood.trim() || undefined,
                    categoryId,
                    whatsapp: whatsapp.replace(/\D/g, ''),
                    type,
                    images: imagesToSend,
                };
                const r = await withTimeout(
                    fetch('/api/vendedor/anuncios', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload),
                        cache: 'no-store',
                    }),
                    FETCH_TIMEOUT_MS,
                    'Publicar anúncio'
                );
                const data = await r.json().catch(() => ({}));
                if (!r.ok) {
                    throw new Error(data.message ?? 'Erro ao publicar anúncio');
                }
                if (USE_SUPABASE) await refreshAds();
                showToast({ variant: 'success', description: 'Anúncio publicado com sucesso.' });
                setTimeout(() => router.push('/vendedor'), 800);
            }
        } catch (err) {
            const msg = getMessageForError(err);
            setError(msg);
            showToast({ variant: 'error', description: msg });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Card className="mx-auto w-full max-w-2xl border-none bg-background p-0 shadow-none sm:border sm:bg-card sm:p-6 sm:shadow-sm">
            <CardHeader className="px-0 sm:px-6">
                <CardTitle>{isEdit ? 'Editar anúncio' : 'Novo anúncio'}</CardTitle>
            </CardHeader>
            <CardContent className="px-0 sm:px-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <p className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{error}</p>
                    )}

                    <div className="space-y-2">
                        <Label>Tipo de Anúncio</Label>
                        <select
                            value={type}
                            onChange={(e) => setType(e.target.value as AdType)}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                            <option value="product">Produto</option>
                            <option value="service">Serviço</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="ad-title">Título *</Label>
                        <Input
                            id="ad-title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            placeholder="Ex: IPhone 14 Pro Max 256GB"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="ad-desc">Descrição</Label>
                        <textarea
                            id="ad-desc"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={4}
                            className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                            placeholder="Descreva o que está a vender ou o serviço que presta..."
                        />
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="ad-price-request"
                                checked={priceOnRequest}
                                onChange={(e) => setPriceOnRequest(e.target.checked)}
                                className="h-4 w-4 rounded border-input text-primary focus:ring-primary"
                            />
                            <Label htmlFor="ad-price-request" className="cursor-pointer">Preço sob consulta</Label>
                        </div>
                        {!priceOnRequest && (
                            <div className="space-y-2">
                                <Label htmlFor="ad-price">Preço (MT)</Label>
                                <Input
                                    id="ad-price"
                                    type="text"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    placeholder="Ex: 55000"
                                />
                            </div>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="ad-category">Categoria *</Label>
                        <select
                            id="ad-category"
                            value={categoryId}
                            onChange={(e) => setCategoryId(e.target.value)}
                            required
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                            <option value="">Selecione uma categoria</option>
                            {categories.map((c) => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="ad-province">Província *</Label>
                            <select
                                id="ad-province"
                                value={province}
                                onChange={(e) => { setProvince(e.target.value); setLocation(''); }}
                                required
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                            >
                                <option value="">Selecione</option>
                                {PROVINCIAS_MOCAMBIQUE.map((p) => (
                                    <option key={p} value={p}>{p}</option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="ad-location">Cidade/Localidade *</Label>
                            <select
                                id="ad-location"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                required
                                disabled={!province}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-primary"
                            >
                                <option value="">Selecione</option>
                                {cities.map((c) => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="ad-neighborhood">Bairro/Zona (opcional)</Label>
                        <Input
                            id="ad-neighborhood"
                            value={neighborhood}
                            onChange={(e) => setNeighborhood(e.target.value)}
                            placeholder="Ex: Polana Caniço"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="ad-whatsapp">Número WhatsApp *</Label>
                        <Input
                            id="ad-whatsapp"
                            value={whatsapp}
                            onChange={(e) => setWhatsapp(e.target.value)}
                            required
                            placeholder="Ex: 84 123 4567"
                        />
                    </div>

                    <div className="space-y-4">
                        <Label>Fotos do Anúncio (até {MAX_IMAGES})</Label>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept={ACCEPT_IMAGES}
                            multiple
                            className="hidden"
                            onChange={handleFileSelect}
                        />
                        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
                            {images.map((src, i) => (
                                <div key={i} className="group relative aspect-square overflow-hidden rounded-lg border bg-muted">
                                    <img src={src} alt="" className="h-full w-full object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => removeImage(i)}
                                        className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-destructive text-white shadow-sm transition-transform hover:scale-110"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </div>
                            ))}
                            {images.length < MAX_IMAGES && (
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="flex aspect-square flex-col items-center justify-center rounded-lg border border-dashed border-muted-foreground/50 transition-colors hover:border-primary hover:bg-primary/5"
                                >
                                    <Upload className="mb-1 h-5 w-5 text-muted-foreground" />
                                    <span className="text-[10px] font-medium text-muted-foreground">Upload</span>
                                </button>
                            )}
                        </div>
                        <p className="text-[10px] text-muted-foreground">Ocupado: {images.length}/{MAX_IMAGES} fotos</p>
                    </div>

                    <div className="flex gap-4 pt-4">
                        <AppButton type="submit" disabled={submitting} className="flex-1 gap-2">
                            {submitting ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Guardando...
                                </>
                            ) : (
                                isEdit ? 'Guardar alterações' : 'Publicar anúncio'
                            )}
                        </AppButton>
                        <AppButton
                            type="button"
                            variant="outline"
                            onClick={() => router.back()}
                            disabled={submitting}
                        >
                            Cancelar
                        </AppButton>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
