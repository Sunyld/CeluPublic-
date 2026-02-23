-- Admin profiles + categories policies (idempotent)
-- Usa public.is_admin(auth.uid()) em vez de subqueries em profiles para evitar recursão.
-- Rodar no Supabase SQL Editor ou: supabase db push

-- ----- CATEGORIES -----
-- Garantir tabela existe (idempotente; 20250215000000 já pode tê-la criada)
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  icon text null,
  created_at timestamptz not null default now()
);

alter table public.categories enable row level security;

-- Dropar policies antigas (subquery em profiles)
drop policy if exists "Public can read categories" on public.categories;
drop policy if exists "Admin can insert categories" on public.categories;
drop policy if exists "Admin can update categories" on public.categories;
drop policy if exists "Admin can delete categories" on public.categories;

-- Recriar usando is_admin (sem subquery em profiles)
create policy "Public can read categories"
  on public.categories for select
  to public
  using (true);

create policy "Admin can insert categories"
  on public.categories for insert
  to authenticated
  with check (public.is_admin(auth.uid()));

create policy "Admin can update categories"
  on public.categories for update
  to authenticated
  using (public.is_admin(auth.uid()));

create policy "Admin can delete categories"
  on public.categories for delete
  to authenticated
  using (public.is_admin(auth.uid()));

-- ----- PROFILES -----
-- Dropar policies antigas
drop policy if exists "profiles_insert_own" on public.profiles;
drop policy if exists "profiles_select_own_or_admin" on public.profiles;
drop policy if exists "profiles_update_own_or_admin" on public.profiles;
drop policy if exists "profiles: insert own" on public.profiles;
drop policy if exists "profiles: select own or admin" on public.profiles;
drop policy if exists "profiles: update own or admin" on public.profiles;
drop policy if exists "profiles: users can insert own" on public.profiles;
drop policy if exists "profiles: users can select own" on public.profiles;
drop policy if exists "profiles: users can update own" on public.profiles;
drop policy if exists "Users can read own profile" on public.profiles;
drop policy if exists "Users can update own profile" on public.profiles;
drop policy if exists "Admin can read all profiles" on public.profiles;
drop policy if exists "Admin can update profiles" on public.profiles;

alter table public.profiles enable row level security;

-- Políticas limpas (apenas is_admin, sem subqueries em profiles)
create policy "profiles_insert_own"
  on public.profiles for insert to authenticated
  with check (auth.uid() = id);

create policy "profiles_select_own_or_admin"
  on public.profiles for select to authenticated
  using (auth.uid() = id or public.is_admin(auth.uid()));

create policy "profiles_update_own_or_admin"
  on public.profiles for update to authenticated
  using (auth.uid() = id or public.is_admin(auth.uid()))
  with check (auth.uid() = id or public.is_admin(auth.uid()));
