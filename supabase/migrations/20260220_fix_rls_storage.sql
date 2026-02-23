-- =============================================================================
-- 20260220_fix_rls_storage.sql
-- CeluPublic — Fix COMPLETO de RLS (banners, ads, ad_images, categories,
-- admin_settings) + Storage policies (banner-images, ad-images).
--
-- PROBLEMA RESOLVIDO:
--   Policies anteriores em banners/ads/ad_images/categories/admin_settings
--   usavam subqueries em public.profiles para verificar role='admin'.
--   Isso causava recursão 42P17 porque profiles.RLS também fazia SELECT
--   em profiles → loop infinito → "Sem permissão para esta ação".
--
-- SOLUÇÃO:
--   Usar a função public.is_admin(uid) já criada em
--   20260217_fix_profiles_rls_NO_RECURSION_HARD.sql (acessa auth.users,
--   sem tocar em public.profiles). Sem recursão garantida.
--
-- IDEMPOTENTE: seguro de executar múltiplas vezes.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- PARTE 1: Garantir que a função is_admin existe e está correcta
-- (duplica a lógica do 20260217 para ser auto-suficiente)
-- ---------------------------------------------------------------------------
create or replace function public.is_admin(uid uuid)
returns boolean
language plpgsql
stable
security definer
set search_path = public, auth
as $$
declare
  user_email text;
begin
  select lower(email) into user_email
  from auth.users
  where id = uid;
  return lower(trim(coalesce(user_email, ''))) in (
    lower('sunyldjosesomailamatapa@gmail.com')
  );
end;
$$;

-- Garantir permissões de execução
revoke all on function public.is_admin(uuid) from public;
grant execute on function public.is_admin(uuid) to anon, authenticated;

-- ---------------------------------------------------------------------------
-- PARTE 2: Corrigir RLS da tabela public.banners
-- ---------------------------------------------------------------------------
-- Drop TODAS as policies existentes (idempotente)
do $$
declare pol record;
begin
  for pol in
    select policyname from pg_policies
    where schemaname = 'public' and tablename = 'banners'
  loop
    execute format('drop policy if exists %I on public.banners;', pol.policyname);
  end loop;
end $$;

-- Garantir RLS habilitado
alter table public.banners enable row level security;

-- SELECT: qualquer um vê banners activos; admin vê todos
create policy banners_select_public
  on public.banners for select
  using (
    active = true
    or public.is_admin(auth.uid())
  );

-- INSERT: apenas admin
create policy banners_insert_admin
  on public.banners for insert
  to authenticated
  with check (public.is_admin(auth.uid()));

-- UPDATE: apenas admin
create policy banners_update_admin
  on public.banners for update
  to authenticated
  using (public.is_admin(auth.uid()))
  with check (public.is_admin(auth.uid()));

-- DELETE: apenas admin
create policy banners_delete_admin
  on public.banners for delete
  to authenticated
  using (public.is_admin(auth.uid()));

-- ---------------------------------------------------------------------------
-- PARTE 3: Corrigir RLS da tabela public.categories
-- ---------------------------------------------------------------------------
do $$
declare pol record;
begin
  for pol in
    select policyname from pg_policies
    where schemaname = 'public' and tablename = 'categories'
  loop
    execute format('drop policy if exists %I on public.categories;', pol.policyname);
  end loop;
end $$;

alter table public.categories enable row level security;

create policy categories_select_public
  on public.categories for select
  using (true);

create policy categories_insert_admin
  on public.categories for insert
  to authenticated
  with check (public.is_admin(auth.uid()));

create policy categories_update_admin
  on public.categories for update
  to authenticated
  using (public.is_admin(auth.uid()))
  with check (public.is_admin(auth.uid()));

create policy categories_delete_admin
  on public.categories for delete
  to authenticated
  using (public.is_admin(auth.uid()));

-- ---------------------------------------------------------------------------
-- PARTE 4: Corrigir RLS da tabela public.admin_settings
-- ---------------------------------------------------------------------------
do $$
declare pol record;
begin
  for pol in
    select policyname from pg_policies
    where schemaname = 'public' and tablename = 'admin_settings'
  loop
    execute format('drop policy if exists %I on public.admin_settings;', pol.policyname);
  end loop;
end $$;

alter table public.admin_settings enable row level security;

create policy admin_settings_select_public
  on public.admin_settings for select
  using (true);

create policy admin_settings_insert_admin
  on public.admin_settings for insert
  to authenticated
  with check (public.is_admin(auth.uid()));

create policy admin_settings_update_admin
  on public.admin_settings for update
  to authenticated
  using (public.is_admin(auth.uid()))
  with check (public.is_admin(auth.uid()));

create policy admin_settings_delete_admin
  on public.admin_settings for delete
  to authenticated
  using (public.is_admin(auth.uid()));

-- ---------------------------------------------------------------------------
-- PARTE 5: Corrigir RLS da tabela public.ads
-- (policies admin usavam subquery em profiles → recursão)
-- ---------------------------------------------------------------------------
do $$
declare pol record;
begin
  for pol in
    select policyname from pg_policies
    where schemaname = 'public' and tablename = 'ads'
  loop
    execute format('drop policy if exists %I on public.ads;', pol.policyname);
  end loop;
end $$;

alter table public.ads enable row level security;

-- SELECT: anon vê só published de owners approved
-- (usa profiles para verified owner status — necessário e seguro: não é na policy de profiles)
create policy ads_select_public
  on public.ads for select
  using (
    (
      ads.status = 'published'
      and exists (
        select 1 from public.profiles p
        where p.id = ads.owner_id and p.status = 'approved'
      )
    )
    or auth.uid() = owner_id
    or public.is_admin(auth.uid())
  );

-- INSERT: owner pode criar
create policy ads_insert_owner
  on public.ads for insert
  to authenticated
  with check (
    auth.uid() = owner_id
    or public.is_admin(auth.uid())
  );

-- UPDATE: owner ou admin
create policy ads_update_owner_or_admin
  on public.ads for update
  to authenticated
  using (
    auth.uid() = owner_id
    or public.is_admin(auth.uid())
  )
  with check (
    auth.uid() = owner_id
    or public.is_admin(auth.uid())
  );

-- DELETE: owner ou admin
create policy ads_delete_owner_or_admin
  on public.ads for delete
  to authenticated
  using (
    auth.uid() = owner_id
    or public.is_admin(auth.uid())
  );

-- ---------------------------------------------------------------------------
-- PARTE 6: Corrigir RLS da tabela public.ad_images
-- ---------------------------------------------------------------------------
do $$
declare pol record;
begin
  for pol in
    select policyname from pg_policies
    where schemaname = 'public' and tablename = 'ad_images'
  loop
    execute format('drop policy if exists %I on public.ad_images;', pol.policyname);
  end loop;
end $$;

alter table public.ad_images enable row level security;

-- SELECT: imagens para ads públicos, owner, ou admin
create policy ad_images_select
  on public.ad_images for select
  using (
    exists (
      select 1 from public.ads a
      join public.profiles p on p.id = a.owner_id
      where a.id = ad_images.ad_id
        and a.status = 'published'
        and p.status = 'approved'
    )
    or exists (
      select 1 from public.ads a
      where a.id = ad_images.ad_id and a.owner_id = auth.uid()
    )
    or public.is_admin(auth.uid())
  );

-- INSERT: owner do ad ou admin
create policy ad_images_insert
  on public.ad_images for insert
  to authenticated
  with check (
    exists (
      select 1 from public.ads a
      where a.id = ad_images.ad_id and a.owner_id = auth.uid()
    )
    or public.is_admin(auth.uid())
  );

-- DELETE: owner do ad ou admin
create policy ad_images_delete
  on public.ad_images for delete
  to authenticated
  using (
    exists (
      select 1 from public.ads a
      where a.id = ad_images.ad_id and a.owner_id = auth.uid()
    )
    or public.is_admin(auth.uid())
  );

-- ---------------------------------------------------------------------------
-- PARTE 7: Storage policies — banner-images e ad-images
-- NOTA: os buckets já foram criados em 20260220_storage_buckets_and_click_views.sql
-- ---------------------------------------------------------------------------
alter table if exists storage.objects enable row level security;

-- ── banner-images ────────────────────────────────────────────────────────────
-- Drop policies existentes (idempotente)
drop policy if exists "Public read banner-images" on storage.objects;
drop policy if exists "Admin insert banner-images" on storage.objects;
drop policy if exists "Admin update banner-images" on storage.objects;
drop policy if exists "Admin delete banner-images" on storage.objects;
drop policy if exists "banner_images_public_read" on storage.objects;
drop policy if exists "banner_images_admin_insert" on storage.objects;
drop policy if exists "banner_images_admin_update" on storage.objects;
drop policy if exists "banner_images_admin_delete" on storage.objects;

-- Leitura pública (bucket é público)
create policy banner_images_public_read
  on storage.objects for select
  using (bucket_id = 'banner-images');

-- Upload: apenas admin
create policy banner_images_admin_insert
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'banner-images'
    and public.is_admin(auth.uid())
  );

-- Update metadata: apenas admin
create policy banner_images_admin_update
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'banner-images'
    and public.is_admin(auth.uid())
  )
  with check (
    bucket_id = 'banner-images'
    and public.is_admin(auth.uid())
  );

-- Delete: apenas admin
create policy banner_images_admin_delete
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'banner-images'
    and public.is_admin(auth.uid())
  );

-- ── ad-images ───────────────────────────────────────────────────────────────
-- Drop policies existentes (idempotente)
drop policy if exists "Public read ad-images" on storage.objects;
drop policy if exists "User insert own ad-images" on storage.objects;
drop policy if exists "User update own ad-images" on storage.objects;
drop policy if exists "User delete own ad-images" on storage.objects;
drop policy if exists "Admin insert ad-images" on storage.objects;
drop policy if exists "Admin update ad-images" on storage.objects;
drop policy if exists "Admin delete ad-images" on storage.objects;
drop policy if exists "ad_images_public_read" on storage.objects;
drop policy if exists "ad_images_owner_insert" on storage.objects;
drop policy if exists "ad_images_owner_update" on storage.objects;
drop policy if exists "ad_images_owner_delete" on storage.objects;
drop policy if exists "ad_images_admin_insert" on storage.objects;
drop policy if exists "ad_images_admin_update" on storage.objects;
drop policy if exists "ad_images_admin_delete" on storage.objects;

-- Leitura pública (bucket é público)
create policy ad_images_public_read
  on storage.objects for select
  using (bucket_id = 'ad-images');

-- Upload: owner (path inicia com auth.uid()) ou admin
-- Convenção de path: {owner_id}/{ad_id}/{uuid}.ext
create policy ad_images_owner_insert
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'ad-images'
    and (
      (storage.foldername(name))[1] = auth.uid()::text
      or public.is_admin(auth.uid())
    )
  );

-- Update metadata: owner ou admin
create policy ad_images_owner_update
  on storage.objects for update
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

-- Delete: owner ou admin
create policy ad_images_owner_delete
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'ad-images'
    and (
      (storage.foldername(name))[1] = auth.uid()::text
      or public.is_admin(auth.uid())
    )
  );

-- ---------------------------------------------------------------------------
-- PARTE 8: Garantir profile admin actualizado (idempotente)
-- ---------------------------------------------------------------------------
insert into public.profiles (id, full_name, email, role, status, account_type, created_at, updated_at)
select
  u.id,
  coalesce(u.raw_user_meta_data->>'full_name', u.email, 'Admin'),
  lower(u.email),
  'admin',
  'approved',
  'seller',
  now(),
  now()
from auth.users u
where lower(u.email) = lower('sunyldjosesomailamatapa@gmail.com')
on conflict (id) do update
set
  role = 'admin',
  status = 'approved',
  updated_at = now()
where lower(excluded.email) = lower('sunyldjosesomailamatapa@gmail.com');

-- ---------------------------------------------------------------------------
-- QUERIES DE AUDITORIA (executar manualmente no SQL Editor para validar)
-- ---------------------------------------------------------------------------

-- 1) Policies activas por tabela:
-- select schemaname, tablename, policyname, cmd, roles
-- from pg_policies
-- where tablename in ('banners','ads','ad_images','categories','admin_settings','profiles')
-- order by tablename, policyname;

-- 2) Policies de storage.objects:
-- select policyname, cmd, roles
-- from pg_policies
-- where schemaname = 'storage' and tablename = 'objects'
-- order by policyname;

-- 3) Verificar se admin tem perfil correcto:
-- select id, email, role, status
-- from public.profiles
-- where email ilike 'sunyldjosesomailamatapa@gmail.com';

-- 4) Simular INSERT em banners como admin (substituir <admin_uuid>):
-- set local role authenticated;
-- set local "request.jwt.claims" to '{"sub":"<admin_uuid>","email":"sunyldjosesomailamatapa@gmail.com"}';
-- insert into public.banners (title, image_path, active, sort_order)
-- values ('test', 'banners/test.jpg', true, 0);
-- -- esperado: inserção bem sucedida

-- 5) Simular INSERT em banner-images como admin (via supabase-js ou curl):
-- POST /storage/v1/object/banner-images/{path}
-- Authorization: Bearer <admin_jwt>
-- Content-Type: image/jpeg
-- Body: <file bytes>
-- -- esperado: 200 OK

-- 6) Confirmar que is_admin funciona:
-- select public.is_admin('<uuid-do-admin>');
-- -- esperado: true
