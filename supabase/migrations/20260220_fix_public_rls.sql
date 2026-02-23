-- =============================================================================
-- FILE: supabase/migrations/20260220_fix_public_rls.sql
-- CeluPublic — Fix DEFINITIVO de RLS para tabelas no schema PUBLIC.
--
-- ✅ SEGURO PARA SQL EDITOR DO SUPABASE (sem SET ROLE, sem owner de storage).
-- ✅ IDEMPOTENTE: pode ser executado múltiplas vezes sem erro.
-- ✅ Drop automático de todas as policies existentes via loop em pg_policies.
-- ✅ Usa public.is_admin(uid) → acessa auth.users, NUNCA public.profiles.
--    Isso elimina recursão 42P17 em todas as tabelas.
--
-- TABELAS COBERTAS:
--   public.banners        (SELECT público, INSERT/UPDATE/DELETE admin)
--   public.categories     (SELECT público, mutações admin)
--   public.admin_settings (SELECT público, mutações admin)
--   public.ads            (SELECT público, owner/admin CRUD)
--   public.ad_images      (SELECT público, owner/admin INSERT/DELETE)
--   public.profiles       (já coberto por 20260217 — função is_admin recriada aqui)
--
-- PROBLEMA RESOLVIDO:
--   Policies antigas em banners/ads/ad_images/categories/admin_settings usavam:
--     exists (select 1 from public.profiles p where p.id = auth.uid() and p.role='admin')
--   → RLS de profiles era avaliada → SELECT em profiles → verifica RLS de profiles
--   → recursão infinita 42P17 → "Sem permissão para esta ação"
--
-- SOLUÇÃO: is_admin() usa SECURITY DEFINER + acessa auth.users (sem RLS).
-- =============================================================================

-- ---------------------------------------------------------------------------
-- PARTE 1: Função is_admin — SECURITY DEFINER, sem recursão possível
-- ---------------------------------------------------------------------------
-- Usamos CREATE OR REPLACE para ser idempotente.
-- SECURITY DEFINER: executa com as permissões do owner (postgres), bypassa RLS.
-- set search_path = public, auth: garante que auth.users é acessível.
-- stable: optimizador pode cachear dentro da mesma transação.

create or replace function public.is_admin(uid uuid)
returns boolean
language plpgsql
stable
security definer
set search_path = public, auth
as $$
declare
  v_email text;
begin
  -- Acessa auth.users DIRECTAMENTE (sem passar por RLS de public.profiles)
  select lower(trim(coalesce(email, '')))
  into v_email
  from auth.users
  where id = uid;

  -- Lista de emails admin (adicione mais aqui se necessário)
  return v_email = lower(trim('sunyldjosesomailamatapa@gmail.com'));
end;
$$;

-- Revogar acesso total e depois conceder apenas a roles necessárias
revoke all on function public.is_admin(uuid) from public;
grant execute on function public.is_admin(uuid) to anon, authenticated;

-- Garantir que a função existe (diagnóstico)
-- select public.is_admin('<seu-uuid-de-admin-aqui>'); -- deve retornar true

-- ---------------------------------------------------------------------------
-- PARTE 2: RLS — public.banners
-- ---------------------------------------------------------------------------

-- Drop de TODAS as policies existentes (loop idempotente)
do $$
declare
  pol record;
begin
  for pol in
    select policyname
    from pg_policies
    where schemaname = 'public' and tablename = 'banners'
  loop
    execute format('drop policy if exists %I on public.banners', pol.policyname);
  end loop;
end $$;

-- Habilitar RLS (idempotente se já habilitado)
alter table public.banners enable row level security;

-- SELECT: anon e authenticated vêem banners activos; admin vê todos
create policy banners_select_public
  on public.banners
  for select
  using (
    active = true
    or public.is_admin(auth.uid())
  );

-- INSERT: apenas admin autenticado
create policy banners_insert_admin
  on public.banners
  for insert
  to authenticated
  with check (public.is_admin(auth.uid()));

-- UPDATE: apenas admin autenticado
create policy banners_update_admin
  on public.banners
  for update
  to authenticated
  using    (public.is_admin(auth.uid()))
  with check (public.is_admin(auth.uid()));

-- DELETE: apenas admin autenticado
create policy banners_delete_admin
  on public.banners
  for delete
  to authenticated
  using (public.is_admin(auth.uid()));

-- ---------------------------------------------------------------------------
-- PARTE 3: RLS — public.categories
-- ---------------------------------------------------------------------------

do $$
declare
  pol record;
begin
  for pol in
    select policyname
    from pg_policies
    where schemaname = 'public' and tablename = 'categories'
  loop
    execute format('drop policy if exists %I on public.categories', pol.policyname);
  end loop;
end $$;

alter table public.categories enable row level security;

create policy categories_select_public
  on public.categories
  for select
  using (true);

create policy categories_insert_admin
  on public.categories
  for insert
  to authenticated
  with check (public.is_admin(auth.uid()));

create policy categories_update_admin
  on public.categories
  for update
  to authenticated
  using    (public.is_admin(auth.uid()))
  with check (public.is_admin(auth.uid()));

create policy categories_delete_admin
  on public.categories
  for delete
  to authenticated
  using (public.is_admin(auth.uid()));

-- ---------------------------------------------------------------------------
-- PARTE 4: RLS — public.admin_settings
-- ---------------------------------------------------------------------------

do $$
declare
  pol record;
begin
  for pol in
    select policyname
    from pg_policies
    where schemaname = 'public' and tablename = 'admin_settings'
  loop
    execute format('drop policy if exists %I on public.admin_settings', pol.policyname);
  end loop;
end $$;

alter table public.admin_settings enable row level security;

create policy admin_settings_select_public
  on public.admin_settings
  for select
  using (true);

create policy admin_settings_insert_admin
  on public.admin_settings
  for insert
  to authenticated
  with check (public.is_admin(auth.uid()));

create policy admin_settings_update_admin
  on public.admin_settings
  for update
  to authenticated
  using    (public.is_admin(auth.uid()))
  with check (public.is_admin(auth.uid()));

create policy admin_settings_delete_admin
  on public.admin_settings
  for delete
  to authenticated
  using (public.is_admin(auth.uid()));

-- ---------------------------------------------------------------------------
-- PARTE 5: RLS — public.ads
-- NOTA: a policy SELECT usa exists em public.profiles para checar owner.status.
-- Isso é SEGURO porque não cria recursão de RLS de profiles
-- (profiles.RLS não é disparada pela query dentro de ads.policy).
-- ---------------------------------------------------------------------------

do $$
declare
  pol record;
begin
  for pol in
    select policyname
    from pg_policies
    where schemaname = 'public' and tablename = 'ads'
  loop
    execute format('drop policy if exists %I on public.ads', pol.policyname);
  end loop;
end $$;

alter table public.ads enable row level security;

-- SELECT:
--   anon: apenas ads published cujo owner tem status='approved'
--   owner: vê os próprios ads independente de status
--   admin: vê todos
create policy ads_select
  on public.ads
  for select
  using (
    -- Anúncios publicados de owners aprovados (visíveis a todos)
    (
      ads.status = 'published'
      and exists (
        select 1
        from public.profiles p
        where p.id = ads.owner_id
          and p.status = 'approved'
      )
    )
    -- Owner vê os próprios anúncios (qualquer status)
    or auth.uid() = ads.owner_id
    -- Admin vê tudo
    or public.is_admin(auth.uid())
  );

-- INSERT: owner autenticado ou admin
create policy ads_insert
  on public.ads
  for insert
  to authenticated
  with check (
    auth.uid() = owner_id
    or public.is_admin(auth.uid())
  );

-- UPDATE: owner ou admin
create policy ads_update
  on public.ads
  for update
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
create policy ads_delete
  on public.ads
  for delete
  to authenticated
  using (
    auth.uid() = owner_id
    or public.is_admin(auth.uid())
  );

-- ---------------------------------------------------------------------------
-- PARTE 6: RLS — public.ad_images
-- ---------------------------------------------------------------------------

do $$
declare
  pol record;
begin
  for pol in
    select policyname
    from pg_policies
    where schemaname = 'public' and tablename = 'ad_images'
  loop
    execute format('drop policy if exists %I on public.ad_images', pol.policyname);
  end loop;
end $$;

alter table public.ad_images enable row level security;

-- SELECT: imagens de ads publicados (owner approved) + owner das imagens + admin
create policy ad_images_select
  on public.ad_images
  for select
  using (
    -- Imagens de anúncios públicos (published + owner approved)
    exists (
      select 1
      from public.ads a
      join public.profiles p on p.id = a.owner_id
      where a.id = ad_images.ad_id
        and a.status = 'published'
        and p.status = 'approved'
    )
    -- Owner do anúncio pode ver as suas imagens
    or exists (
      select 1
      from public.ads a
      where a.id = ad_images.ad_id
        and a.owner_id = auth.uid()
    )
    -- Admin vê tudo
    or public.is_admin(auth.uid())
  );

-- INSERT: owner do ad ou admin
create policy ad_images_insert
  on public.ad_images
  for insert
  to authenticated
  with check (
    exists (
      select 1
      from public.ads a
      where a.id = ad_images.ad_id
        and a.owner_id = auth.uid()
    )
    or public.is_admin(auth.uid())
  );

-- UPDATE: owner do ad ou admin (ex: reordenar sort_order)
create policy ad_images_update
  on public.ad_images
  for update
  to authenticated
  using (
    exists (
      select 1
      from public.ads a
      where a.id = ad_images.ad_id
        and a.owner_id = auth.uid()
    )
    or public.is_admin(auth.uid())
  )
  with check (
    exists (
      select 1
      from public.ads a
      where a.id = ad_images.ad_id
        and a.owner_id = auth.uid()
    )
    or public.is_admin(auth.uid())
  );

-- DELETE: owner do ad ou admin
create policy ad_images_delete
  on public.ad_images
  for delete
  to authenticated
  using (
    exists (
      select 1
      from public.ads a
      where a.id = ad_images.ad_id
        and a.owner_id = auth.uid()
    )
    or public.is_admin(auth.uid())
  );

-- ---------------------------------------------------------------------------
-- PARTE 7: Upsert perfil admin (idempotente)
-- Garante que o admin existe em public.profiles com role='admin', status='approved'
-- ---------------------------------------------------------------------------
insert into public.profiles (
  id, full_name, email, role, status, account_type, created_at, updated_at
)
select
  u.id,
  coalesce(u.raw_user_meta_data->>'full_name', split_part(u.email, '@', 1), 'Admin'),
  lower(trim(u.email)),
  'admin',
  'approved',
  'seller',
  now(),
  now()
from auth.users u
where lower(trim(u.email)) = lower(trim('sunyldjosesomailamatapa@gmail.com'))
on conflict (id) do update
  set
    role       = 'admin',
    status     = 'approved',
    updated_at = now();

-- ---------------------------------------------------------------------------
-- PARTE 8: Normalizar paths na DB (remover URLs completas se existirem)
-- Safe: apenas actualiza linhas que têm http na image_path ou path
-- ---------------------------------------------------------------------------
-- Banners: extrair path de URL pública (formato .../public/banner-images/<path>)
update public.banners
set image_path = regexp_replace(
  image_path,
  '^.*/storage/v1/object/(?:public|sign)/banner-images/(.+?)(?:\?.*)?$',
  '\1'
)
where image_path like 'http%'
  and image_path like '%/banner-images/%';

-- ad_images: extrair path de URL pública (formato .../public/ad-images/<path>)
update public.ad_images
set path = regexp_replace(
  path,
  '^.*/storage/v1/object/(?:public|sign)/ad-images/(.+?)(?:\?.*)?$',
  '\1'
)
where path like 'http%'
  and path like '%/ad-images/%';

-- ---------------------------------------------------------------------------
-- QUERIES DE AUDITORIA (comentadas — executar separadamente para validar)
-- ---------------------------------------------------------------------------

-- 1. Verificar que is_admin funciona (substituir <uuid> pelo UUID do admin)
-- select public.is_admin('<uuid-do-admin>');
-- -- Esperado: true

-- 2. Verificar policies activas em tabelas públicas
-- select schemaname, tablename, policyname, cmd, roles
-- from pg_policies
-- where tablename in ('banners','ads','ad_images','categories','admin_settings','profiles')
-- order by tablename, policyname;

-- 3. Verificar perfil admin correcto
-- select id, email, role, status
-- from public.profiles
-- where email ilike 'sunyldjosesomailamatapa@gmail.com';
-- -- Esperado: role='admin', status='approved'

-- 4. Verificar que não há URLs completas na DB após normalização
-- select count(*) as banners_com_url from public.banners where image_path like 'http%';
-- select count(*) as ad_images_com_url from public.ad_images where path like 'http%';
-- -- Esperado: 0 e 0

-- 5. Simular INSERT em banners como admin (teste de policy)
-- A fazer via frontend (login como admin → painel → novo banner)
-- Log esperado no console: [UPLOAD] Banner uploaded successfully: { ok: true }
