-- CeluPublic: categories, banners, admin_settings (Phase 3 Block C).
-- Apply after ads migration. Run in Supabase SQL Editor or: supabase db push

-- 1) public.categories
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  icon text null,
  created_at timestamptz not null default now()
);

-- 2) public.banners
create table if not exists public.banners (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  image_path text not null,
  link text null,
  active boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- 3) public.admin_settings
create table if not exists public.admin_settings (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

-- Indexes
create index if not exists banners_active_sort_idx on public.banners(active, sort_order);
create index if not exists admin_settings_key_idx on public.admin_settings(key);

-- Seed recommended settings (run manually or uncomment to apply):
-- insert into public.admin_settings (key, value) values
--   ('admin_whatsapp', '{"number":"+258840000000"}'::jsonb),
--   ('activation_fee_mzn', '{"amount":20}'::jsonb)
-- on conflict (key) do nothing;

-- RLS: categories
alter table public.categories enable row level security;

create policy "Public can read categories"
  on public.categories for select
  to public
  using (true);

create policy "Admin can insert categories"
  on public.categories for insert
  with check (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

create policy "Admin can update categories"
  on public.categories for update
  using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

create policy "Admin can delete categories"
  on public.categories for delete
  using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

-- RLS: banners
alter table public.banners enable row level security;

create policy "Public can read active banners"
  on public.banners for select
  to public
  using (active = true);

create policy "Admin can read all banners"
  on public.banners for select
  using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

create policy "Admin can insert banners"
  on public.banners for insert
  with check (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

create policy "Admin can update banners"
  on public.banners for update
  using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

create policy "Admin can delete banners"
  on public.banners for delete
  using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

-- RLS: admin_settings (SELECT public for config keys; INSERT/UPDATE/DELETE admin only)
alter table public.admin_settings enable row level security;

create policy "Public can read admin_settings"
  on public.admin_settings for select
  to public
  using (true);

create policy "Admin can insert admin_settings"
  on public.admin_settings for insert
  with check (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

create policy "Admin can update admin_settings"
  on public.admin_settings for update
  using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

create policy "Admin can delete admin_settings"
  on public.admin_settings for delete
  using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

comment on table public.categories is 'CeluPublic categories. Public read; admin CRUD.';
comment on table public.banners is 'CeluPublic banners. Public sees active only; admin CRUD. image_path = storage path in banner-images.';
comment on table public.admin_settings is 'Key-value config. Public read (e.g. admin_whatsapp, activation_fee_mzn); admin write.';
