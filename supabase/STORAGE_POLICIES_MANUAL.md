# Storage policies — configuração manual (Dashboard)

Se ao executar as migrations aparecer **"must be owner of table objects"** ao criar policies em `storage.objects`, configure as policies abaixo **manualmente** no Supabase Dashboard.

## Onde configurar

1. Abra o projeto no [Supabase Dashboard](https://supabase.com/dashboard).
2. Vá em **Storage** → **Policies** (ou clique no bucket e depois em "Policies").
3. Crie as policies abaixo para os buckets **ad-images** e **banner-images**.

---

## Bucket: `ad-images`

- **Objetivo**: leitura pública; escrita apenas pelo dono (path começa com `userId`) ou admin.
- **Nome do bucket**: `ad-images` (público: sim).

### Policies a criar

| Nome (sugerido) | Operação | Target roles | WITH CHECK (insert) / USING (select/update/delete) |
|-----------------|----------|--------------|----------------------------------------------------|
| `ad_images_select` | SELECT | All | `bucket_id = 'ad-images'` |
| `ad_images_insert` | INSERT | authenticated | `bucket_id = 'ad-images'` AND `(storage.foldername(name))[1] = auth.uid()::text` |
| `ad_images_update` | UPDATE | authenticated | `bucket_id = 'ad-images'` AND ( `(storage.foldername(name))[1] = auth.uid()::text` OR `public.is_admin(auth.uid())` ) |
| `ad_images_delete` | DELETE | authenticated | `bucket_id = 'ad-images'` AND ( `(storage.foldername(name))[1] = auth.uid()::text` OR `public.is_admin(auth.uid())` ) |

**Expressões exatas (copiar):**

- **SELECT**:  
  `bucket_id = 'ad-images'`

- **INSERT** (with check):  
  `bucket_id = 'ad-images' and (storage.foldername(name))[1] = auth.uid()::text`

- **UPDATE** (using):  
  `bucket_id = 'ad-images' and ((storage.foldername(name))[1] = auth.uid()::text or public.is_admin(auth.uid()))`

- **DELETE** (using):  
  `bucket_id = 'ad-images' and ((storage.foldername(name))[1] = auth.uid()::text or public.is_admin(auth.uid()))`

---

## Bucket: `banner-images`

- **Objetivo**: leitura pública; escrita apenas admin.
- **Nome do bucket**: `banner-images` (público: sim).

### Policies a criar

| Nome (sugerido) | Operação | Target roles | WITH CHECK / USING |
|-----------------|----------|--------------|--------------------|
| `banner_images_select` | SELECT | All | `bucket_id = 'banner-images'` |
| `banner_images_insert` | INSERT | authenticated | `bucket_id = 'banner-images'` AND `public.is_admin(auth.uid())` |
| `banner_images_update` | UPDATE | authenticated | `bucket_id = 'banner-images'` AND `public.is_admin(auth.uid())` |
| `banner_images_delete` | DELETE | authenticated | `bucket_id = 'banner-images'` AND `public.is_admin(auth.uid())` |

**Expressões exatas (copiar):**

- **SELECT**:  
  `bucket_id = 'banner-images'`

- **INSERT** (with check):  
  `bucket_id = 'banner-images' and public.is_admin(auth.uid())`

- **UPDATE** (using):  
  `bucket_id = 'banner-images' and public.is_admin(auth.uid())`

- **DELETE** (using):  
  `bucket_id = 'banner-images' and public.is_admin(auth.uid())`

---

## Notas

- `public.is_admin(auth.uid())` é uma função definida nas migrations (0002_functions.sql) que lê o email em `auth.users`; **não** usa a tabela `profiles` (evita recursão RLS).
- Paths esperados:
  - **ad-images**: `{userId}/{adId}/{uuid}.{ext}`
  - **banner-images**: `banners/{bannerId}/{uuid}.{ext}`
- Se o bucket estiver como **público**, o SELECT pode ser dispensado em alguns setups (acesso público por URL); mesmo assim, ter a policy de SELECT garante consistência com RLS.
