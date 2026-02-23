import { useState, useRef, useEffect, useCallback } from 'react';
import { useApp } from '@/context/AppContext';
import { useToast } from '@/context/ToastContext';
import { getBannersRepo } from '@/lib/repositories/getBannersRepo';
import { useSupabase } from '@/lib/supabaseClient';
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

export function AdminBanners() {
  const { banners, setBanners, refreshBanners } = useApp();
  const { showToast } = useToast();
  const [allBanners, setAllBanners] = useState<Banner[]>([]);
  const [bannerTitle, setBannerTitle] = useState('');
  // Store the File directly — avoid unnecessary FileReader dataUrl conversion
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadAll = useCallback(async () => {
    const list = await getBannersRepo().listAll();
    setAllBanners(list);
  }, []);

  useEffect(() => {
    if (useSupabase) {
      loadAll();
    }
  }, [loadAll]);

  // Cleanup objectUrl on unmount
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
    // Revoke previous preview
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

  /**
   * addBanner — fluxo unificado para Supabase e local.
   *
   * Supabase: passa File directamente como Blob ao repo.
   * Local: converte para dataUrl para compatibilidade com armazenamento local.
   */
  const addBanner = async () => {
    if (!bannerFile && !previewUrl) return;

    if (useSupabase) {
      if (!bannerFile) {
        showToast({ variant: 'error', title: 'Sem ficheiro', description: 'Selecione uma imagem para o banner.' });
        return;
      }

      setSubmitting(true);
      try {
        // Converter File → dataUrl (o bannersRepo.create aceita data: URLs e faz upload do blob)
        const dataUrl = await fileToDataUrl(bannerFile);
        const repo = getBannersRepo();

        if (import.meta.env.DEV) {
          // eslint-disable-next-line no-console
          console.log('[BANNER] Iniciando upload:', {
            name: bannerFile.name,
            size: bannerFile.size,
            type: bannerFile.type,
          });
        }

        await repo.create({
          imageUrl: dataUrl,
          title: bannerTitle.trim() || undefined,
          active: true,
          order: allBanners.length,
        });

        await refreshBanners();
        await loadAll();
        resetForm();

        showToast({
          variant: 'success',
          title: 'Banner publicado',
          description: 'O banner foi enviado com sucesso.',
        });
      } catch (err: any) {
        if (import.meta.env.DEV) {
          // eslint-disable-next-line no-console
          console.error('[BANNER] Erro ao publicar:', {
            message: err?.message,
            code: err?.code,
            cause: err?.cause,
          });
        }
        showToast({
          variant: 'error',
          title: 'Erro ao publicar banner',
          description: getMessageForError(err),
          actionLabel: 'Tentar novamente',
          onAction: () => void addBanner(),
        });
      } finally {
        setSubmitting(false);
      }
      return;
    }

    // Modo local: usar dataUrl para persistência
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
    } else if (previewUrl) {
      // previewUrl já é dataUrl (modo local fallback)
      const newBanner: Banner = {
        id: crypto.randomUUID(),
        imageUrl: previewUrl,
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
    if (useSupabase) {
      setSubmitting(true);
      try {
        await getBannersRepo().update(b.id, { active: !b.active });
        await refreshBanners();
        await loadAll();
        showToast({
          variant: 'success',
          title: 'Banner atualizado',
          description: 'O estado do banner foi atualizado com sucesso.',
        });
      } catch (err) {
        showToast({
          variant: 'error',
          title: 'Erro ao atualizar banner',
          description: getMessageForError(err),
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
    if (useSupabase) {
      setSubmitting(true);
      try {
        await getBannersRepo().delete(bannerToDelete.id);
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
          description: getMessageForError(err),
        });
      } finally {
        setSubmitting(false);
      }
    } else {
      setBanners((prev) => prev.filter((x) => x.id !== bannerToDelete.id));
    }
    setBannerToDelete(null);
  };

  const listToShow = useSupabase ? allBanners : banners;

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
            {bannerFile && (
              <p className="text-xs text-muted-foreground">
                {bannerFile.name} ({Math.round(bannerFile.size / 1024)}KB, {bannerFile.type})
              </p>
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

/**
 * Converte um File para dataUrl via Promise.
 * O bannersRepo aceita data: URLs e converte para Blob internamente.
 */
function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Falha ao ler o ficheiro de imagem.'));
    reader.readAsDataURL(file);
  });
}
