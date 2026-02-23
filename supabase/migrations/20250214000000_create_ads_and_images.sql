-- CeluPublic: ads and ad_images tables.
-- Apply after profiles migration. Run in Supabase SQL Editor or: supabase db push

-- Table: ads
create table if not exists public.ads (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  type text not null check (type in ('product', 'service')),
  status text not null check (status in ('draft', 'published', 'hidden')),
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

-- Table: ad_images
create table if not exists public.ad_images (
  id uuid primary key default gen_random_uuid(),
  ad_id uuid not null references public.ads(id) on delete cascade,
  path text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- Indexes
create index if not exists ads_owner_id_idx on public.ads(owner_id);
create index if not exists ads_status_idx on public.ads(status);
create index if not exists ads_category_idx on public.ads(category);
create index if not exists ads_city_idx on public.ads(city);
create index if not exists ad_images_ad_id_idx on public.ad_images(ad_id);

-- Trigger: updated_at for ads
drop trigger if exists ads_updated_at on public.ads;
create trigger ads_updated_at
  before update on public.ads
  for each row execute function public.set_updated_at();

-- RLS: ads
alter table public.ads enable row level security;

-- Public: SELECT only published ads whose owner profile is approved
create policy "Public can read published ads from approved owners"
  on public.ads for select
  using (
    ads.status = 'published'
    and exists (
      select 1 from public.profiles p
      where p.id = ads.owner_id and p.status = 'approved'
    )
  );

-- Owner: SELECT own ads (any status, for dashboard/edit)
create policy "Owner can select own ads"
  on public.ads for select
  using (auth.uid() = owner_id);

-- Owner: INSERT/UPDATE/DELETE own ads
create policy "Owner can insert own ads"
  on public.ads for insert
  with check (auth.uid() = owner_id);

create policy "Owner can update own ads"
  on public.ads for update
  using (auth.uid() = owner_id);

create policy "Owner can delete own ads"
  on public.ads for delete
  using (auth.uid() = owner_id);

-- Admin: SELECT/UPDATE/DELETE any ad
create policy "Admin can select all ads"
  on public.ads for select
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

create policy "Admin can update all ads"
  on public.ads for update
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

create policy "Admin can delete all ads"
  on public.ads for delete
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

-- RLS: ad_images
alter table public.ad_images enable row level security;

-- Public: SELECT images only for ads that are publicly visible (same condition as ads)
create policy "Public can read images for public ads"
  on public.ad_images for select
  using (
    exists (
      select 1 from public.ads a
      join public.profiles p on p.id = a.owner_id
      where a.id = ad_images.ad_id
        and a.status = 'published'
        and p.status = 'approved'
    )
  );

-- Owner: SELECT/INSERT/DELETE images for own ads
create policy "Owner can read own ad images"
  on public.ad_images for select
  using (
    exists (select 1 from public.ads a where a.id = ad_images.ad_id and a.owner_id = auth.uid())
  );

create policy "Owner can insert images for own ads"
  on public.ad_images for insert
  with check (
    exists (select 1 from public.ads a where a.id = ad_images.ad_id and a.owner_id = auth.uid())
  );

create policy "Owner can delete own ad images"
  on public.ad_images for delete
  using (
    exists (select 1 from public.ads a where a.id = ad_images.ad_id and a.owner_id = auth.uid())
  );

-- Admin: full access to ad_images
create policy "Admin can select all ad_images"
  on public.ad_images for select
  using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

create policy "Admin can insert any ad_image"
  on public.ad_images for insert
  with check (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

create policy "Admin can delete any ad_image"
  on public.ad_images for delete
  using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

comment on table public.ads is 'CeluPublic ads. RLS: public sees only published + approved owner; owner CRUD own; admin full.';
comment on table public.ad_images is 'Storage paths for ad images. Path format: {ownerId}/{adId}/{uuid}.jpg';
