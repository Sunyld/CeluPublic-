# 📦 Como Aplicar Políticas de Storage no Supabase

As políticas de Row-Level Security (RLS) para o **Storage** (`storage.objects`) muitas vezes falham ao serem executadas via "SQL Editor" do painel web devido a restrições de permissão do usuário `anon` ou `authenticated` tentando modificar o schema do sistema.

## Alternativa 1: Via Dashboard (Manual) - RECOMENDADO
Se você vir erros ao rodar o SQL, configure manualmente no painel do Supabase:

1. Vá para **Storage** -> **Policies**.
2. No bucket `banner-images`:
   - Adicione uma política `SELECT` para `Public` (Acesso de leitura).
   - Adicione uma política `ALL` para Administradores (usando a função `public.is_admin(auth.uid())`).
3. No bucket `ad-images`:
   - Adicione uma política `SELECT` para `Public`.
   - Adicione uma política `ALL` para o Dono (check `auth.uid()`).
     - *Query sugerida*: `(storage.foldername(name))[1] = auth.uid()::text`

## Alternativa 2: Via Supabase CLI (Automatizado)
Se você tiver o Supabase CLI instalado, rode:
```bash
supabase db push
```
O CLI utiliza a `service_role` e consegue aplicar as políticas do arquivo SQL sem erros.

## SQL para Referência (O que as políticas fazem)

```sql
-- Ler Banners (Público)
CREATE POLICY "Public Read" ON storage.objects FOR SELECT USING (bucket_id = 'banner-images');

-- Admin Banners (Total)
CREATE POLICY "Admin All" ON storage.objects FOR ALL 
USING (bucket_id = 'banner-images' AND public.is_admin(auth.uid()));

-- Ler Imagens de Anúncios (Público)
CREATE POLICY "Public Read Ads" ON storage.objects FOR SELECT USING (bucket_id = 'ad-images');

-- Dono/Admin Imagens de Anúncios (Total)
CREATE POLICY "Owner All Ads" ON storage.objects FOR ALL 
USING (
  bucket_id = 'ad-images' 
  AND ( (storage.foldername(name))[1] = auth.uid()::text OR public.is_admin(auth.uid()) )
);
```

> **Atenção**: Certifique-se de que os buckets `banner-images` e `ad-images` estão marcados como **Public** no painel do Supabase para que as imagens carreguem no site.
