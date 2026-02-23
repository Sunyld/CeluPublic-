-- Ads + ad_images: tabelas, RLS público (published + owner approved), bucket público.
-- Idempotente. Sempre DROP POLICY IF EXISTS antes de CREATE.

-- 1) Garantir função owner_is_approved (para policies sem recursão)
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

-- 2) Tabelas (já existem na maioria dos casos)
create table if not exists public.ads (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  type text not null check (type in ('product', 'service')),
  status text not null default 'published' check (status in ('draft', 'published', 'hidden')),
  title text not null,
  description text not null,
  price_mzn numeric null,
  price_note text null,
  province text not null,
  city text not null,
  neighborhood text null,
  category text not null,
  whatsapp text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.ad_images (
  id uuid primary key default gen_random_uuid(),
  ad_id uuid not null references public.ads(id) on delete cascade,
  path text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists ads_owner_id_idx on public.ads(owner_id);
create index if not exists ads_status_idx on public.ads(status);
create index if not exists ad_images_ad_id_idx on public.ad_images(ad_id);

-- 3) Dropar TODAS as policies em ads (por nome conhecido + loop)
do $$
declare r record;
begin
  for r in (select policyname from pg_policies where tablename = 'ads' and schemaname = 'public')
  loop
    execute format('drop policy if exists %I on public.ads', r.policyname);
  end loop;
end $$;

alter table public.ads enable row level security;

create policy "ads_public_read_published"
  on public.ads for select to anon, authenticated
  using (status = 'published' and public.owner_is_approved(owner_id));

create policy "ads_owner_select"
  on public.ads for select to authenticated using (auth.uid() = owner_id);
create policy "ads_owner_insert"
  on public.ads for insert to authenticated with check (auth.uid() = owner_id);
create policy "ads_owner_update"
  on public.ads for update to authenticated using (auth.uid() = owner_id) with check (auth.uid() = owner_id);
create policy "ads_owner_delete"
  on public.ads for delete to authenticated using (auth.uid() = owner_id);

create policy "ads_admin_all"
  on public.ads for all to authenticated
  using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));

-- 4) Dropar TODAS as policies em ad_images
do $$
declare r record;
begin
  for r in (select policyname from pg_policies where tablename = 'ad_images' and schemaname = 'public')
  loop
    execute format('drop policy if exists %I on public.ad_images', r.policyname);
  end loop;
end $$;

alter table public.ad_images enable row level security;

create policy "ad_images_public_read"
  on public.ad_images for select to anon, authenticated
  using (
    exists (
      select 1 from public.ads a
      where a.id = ad_images.ad_id and a.status = 'published' and public.owner_is_approved(a.owner_id)
    )
  );
create policy "ad_images_owner_select"
  on public.ad_images for select to authenticated
  using (exists (select 1 from public.ads a where a.id = ad_images.ad_id and a.owner_id = auth.uid()));
create policy "ad_images_owner_insert"
  on public.ad_images for insert to authenticated
  with check (exists (select 1 from public.ads a where a.id = ad_images.ad_id and a.owner_id = auth.uid()));
create policy "ad_images_owner_delete"
  on public.ad_images for delete to authenticated
  using (exists (select 1 from public.ads a where a.id = ad_images.ad_id and a.owner_id = auth.uid()));
create policy "ad_images_admin_all"
  on public.ad_images for all to authenticated
  using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));

-- 5) Bucket ad-images público (leitura anônima)
insert into storage.buckets (id, name, public)
values ('ad-images', 'ad-images', true)
on conflict (id) do update set public = true;

drop policy if exists "ad_images_select" on storage.objects;
create policy "ad_images_select" on storage.objects for select
  using (bucket_id = 'ad-images');

-- 6) Queries de auditoria (descomentar para rodar manualmente no SQL Editor):
-- SELECT count(*) AS ads_published FROM public.ads WHERE status = 'published';
-- SELECT count(*) AS ad_images_count FROM public.ad_images;
-- SELECT ai.id, ai.ad_id, ai.path FROM public.ad_images ai LEFT JOIN public.ads a ON a.id = ai.ad_id WHERE a.id IS NULL;  -- broken paths (orphan images)
