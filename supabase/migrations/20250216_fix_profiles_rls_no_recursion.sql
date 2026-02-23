-- Fix RLS recursion in public.profiles
-- This migration removes recursive policies that query profiles inside profiles policies.
-- Idempotent: safe to run multiple times.

-- Create SECURITY DEFINER function to check admin status without RLS recursion
create or replace function public.is_admin(uid uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  -- SECURITY DEFINER runs as table owner, bypassing RLS
  -- This avoids recursion when checking admin status inside RLS policies
  select exists (
    select 1
    from public.profiles p
    where p.id = uid and p.role = 'admin'
  );
$$;

-- Ensure function permissions are correct (idempotent)
revoke all on function public.is_admin(uuid) from public;
grant execute on function public.is_admin(uuid) to anon, authenticated;

alter table public.profiles enable row level security;

-- Drop any existing policies that might recurse
drop policy if exists "profiles: insert own" on public.profiles;
drop policy if exists "profiles: select own or admin" on public.profiles;
drop policy if exists "profiles: update own or admin" on public.profiles;
drop policy if exists "Public can read profiles" on public.profiles;
drop policy if exists "Users can read own profile" on public.profiles;
drop policy if exists "Users can update own profile" on public.profiles;
drop policy if exists "Admin can read all profiles" on public.profiles;
drop policy if exists "Admin can update profiles" on public.profiles;

-- INSERT: authenticated can insert own row
create policy "profiles: insert own"
on public.profiles
for insert
to authenticated
with check (auth.uid() = id);

-- SELECT: authenticated reads own; admin reads all (via function, not by querying profiles inside policy)
create policy "profiles: select own or admin"
on public.profiles
for select
to authenticated
using (auth.uid() = id or public.is_admin(auth.uid()));

-- UPDATE: authenticated updates own; admin updates all
create policy "profiles: update own or admin"
on public.profiles
for update
to authenticated
using (auth.uid() = id or public.is_admin(auth.uid()))
with check (auth.uid() = id or public.is_admin(auth.uid()));
