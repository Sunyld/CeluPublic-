-- Fix RLS for ads and ad_images (idempotent).
-- Usa public.is_admin(auth.uid()) para admin. Evita recursão.
-- Função owner_is_approved bypassa RLS para checar status do owner em policies públicas.

-- Função: checa se owner tem profile aprovado (SECURITY DEFINER = bypassa RLS)
create or replace function public.owner_is_approved(owner_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    (select (status = 'approved') from public.profiles where id = owner_id limit 1),
    false
  );
$$;

revoke all on function public.owner_is_approved(uuid) from public;
grant execute on function public.owner_is_approved(uuid) to anon, authenticated;

-- ----- ADS: dropar todas as policies existentes -----
do $$
declare
  r record;
begin
  for r in (select policyname from pg_policies where tablename = 'ads' and schemaname = 'public')
  loop
    execute format('drop policy if exists %I on public.ads', r.policyname);
  end loop;
end $$;

alter table public.ads enable row level security;

-- Public: SELECT published ads cujo owner está aprovado (sem subquery recursiva)
create policy "ads_public_read_published"
  on public.ads for select to anon, authenticated
  using (
    status = 'published' and public.owner_is_approved(owner_id)
  );

-- Owner: SELECT own ads
create policy "ads_owner_select"
  on public.ads for select to authenticated
  using (auth.uid() = owner_id);

-- Owner: INSERT own ads
create policy "ads_owner_insert"
  on public.ads for insert to authenticated
  with check (auth.uid() = owner_id);

-- Owner: UPDATE own ads
create policy "ads_owner_update"
  on public.ads for update to authenticated
  using (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);

-- Owner: DELETE own ads
create policy "ads_owner_delete"
  on public.ads for delete to authenticated
  using (auth.uid() = owner_id);

-- Admin: full access
create policy "ads_admin_all"
  on public.ads for all to authenticated
  using (public.is_admin(auth.uid()))
  with check (public.is_admin(auth.uid()));

-- ----- AD_IMAGES: dropar todas as policies existentes -----
do $$
declare
  r record;
begin
  for r in (select policyname from pg_policies where tablename = 'ad_images' and schemaname = 'public')
  loop
    execute format('drop policy if exists %I on public.ad_images', r.policyname);
  end loop;
end $$;

alter table public.ad_images enable row level security;

-- Public: SELECT images para ads publicados + owner aprovado
create policy "ad_images_public_read"
  on public.ad_images for select to anon, authenticated
  using (
    exists (
      select 1 from public.ads a
      where a.id = ad_images.ad_id
        and a.status = 'published'
        and public.owner_is_approved(a.owner_id)
    )
  );

-- Owner: SELECT/INSERT/DELETE own ad images
create policy "ad_images_owner_select"
  on public.ad_images for select to authenticated
  using (exists (select 1 from public.ads a where a.id = ad_images.ad_id and a.owner_id = auth.uid()));

create policy "ad_images_owner_insert"
  on public.ad_images for insert to authenticated
  with check (exists (select 1 from public.ads a where a.id = ad_images.ad_id and a.owner_id = auth.uid()));

create policy "ad_images_owner_delete"
  on public.ad_images for delete to authenticated
  using (exists (select 1 from public.ads a where a.id = ad_images.ad_id and a.owner_id = auth.uid()));

-- Admin: full access
create policy "ad_images_admin_all"
  on public.ad_images for all to authenticated
  using (public.is_admin(auth.uid()))
  with check (public.is_admin(auth.uid()));
