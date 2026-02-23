-- Fix RLS recursion (42P17) in public.profiles - HARD FIX
-- This migration completely removes recursive policies and creates a safe admin check function.
-- Idempotent: safe to run multiple times.

-- Step 1: Drop ALL existing policies on profiles (prevent any recursion)
drop policy if exists "profiles: insert own" on public.profiles;
drop policy if exists "profiles: select own or admin" on public.profiles;
drop policy if exists "profiles: update own or admin" on public.profiles;
drop policy if exists "Public can read profiles" on public.profiles;
drop policy if exists "Users can read own profile" on public.profiles;
drop policy if exists "Users can update own profile" on public.profiles;
drop policy if exists "Admin can read all profiles" on public.profiles;
drop policy if exists "Admin can update profiles" on public.profiles;
drop policy if exists "profiles: users can insert own" on public.profiles;
drop policy if exists "profiles: users can select own" on public.profiles;
drop policy if exists "profiles: users can update own" on public.profiles;
-- Names used by 0004 or other migrations
drop policy if exists "profiles_insert_own" on public.profiles;
drop policy if exists "profiles_select_own_or_admin" on public.profiles;
drop policy if exists "profiles_update_own_or_admin" on public.profiles;

-- Step 2: Create a SECURITY DEFINER function that checks admin by email WITHOUT querying profiles
-- This function reads directly from auth.users to avoid RLS recursion
create or replace function public.is_admin_by_email(user_email text)
returns boolean
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  admin_email text := 'sunyldjosesomailamatapa@gmail.com';
begin
  -- Compare emails case-insensitively
  return lower(trim(user_email)) = lower(trim(admin_email));
end;
$$;

-- Step 3: Create a SECURITY DEFINER function that checks if current user is admin
-- Uses auth.uid() and checks email from auth.users (bypasses RLS)
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
  -- Get email directly from auth.users (no RLS on auth schema)
  select lower(email) into user_email
  from auth.users
  where id = uid;
  
  -- Check if email matches admin email (case-insensitive)
  return public.is_admin_by_email(coalesce(user_email, ''));
end;
$$;

-- Grant execute permissions
revoke all on function public.is_admin(uuid) from public;
revoke all on function public.is_admin_by_email(text) from public;
grant execute on function public.is_admin(uuid) to anon, authenticated;
grant execute on function public.is_admin_by_email(text) to anon, authenticated;

-- Step 4: Ensure RLS is enabled
alter table public.profiles enable row level security;

-- Step 5: Create minimal policies WITHOUT recursion
-- INSERT: authenticated users can insert their own profile
create policy "profiles_insert_own"
on public.profiles
for insert
to authenticated
with check (auth.uid() = id);

-- SELECT: users can read own profile OR admin can read all (using function, not subquery)
create policy "profiles_select_own_or_admin"
on public.profiles
for select
to authenticated
using (
  auth.uid() = id 
  or public.is_admin(auth.uid())
);

-- UPDATE: users can update own profile OR admin can update any (using function, not subquery)
create policy "profiles_update_own_or_admin"
on public.profiles
for update
to authenticated
using (
  auth.uid() = id 
  or public.is_admin(auth.uid())
)
with check (
  auth.uid() = id 
  or public.is_admin(auth.uid())
);

-- Step 6: Ensure admin profile exists (if user exists in auth.users)
-- This is idempotent (on conflict do nothing)
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
  and not exists (
    select 1 from public.profiles p where p.id = u.id
  )
on conflict (id) do update
set role = 'admin',
    status = 'approved',
    email = excluded.email,
    updated_at = now()
where lower(excluded.email) = lower('sunyldjosesomailamatapa@gmail.com');
