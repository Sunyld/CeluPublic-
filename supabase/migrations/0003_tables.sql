-- CeluPublic: all tables (idempotent — drop then create).

-- Order: drop dependent first
drop view if exists public.ad_click_counts_7d;
drop view if exists public.ad_click_counts_all;
drop view if exists public.ad_like_counts;
drop table if exists public.ad_clicks cascade;
drop table if exists public.ad_likes cascade;
drop table if exists public.ad_images cascade;
drop table if exists public.ads cascade;
drop table if exists public.seller_requests cascade;
drop table if exists public.banners cascade;
drop table if exists public.categories cascade;
drop table if exists public.admin_settings cascade;
drop table if exists public.profiles cascade;

-- 1) profiles
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  email text not null,
  whatsapp text,
  province text,
  city text,
  role text not null check (role in ('admin', 'seller')) default 'seller',
  status text not null check (status in ('pending', 'approved', 'rejected', 'blocked', 'suspended')) default 'pending',
  account_type text check (account_type in ('seller', 'provider', 'both')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index profiles_role_status_idx on public.profiles(role, status);
create index profiles_created_at_idx on public.profiles(created_at desc);
comment on table public.profiles is 'User profiles. id = auth.users.id. Admin determined by public.is_admin(auth.uid()).';

-- 2) seller_requests (one per user; admin approves after payment 20 MT)
create table public.seller_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  amount_mzn numeric default 20,
  payment_method text,
  payment_reference text,
  note text,
  reviewed_by uuid references auth.users(id),
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index seller_requests_user_id_idx on public.seller_requests(user_id);
create index seller_requests_status_idx on public.seller_requests(status);
comment on table public.seller_requests is 'Activation requests: user creates one; admin approves/rejects after payment.';

-- 3) ads
create table public.ads (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  type text not null check (type in ('product', 'service')),
  status text not null check (status in ('draft', 'published', 'hidden')) default 'published',
  title text not null,
  description text not null,
  price_mzn numeric,
  price_note text,
  province text not null default '',
  city text not null default '',
  neighborhood text,
  category text not null,
  whatsapp text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index ads_owner_id_idx on public.ads(owner_id);
create index ads_status_idx on public.ads(status);
create index ads_category_idx on public.ads(category);
create index ads_city_idx on public.ads(city);

drop trigger if exists ads_updated_at on public.ads;
create trigger ads_updated_at before update on public.ads for each row execute function public.set_updated_at();

-- 4) ad_images
create table public.ad_images (
  id uuid primary key default gen_random_uuid(),
  ad_id uuid not null references public.ads(id) on delete cascade,
  path text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create index ad_images_ad_id_idx on public.ad_images(ad_id);

-- 5) banners
create table public.banners (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  image_path text not null,
  link text,
  active boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create index banners_active_sort_idx on public.banners(active, sort_order);

-- 6) categories
create table public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  icon text,
  created_at timestamptz not null default now()
);

-- 7) admin_settings
create table public.admin_settings (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

create index admin_settings_key_idx on public.admin_settings(key);

-- 8) ad_clicks
create table public.ad_clicks (
  id uuid primary key default gen_random_uuid(),
  ad_id uuid not null references public.ads(id) on delete cascade,
  type text not null default 'whatsapp' check (type in ('whatsapp')),
  user_id uuid references public.profiles(id) on delete set null,
  ip_hash text,
  created_at timestamptz not null default now()
);

create index ad_clicks_ad_id_idx on public.ad_clicks(ad_id);
create index ad_clicks_created_at_idx on public.ad_clicks(created_at);

-- 9) ad_likes
create table public.ad_likes (
  ad_id uuid not null references public.ads(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (ad_id, user_id)
);

create index ad_likes_ad_id_idx on public.ad_likes(ad_id);
create index ad_likes_user_id_idx on public.ad_likes(user_id);

-- 10) Views (click counts + like counts)
create or replace view public.ad_like_counts as
select ad_id, count(*)::bigint as likes_count
from public.ad_likes
group by ad_id;

create or replace view public.ad_click_counts_all as
select
  ad_id,
  count(*)::bigint as clicks_total,
  null::bigint as clicks_7d
from public.ad_clicks
group by ad_id;

create or replace view public.ad_click_counts_7d as
select
  ad_id,
  null::bigint as clicks_total,
  count(*)::bigint as clicks_7d
from public.ad_clicks
where created_at >= (now() - interval '7 days')
group by ad_id;

grant select on public.ad_like_counts to anon, authenticated;
grant select on public.ad_click_counts_all to anon, authenticated;
grant select on public.ad_click_counts_7d to anon, authenticated;
