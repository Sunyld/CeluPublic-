import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useApp } from '@/context/AppContext';
import { LIMITS, PLACEHOLDER_IMAGE, CIDADES_POR_PROVINCIA, PROVINCIAS_MOCAMBIQUE } from '@/lib/constants';
import { compressImage, dataUrlToBlob } from '@/lib/imageCompression';
import { getAdsRepo } from '@/lib/repositories/adsRepo';
import { insertAdImages, deleteAllAdImages } from '@/lib/repositories/supabase/adsRepo.supabase';
import { getSupabase, useSupabase } from '@/lib/supabaseClient';
import { storage } from '@/lib/storage';
import { getMessageForError } from '@/lib/errors';
import { normalizeStoragePath } from '@/lib/storageHelpers';
import type { AdType } from '@/types';
import { AppButton } from '@/components/ui/app-button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, X, Loader2 } from 'lucide-react';

const MAX_IMAGES = LIMITS.MAX_AD_IMAGES;
const ACCEPT_IMAGES = 'image/jpeg,image/png,image/webp';

/** Extrai o mime type de um data URL. Ex: 'data:image/png;base64,...' → 'image/png'. */
function dataUrlMime(dataUrl: string): string {
  const match = dataUrl.match(/^data:([a-z]+\/[a-z+.-]+);/i);
  return match?.[1]?.toLowerCase() ?? 'image/jpeg';
}

/** Mapeia mime type para extensão. */
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

export function AdForm() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const tipo = (searchParams.get('tipo') as AdType) || 'product';
  const { user } = useAuth();
  const { getAdById, setAds, refreshAds, categories, getAdsByUser } = useApp();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isEdit = Boolean(id);
  const ad = id ? getAdById(id) : null;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<string>('');
  const [priceOnRequest, setPriceOnRequest] = useState(false);
  const [province, setProvince] = useState('');
  const [location, setLocation] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [type, setType] = useState<AdType>(tipo);
  const [images, setImages] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const cities = province ? (CIDADES_POR_PROVINCIA[province] ?? []) : [];

  useEffect(() => {
    if (ad && user && ad.userId === user.id) {
      setTitle(ad.title);
      setDescription(ad.description);
      setPrice(ad.price != null ? String(ad.price) : '');
      setPriceOnRequest(ad.priceOnRequest);
      setProvince(getProvinceForCity(ad.location));
      setLocation(ad.location);
      setNeighborhood(ad.neighborhood ?? '');
      setCategoryId(ad.categoryId);
      setWhatsapp(ad.whatsapp);
      setType(ad.type);
      setImages(ad.images?.length ? [...ad.images] : []);
    }
  }, [ad, user]);

  useEffect(() => {
    if (!isEdit) setType(tipo);
  }, [tipo, isEdit]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;
    setError('');
    const remaining = MAX_IMAGES - images.length;
    if (remaining <= 0) {
      setError(`Máximo de ${MAX_IMAGES} imagens. Remova uma para adicionar outra.`);
      e.target.value = '';
      return;
    }
    const toAdd = Array.from(files).slice(0, remaining).filter((f) =>
      /^image\/(jpeg|png|webp)$/i.test(f.type)
    );
    if (toAdd.length === 0) {
      setError('Selecione apenas ficheiros de imagem (JPEG, PNG ou WebP).');
      e.target.value = '';
      return;
    }
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
    setSuccessMessage('');
    if (!user) return;
    if (!title.trim()) {
      setError('Título é obrigatório.');
      return;
    }
    if (!categoryId) {
      setError('Selecione uma categoria.');
      return;
    }
    if (!province || !location.trim()) {
      setError('Selecione a província e a cidade.');
      return;
    }
    if (!whatsapp.trim()) {
      setError('WhatsApp é obrigatório.');
      return;
    }
    const products = getAdsByUser(user.id).filter((a) => a.type === 'product');
    const services = getAdsByUser(user.id).filter((a) => a.type === 'service');
    if (!isEdit) {
      if (type === 'product' && products.length >= LIMITS.MAX_PRODUCTS) {
        setError(`Atingiu o limite de ${LIMITS.MAX_PRODUCTS} produtos. Remova um anúncio antigo ou contacte o administrador para upgrade.`);
        return;
      }
      if (type === 'service' && services.length >= LIMITS.MAX_SERVICES) {
        setError(`Atingiu o limite de ${LIMITS.MAX_SERVICES} serviços. Remova um anúncio antigo ou contacte o administrador para upgrade.`);
        return;
      }
    } else {
      if (type === 'product' && ad?.type !== 'product' && products.length >= LIMITS.MAX_PRODUCTS) {
        setError(`Atingiu o limite de ${LIMITS.MAX_PRODUCTS} produtos. Remova um anúncio antigo ou contacte o administrador para upgrade.`);
        return;
      }
      if (type === 'service' && ad?.type !== 'service' && services.length >= LIMITS.MAX_SERVICES) {
        setError(`Atingiu o limite de ${LIMITS.MAX_SERVICES} serviços. Remova um anúncio antigo ou contacte o administrador para upgrade.`);
        return;
      }
    }

    const priceNum = priceOnRequest || !price.trim() ? null : Number(price.replace(/\D/g, '')) || null;
    const finalImages = images.length ? images : [PLACEHOLDER_IMAGE];
    const repo = getAdsRepo();

    setSubmitting(true);
    setError('');
    try {
      if (isEdit && ad) {
        await repo.update(ad.id, {
          title: title.trim(),
          description: description.trim(),
          price: priceNum,
          priceOnRequest,
          province: province || undefined,
          location: location.trim(),
          neighborhood: neighborhood.trim() || undefined,
          categoryId,
          whatsapp: whatsapp.replace(/\D/g, ''),
          type,
          images: finalImages,
        });
        if (useSupabase) {
          const supabase = getSupabase();
          const pathsWithOrder: { path: string; sort_order: number }[] = [];
          for (let i = 0; i < finalImages.length; i++) {
            const img = finalImages[i];
            if (img.startsWith('data:')) {
              try {
                const blob = dataUrlToBlob(img);
                const contentType = dataUrlMime(img);
                const ext = mimeToExt(contentType);
                const path = `${ad.userId}/${ad.id}/${crypto.randomUUID()}.${ext}`;
                if (!supabase) {
                  throw new Error('Supabase não configurado');
                }
                const { error: uploadError } = await supabase.storage
                  .from('ad-images')
                  .upload(path, blob, { contentType, upsert: false });

                if (uploadError) {
                  if (import.meta.env.DEV) {
                    // eslint-disable-next-line no-console
                    console.error('[UPLOAD] Error uploading image (edit):', {
                      bucket: 'ad-images',
                      path,
                      size: blob.size,
                      contentType,
                      error: uploadError.message,
                      statusCode: (uploadError as any)?.statusCode ?? (uploadError as any)?.status,
                      fullError: uploadError,
                    });
                  }
                  throw new Error(`Erro ao fazer upload da imagem ${i + 1}: ${uploadError.message} (${(uploadError as any)?.statusCode || 'unknown'})`);
                }

                if (import.meta.env.DEV) {
                  // eslint-disable-next-line no-console
                  console.log('[UPLOAD] Image uploaded successfully (edit):', {
                    bucket: 'ad-images',
                    path,
                    size: blob.size,
                    contentType,
                    ok: true,
                  });
                }

                pathsWithOrder.push({ path, sort_order: i });
              } catch (uploadErr: any) {
                // eslint-disable-next-line no-console
                console.error('[UPLOAD] Failed to upload image:', uploadErr);
                throw uploadErr;
              }
            } else {
              // Normalize existing URL/path to ensure we store only the path
              const normalizedPath = normalizeStoragePath(img, 'ad-images');
              if (normalizedPath) {
                pathsWithOrder.push({ path: normalizedPath, sort_order: i });
              }
            }
          }
          await deleteAllAdImages(ad.id);
          if (pathsWithOrder.length > 0) await insertAdImages(ad.id, pathsWithOrder);
          await refreshAds();
        } else {
          setAds(storage.getAds());
        }
        setSuccessMessage('Anúncio guardado com sucesso.');
        setTimeout(() => navigate('/vendedor'), 1500);
      } else {
        const createPayload = {
          title: title.trim(),
          description: description.trim(),
          price: priceNum,
          priceOnRequest,
          province: province || undefined,
          location: location.trim(),
          neighborhood: neighborhood.trim() || undefined,
          categoryId,
          images: finalImages,
          whatsapp: whatsapp.replace(/\D/g, ''),
          type,
          likes: 0,
          userId: user.id,
          userName: user.name,
          status: 'published' as const,
        };
        const created = await repo.create(createPayload);
        if (useSupabase) {
          const supabase = getSupabase();
          if (!supabase) {
            throw new Error('Supabase não configurado');
          }
          const pathsWithOrder: { path: string; sort_order: number }[] = [];
          for (let i = 0; i < finalImages.length; i++) {
            const img = finalImages[i];
            if (img.startsWith('data:') && img !== PLACEHOLDER_IMAGE) {
              try {
                const blob = dataUrlToBlob(img);
                const contentType = dataUrlMime(img);
                const ext = mimeToExt(contentType);
                const path = `${user.id}/${created.id}/${crypto.randomUUID()}.${ext}`;
                const { error: uploadError } = await supabase.storage
                  .from('ad-images')
                  .upload(path, blob, { contentType, upsert: false });

                if (uploadError) {
                  if (import.meta.env.DEV) {
                    // eslint-disable-next-line no-console
                    console.error('[UPLOAD] Error uploading image (create):', {
                      bucket: 'ad-images',
                      path,
                      size: blob.size,
                      contentType,
                      error: uploadError.message,
                      statusCode: (uploadError as any)?.statusCode ?? (uploadError as any)?.status,
                      fullError: uploadError,
                    });
                  }
                  throw new Error(`Erro ao fazer upload da imagem ${i + 1}: ${uploadError.message} (${(uploadError as any)?.statusCode || 'unknown'})`);
                }

                if (import.meta.env.DEV) {
                  // eslint-disable-next-line no-console
                  console.log('[UPLOAD] Image uploaded successfully (create):', {
                    bucket: 'ad-images',
                    path,
                    size: blob.size,
                    contentType,
                    ok: true,
                  });
                }

                pathsWithOrder.push({ path, sort_order: i });
              } catch (uploadErr: any) {
                // eslint-disable-next-line no-console
                console.error('[UPLOAD] Failed to upload image:', uploadErr);
                throw uploadErr;
              }
            }
          }
          if (pathsWithOrder.length > 0) {
            await insertAdImages(created.id, pathsWithOrder);
          }
          await refreshAds();
        } else {
          setAds(storage.getAds());
        }
        setSuccessMessage('Anúncio guardado com sucesso.');
        setTimeout(() => navigate('/vendedor'), 1500);
      }
    } catch (err) {
      setError(getMessageForError(err));
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) return null;

  return (
    <div className="mx-auto max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>{isEdit ? 'Editar anúncio' : 'Novo anúncio'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <p className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{error}</p>
            )}
            {successMessage && (
              <p className="rounded-lg bg-primary/10 p-3 text-sm text-primary">{successMessage}</p>
            )}

            <div className="space-y-2">
              <Label>Tipo</Label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as AdType)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
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
                placeholder="Ex: Telemóvel Samsung Galaxy"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ad-desc">Descrição</Label>
              <textarea
                id="ad-desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="ad-price-request"
                  checked={priceOnRequest}
                  onChange={(e) => setPriceOnRequest(e.target.checked)}
                  className="h-4 w-4 rounded border-input"
                />
                <Label htmlFor="ad-price-request">Preço sob consulta</Label>
              </div>
              {!priceOnRequest && (
                <Input
                  type="text"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="Ex: 500"
                />
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="ad-category">Categoria *</Label>
              <select
                id="ad-category"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                required
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="">Selecione</option>
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
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="">Selecione</option>
                  {PROVINCIAS_MOCAMBIQUE.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="ad-location">Cidade *</Label>
                <select
                  id="ad-location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                  disabled={!province}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm disabled:opacity-50"
                >
                  <option value="">Selecione</option>
                  {cities.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="ad-neighborhood">Bairro (opcional)</Label>
              <Input
                id="ad-neighborhood"
                value={neighborhood}
                onChange={(e) => setNeighborhood(e.target.value)}
                placeholder="Ex: Costa do Sol"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ad-whatsapp">WhatsApp *</Label>
              <Input
                id="ad-whatsapp"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                required
                placeholder="Ex: 84 123 4567"
              />
            </div>

            <div className="space-y-2">
              <Label>Imagens (até {MAX_IMAGES})</Label>
              <input
                ref={fileInputRef}
                type="file"
                accept={ACCEPT_IMAGES}
                multiple
                className="hidden"
                onChange={handleFileSelect}
              />
              <AppButton
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={images.length >= MAX_IMAGES}
                className="gap-2"
              >
                <Upload className="h-4 w-4" />
                {images.length >= MAX_IMAGES
                  ? `Máximo ${MAX_IMAGES} imagens`
                  : 'Selecionar fotos'}
              </AppButton>
              {images.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {images.map((src, i) => (
                    <div key={i} className="relative">
                      <img
                        src={src}
                        alt=""
                        loading="lazy"
                        className="h-20 w-20 rounded-lg object-cover border"
                      />
                      <AppButton
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute -right-1 -top-1 h-6 w-6 rounded-full p-0"
                        onClick={() => removeImage(i)}
                        aria-label="Remover imagem"
                      >
                        <X className="h-3 w-3" />
                      </AppButton>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-4">
              <AppButton type="submit" disabled={submitting} className="gap-2">
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 shrink-0 animate-spin" />
                    A guardar...
                  </>
                ) : (
                  isEdit ? 'Guardar' : 'Publicar'
                )}
              </AppButton>
              <AppButton
                type="button"
                variant="outline"
                onClick={() => navigate('/vendedor')}
                disabled={submitting}
              >
                Cancelar
              </AppButton>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
