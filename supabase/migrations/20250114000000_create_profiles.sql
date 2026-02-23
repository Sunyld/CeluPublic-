-- CeluPublic: profiles table (extends auth.users).
-- Apply in Supabase SQL Editor or via CLI: supabase db push
-- Admin strategy: set one profile manually to role='admin' (e.g. after first signup).

-- Table: profiles (one row per auth user)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  email text not null,
  whatsapp text not null default '',
  province text not null default '',
  city text,
  role text not null check (role in ('admin', 'seller')) default 'seller',
  status text not null check (status in ('pending', 'approved', 'rejected', 'blocked', 'suspended')) default 'pending',
  account_type text check (account_type in ('seller', 'provider', 'both')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Optional: trigger to keep updated_at in sync
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists profiles_updated_at on public.profiles;
create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- RLS
alter table public.profiles enable row level security;

-- 1) Insert own profile: user can only insert their own row (auth.uid() = id)
create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- 2) Read own profile
create policy "Users can read own profile"
  on public.profiles for select
  using (auth.uid() = id);

-- 3) Update own profile: only allowed columns (full_name, whatsapp, province, city) – enforced in app or via trigger
--    For simplicity we allow update where auth.uid() = id; restrict columns in app layer.
create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- 4) Admin can select all profiles
--    Admin = exists a profile row for auth.uid() with role = 'admin'
create policy "Admin can select all profiles"
  on public.profiles for select
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

-- 5) Admin can update all profiles (e.g. status for approval)
create policy "Admin can update all profiles"
  on public.profiles for update
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

-- Index for admin lookups and listing
create index if not exists profiles_role_status_idx on public.profiles(role, status);
create index if not exists profiles_created_at_idx on public.profiles(created_at desc);

comment on table public.profiles is 'CeluPublic user profiles. id = auth.users.id. Set role=admin manually for admin accounts.';
