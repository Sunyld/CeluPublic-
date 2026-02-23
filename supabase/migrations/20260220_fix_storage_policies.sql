-- =============================================================================
-- FILE: supabase/migrations/20260220_fix_storage_policies.sql
-- CeluPublic — Policies de storage.objects (buckets: banner-images, ad-images)
--
-- ⚠️  AVISO DE EXECUÇÃO:
--   Este ficheiro pode FALHAR no SQL Editor do Supabase (web) com o erro:
--     "must be owner of table objects" OR "permission denied"
--   porque o SQL Editor corre como role "authenticator" que NÃO é owner de storage.objects.
--
-- ✅ ONDE FUNCIONA:
--   (A) Via Supabase CLI:  supabase db push  (corre como postgres)
--   (B) Via psql directo:  psql $DATABASE_URL -f este_ficheiro.sql
--   (C) No Dashboard:      Storage → Policies (ver instruções abaixo em comentários)
--
-- 💡 ALTERNATIVA RECOMENDADA:
--   Se não tens CLI/psql, usa o Dashboard Visual — ver INSTRUÇÕES_DASHBOARD abaixo.
--
-- ✅ IDEMPOTENTE: drop antes de criar, seguro de re-executar via CLI.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- PRÉ-REQUISITO: is_admin já foi criado no ficheiro fix_public_rls.sql
-- Se executar este ficheiro sozinho, descomentar e executar a parte abaixo:
-- ---------------------------------------------------------------------------
-- create or replace function public.is_admin(uid uuid)
-- returns boolean language plpgsql stable security definer
-- set search_path = public, auth as $$
-- declare v_email text; begin
--   select lower(trim(coalesce(email,''))) into v_email from auth.users where id = uid;
--   return v_email = lower(trim('sunyldjosesomailamatapa@gmail.com'));
-- end; $$;
-- grant execute on function public.is_admin(uuid) to anon, authenticated;

-- ---------------------------------------------------------------------------
-- Garantir RLS habilitado em storage.objects (geralmente já está)
-- ---------------------------------------------------------------------------
alter table if exists storage.objects enable row level security;

-- ===========================================================================
-- BUCKET: banner-images
-- ===========================================================================

-- Drop idempotente de todas as policies existentes para banner-images
drop policy if exists "Public read banner-images"       on storage.objects;
drop policy if exists "Admin insert banner-images"      on storage.objects;
drop policy if exists "Admin update banner-images"      on storage.objects;
drop policy if exists "Admin delete banner-images"      on storage.objects;
drop policy if exists "banner_images_public_read"       on storage.objects;
drop policy if exists "banner_images_admin_insert"      on storage.objects;
drop policy if exists "banner_images_admin_update"      on storage.objects;
drop policy if exists "banner_images_admin_delete"      on storage.objects;

-- SELECT: qualquer pessoa pode ler (bucket é público)
create policy banner_images_public_read
  on storage.objects
  for select
  using (bucket_id = 'banner-images');

-- INSERT: apenas admin autenticado
create policy banner_images_admin_insert
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'banner-images'
    and public.is_admin(auth.uid())
  );

-- UPDATE: apenas admin autenticado
create policy banner_images_admin_update
  on storage.objects
  for update
  to authenticated
  using (
    bucket_id = 'banner-images'
    and public.is_admin(auth.uid())
  )
  with check (
    bucket_id = 'banner-images'
    and public.is_admin(auth.uid())
  );

-- DELETE: apenas admin autenticado
create policy banner_images_admin_delete
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'banner-images'
    and public.is_admin(auth.uid())
  );

-- ===========================================================================
-- BUCKET: ad-images
-- Convenção de path: {owner_uuid}/{ad_uuid}/{random_uuid}.ext
-- A verificação (storage.foldername(name))[1] = auth.uid()::text
-- garante que cada user só pode escrever na sua pasta.
-- ===========================================================================

-- Drop idempotente de todas as policies existentes para ad-images
drop policy if exists "Public read ad-images"           on storage.objects;
drop policy if exists "User insert own ad-images"       on storage.objects;
drop policy if exists "User update own ad-images"       on storage.objects;
drop policy if exists "User delete own ad-images"       on storage.objects;
drop policy if exists "Admin insert ad-images"          on storage.objects;
drop policy if exists "Admin update ad-images"          on storage.objects;
drop policy if exists "Admin delete ad-images"          on storage.objects;
drop policy if exists "ad_images_public_read"           on storage.objects;
drop policy if exists "ad_images_owner_insert"          on storage.objects;
drop policy if exists "ad_images_owner_update"          on storage.objects;
drop policy if exists "ad_images_owner_delete"          on storage.objects;

-- SELECT: qualquer pessoa pode ler (bucket é público)
create policy ad_images_public_read
  on storage.objects
  for select
  using (bucket_id = 'ad-images');

-- INSERT: owner (1ª pasta = uid) OU admin
create policy ad_images_owner_insert
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'ad-images'
    and (
      (storage.foldername(name))[1] = auth.uid()::text
      or public.is_admin(auth.uid())
    )
  );

-- UPDATE: owner ou admin
create policy ad_images_owner_update
  on storage.objects
  for update
  to authenticated
  using (
    bucket_id = 'ad-images'
    and (
      (storage.foldername(name))[1] = auth.uid()::text
      or public.is_admin(auth.uid())
    )
  )
  with check (
    bucket_id = 'ad-images'
    and (
      (storage.foldername(name))[1] = auth.uid()::text
      or public.is_admin(auth.uid())
    )
  );

-- DELETE: owner ou admin
create policy ad_images_owner_delete
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'ad-images'
    and (
      (storage.foldername(name))[1] = auth.uid()::text
      or public.is_admin(auth.uid())
    )
  );

-- ---------------------------------------------------------------------------
-- Garantir que os buckets existem e são públicos
-- (seguro de executar; insert ignora se já existirem)
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('banner-images', 'banner-images', true, 5242880,  array['image/jpeg','image/png','image/webp','image/gif']),
  ('ad-images',     'ad-images',     true, 5242880,  array['image/jpeg','image/png','image/webp','image/gif'])
on conflict (id) do update
  set
    public             = true,
    file_size_limit    = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

-- ---------------------------------------------------------------------------
-- QUERIES DE AUDITORIA (comentadas)
-- ---------------------------------------------------------------------------

-- 1. Verificar policies activas em storage.objects
-- select policyname, cmd, roles, qual, with_check
-- from pg_policies
-- where schemaname = 'storage' and tablename = 'objects'
-- order by policyname;

-- 2. Verificar buckets e se são públicos
-- select id, name, public, file_size_limit
-- from storage.buckets
-- where id in ('banner-images', 'ad-images');
-- -- Esperado: public = true em ambos

-- 3. Verificar que is_admin retorna true para o admin
-- select public.is_admin('<uuid-do-admin>');
-- -- Esperado: true

-- =============================================================================
-- INSTRUÇÕES_DASHBOARD: Criar policies pelo Dashboard (sem CLI)
-- =============================================================================
-- Se o SQL Editor rejeitar este ficheiro, cria as policies manualmente:
--
-- 1. Abrir Supabase Dashboard → Storage → Policies → storage.objects
--
-- ── BUCKET: banner-images ───────────────────────────────────────────────────
--
-- POLICY 1 — Leitura pública
--   Name:                 banner_images_public_read
--   Allowed operation:    SELECT
--   Target roles:         (deixar em branco = todos)
--   USING expression:
--     bucket_id = 'banner-images'
--
-- POLICY 2 — Upload admin
--   Name:                 banner_images_admin_insert
--   Allowed operation:    INSERT
--   Target roles:         authenticated
--   WITH CHECK expression:
--     bucket_id = 'banner-images'
--     AND public.is_admin(auth.uid())
--
-- POLICY 3 — Atualizar admin
--   Name:                 banner_images_admin_update
--   Allowed operation:    UPDATE
--   Target roles:         authenticated
--   USING expression:
--     bucket_id = 'banner-images' AND public.is_admin(auth.uid())
--   WITH CHECK expression:
--     bucket_id = 'banner-images' AND public.is_admin(auth.uid())
--
-- POLICY 4 — Remover admin
--   Name:                 banner_images_admin_delete
--   Allowed operation:    DELETE
--   Target roles:         authenticated
--   USING expression:
--     bucket_id = 'banner-images' AND public.is_admin(auth.uid())
--
-- ── BUCKET: ad-images ───────────────────────────────────────────────────────
--
-- POLICY 1 — Leitura pública
--   Name:                 ad_images_public_read
--   Allowed operation:    SELECT
--   Target roles:         (deixar em branco)
--   USING expression:
--     bucket_id = 'ad-images'
--
-- POLICY 2 — Upload owner ou admin
--   Name:                 ad_images_owner_insert
--   Allowed operation:    INSERT
--   Target roles:         authenticated
--   WITH CHECK expression:
--     bucket_id = 'ad-images'
--     AND (
--       (storage.foldername(name))[1] = auth.uid()::text
--       OR public.is_admin(auth.uid())
--     )
--
-- POLICY 3 — Atualizar owner ou admin
--   Name:                 ad_images_owner_update
--   Allowed operation:    UPDATE
--   Target roles:         authenticated
--   USING expression:
--     bucket_id = 'ad-images'
--     AND (
--       (storage.foldername(name))[1] = auth.uid()::text
--       OR public.is_admin(auth.uid())
--     )
--   WITH CHECK expression:
--     bucket_id = 'ad-images'
--     AND (
--       (storage.foldername(name))[1] = auth.uid()::text
--       OR public.is_admin(auth.uid())
--     )
--
-- POLICY 4 — Remover owner ou admin
--   Name:                 ad_images_owner_delete
--   Allowed operation:    DELETE
--   Target roles:         authenticated
--   USING expression:
--     bucket_id = 'ad-images'
--     AND (
--       (storage.foldername(name))[1] = auth.uid()::text
--       OR public.is_admin(auth.uid())
--     )
-- =============================================================================
