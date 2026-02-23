'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useApp } from '@/context/AppContext';
import { useToast } from '@/context/ToastContext';
import { getBannersRepo } from '@/lib/repositories/getBannersRepo';
import type { Banner } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AppButton } from '@/components/ui/app-button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { ImagePlus, Trash2, ToggleLeft, ToggleRight, Upload, Loader2 } from 'lucide-react';
import { getMessageForError } from '@/lib/errors';
import { useStorageImage } from '@/hooks/useStorageImage';

const RESOLUTIONS = {
    desktop: '1920×480px (proporção ~4:1)',
    mobile: '800×600px ou 4:3',
};

const USE_SUPABASE = process.env.NEXT_PUBLIC_USE_SUPABASE === 'true';

function ResolvedBannerImage({ src, alt }: { src: string; alt: string }) {
    const { url } = useStorageImage('banner-images', src, { preferSigned: false });
    return (
        <img
            src={url || src}
            alt={alt}
            loading="lazy"
            className="h-32 w-full object-cover object-center"
        />
    );
}

export default function AdminBanners() {
    const { banners, setBanners, refreshBanners } = useApp();
    const { showToast } = useToast();
    const [allBanners, setAllBanners] = useState<Banner[]>([]);
    const [bannerTitle, setBannerTitle] = useState('');
    const [bannerFile, setBannerFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const loadAll = useCallback(async () => {
        if (!USE_SUPABASE) {
            setAllBanners([]);
            return;
        }
        try {
            const res = await fetch('/api/admin/banners', { credentials: 'include', cache: 'no-store' });
            if (!res.ok) {
                setAllBanners([]);
                return;
            }
            const data = await res.json();
            const list = Array.isArray(data.banners) ? data.banners : [];
            setAllBanners(list);
        } catch {
            setAllBanners([]);
        }
    }, []);

    useEffect(() => {
        if (USE_SUPABASE) {
            loadAll();
        }
    }, [loadAll]);

    useEffect(() => {
        return () => {
            if (previewUrl) URL.revokeObjectURL(previewUrl);
        };
    }, [previewUrl]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (!file.type.startsWith('image/')) {
            showToast({ variant: 'error', title: 'Ficheiro inválido', description: 'Selecione uma imagem (JPEG, PNG, WebP).' });
            return;
        }
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        setBannerFile(file);
        setPreviewUrl(URL.createObjectURL(file));
    };

    const resetForm = () => {
        setBannerTitle('');
        setBannerFile(null);
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const addBanner = async () => {
        if (!bannerFile && !previewUrl) return;

        if (USE_SUPABASE) {
            if (!bannerFile) {
                showToast({ variant: 'error', title: 'Sem ficheiro', description: 'Selecione uma imagem para o banner.' });
                return;
            }

            setSubmitting(true);
            try {
                // Use a nova API segura (server-side) em vez do repo.create (client-side)
                const formData = new FormData();
                formData.append('file', bannerFile);
                formData.append('title', bannerTitle.trim());
                formData.append('active', 'true');
                formData.append('order', allBanners.length.toString());

                const response = await fetch('/api/admin/banners', {
                    method: 'POST',
                    body: formData,
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    let errorMessage = 'Falha no servidor';
                    try {
                        const errorJson = JSON.parse(errorText);
                        errorMessage = errorJson.details || errorJson.error || errorMessage;
                    } catch {
                        errorMessage = `Erro ${response.status}: ${errorText || response.statusText}`;
                    }
                    throw new Error(errorMessage);
                }

                await refreshBanners();
                await loadAll();
                resetForm();

                showToast({
                    variant: 'success',
                    title: 'Banner publicado',
                    description: 'O banner foi enviado com sucesso via servidor.',
                });
            } catch (err: any) {
                console.error('[ADMIN/BANNERS] Add error:', err);
                showToast({
                    variant: 'error',
                    title: 'Erro ao publicar banner',
                    description: err.message || 'Erro desconhecido',
                });
            } finally {
                setSubmitting(false);
            }
            return;
        }

        if (bannerFile) {
            const dataUrl = await fileToDataUrl(bannerFile);
            const newBanner: Banner = {
                id: crypto.randomUUID(),
                imageUrl: dataUrl,
                title: bannerTitle.trim() || undefined,
                active: true,
                order: banners.length,
                createdAt: new Date().toISOString(),
            };
            setBanners((prev) => [...prev, newBanner]);
            resetForm();
        }
    };

    const toggleBannerActive = async (b: Banner) => {
        if (USE_SUPABASE) {
            setSubmitting(true);
            try {
                const formData = new FormData();
                formData.append('id', b.id);
                formData.append('active', (!b.active).toString());

                const response = await fetch('/api/admin/banners', {
                    method: 'PATCH',
                    body: formData,
                });

                if (!response.ok) throw new Error('Falha ao atualizar banner no servidor');

                await refreshBanners();
                await loadAll();
                showToast({
                    variant: 'success',
                    title: 'Banner atualizado',
                    description: 'O estado do banner foi atualizado com sucesso.',
                });
            } catch (err: any) {
                showToast({
                    variant: 'error',
                    title: 'Erro ao atualizar banner',
                    description: err.message || 'Erro desconhecido',
                });
            } finally {
                setSubmitting(false);
            }
        } else {
            setBanners((prev) => prev.map((x) => (x.id === b.id ? { ...x, active: !x.active } : x)));
        }
    };

    const [bannerToDelete, setBannerToDelete] = useState<Banner | null>(null);

    const handleConfirmDeleteBanner = async () => {
        if (!bannerToDelete) return;
        const id = bannerToDelete.id;
        if (USE_SUPABASE) {
            setSubmitting(true);
            try {
                const res = await fetch(`/api/admin/banners/${id}`, {
                    method: 'DELETE',
                    credentials: 'include',
                });
                const body = await res.json().catch(() => ({}));
                if (!res.ok) {
                    throw new Error(body?.error || res.statusText || 'Erro ao remover');
                }
                setAllBanners((prev) => prev.filter((b) => b.id !== id));
                await refreshBanners();
                await loadAll();
                showToast({
                    variant: 'success',
                    title: 'Banner removido',
                    description: 'O banner foi removido com sucesso.',
                });
            } catch (err) {
                showToast({
                    variant: 'error',
                    title: 'Erro ao remover banner',
                    description: err instanceof Error ? err.message : getMessageForError(err),
                });
            } finally {
                setSubmitting(false);
            }
        } else {
            setBanners((prev) => prev.filter((x) => x.id !== bannerToDelete.id));
        }
        setBannerToDelete(null);
    };

    const listToShow = USE_SUPABASE ? allBanners : banners;

    return (
        <div className="space-y-6">
            <ConfirmDialog
                open={!!bannerToDelete}
                onOpenChange={(open) => !open && setBannerToDelete(null)}
                title="Remover banner"
                description="Tem certeza que deseja remover este banner? Esta ação não pode ser desfeita."
                confirmLabel="Remover"
                cancelLabel="Cancelar"
                onConfirm={handleConfirmDeleteBanner}
                destructive
            />
            <div>
                <h2 className="text-lg font-semibold">Banners</h2>
                <p className="text-sm text-muted-foreground">
                    Upload de imagem para a página inicial. Desktop: imagem em destaque (crop). Mobile: imagem completa visível.
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                        <ImagePlus className="h-4 w-4" />
                        Novo banner
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-xs text-muted-foreground">
                        Recomendado: Desktop {RESOLUTIONS.desktop}, Mobile {RESOLUTIONS.mobile}. A imagem será ajustada automaticamente em cada dispositivo.
                    </p>
                    <div className="space-y-2">
                        <Label>Upload da imagem</Label>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            onChange={handleFileChange}
                            className="block w-full text-sm text-muted-foreground file:mr-4 file:rounded-md file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:font-medium file:text-primary-foreground file:hover:bg-primary/90"
                        />
                        {previewUrl && (
                            <div className="relative mt-2 h-24 w-full max-w-xs overflow-hidden rounded-lg border bg-muted">
                                <img
                                    src={previewUrl}
                                    alt="Pré-visualização"
                                    loading="lazy"
                                    className="h-full w-full object-cover object-center"
                                />
                            </div>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="banner-title">Título (opcional)</Label>
                        <Input
                            id="banner-title"
                            type="text"
                            value={bannerTitle}
                            onChange={(e) => setBannerTitle(e.target.value)}
                            placeholder="Título do banner"
                        />
                    </div>
                    <AppButton
                        variant="primary"
                        onClick={addBanner}
                        className="gap-2"
                        disabled={(!bannerFile && !previewUrl) || submitting}
                    >
                        {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                        Adicionar banner
                    </AppButton>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Banners atuais</CardTitle>
                </CardHeader>
                <CardContent>
                    {listToShow.length === 0 ? (
                        <p className="py-8 text-center text-muted-foreground">Nenhum banner.</p>
                    ) : (
                        <ul className="space-y-4">
                            {listToShow.map((b) => (
                                <li key={b.id} className="overflow-hidden rounded-lg border">
                                    <ResolvedBannerImage src={b.imageUrl} alt={b.title || 'Banner'} />
                                    <div className="flex items-center justify-between p-3">
                                        <span className="text-sm text-muted-foreground">
                                            {b.title || 'Sem título'}
                                        </span>
                                        <div className="flex gap-2">
                                            <AppButton
                                                size="sm"
                                                variant={b.active ? 'primary' : 'secondary'}
                                                onClick={() => toggleBannerActive(b)}
                                                className="gap-1"
                                                disabled={submitting}
                                            >
                                                {b.active ? (
                                                    <ToggleRight className="h-4 w-4" />
                                                ) : (
                                                    <ToggleLeft className="h-4 w-4" />
                                                )}
                                                {b.active ? 'Ativo' : 'Inativo'}
                                            </AppButton>
                                            <AppButton
                                                size="sm"
                                                variant="destructive"
                                                onClick={() => setBannerToDelete(b)}
                                                className="gap-1"
                                                disabled={submitting}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                                Remover
                                            </AppButton>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

function fileToDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => reject(new Error('Falha ao ler o ficheiro de imagem.'));
        reader.readAsDataURL(file);
    });
}
