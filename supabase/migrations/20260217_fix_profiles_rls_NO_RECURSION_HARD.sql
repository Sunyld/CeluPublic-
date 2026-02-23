-- 20260217: HARD FIX - Remove RLS recursion (42P17) on public.profiles
-- Idempotent: safe to run multiple times.
-- CRITICAL RULE: No policy or helper used by policies may reference public.profiles.

-- ---------------------------------------------------------------------------
-- 1) Drop ALL existing policies on public.profiles (by querying pg_policies)
-- ---------------------------------------------------------------------------
do $$
declare
  pol record;
begin
  for pol in
    select policyname
    from pg_policies
    where schemaname = 'public'
      and tablename = 'profiles'
  loop
    execute format('drop policy if exists %I on public.profiles;', pol.policyname);
  end loop;
end $$;

-- ---------------------------------------------------------------------------
-- 2) Drop old helper functions (if any)
-- ---------------------------------------------------------------------------
drop function if exists public.is_admin(uuid);
drop function if exists public.is_admin_by_email(text);
drop function if exists public.is_admin();
drop function if exists public.is_admin_by_email();

-- ---------------------------------------------------------------------------
-- 3) Create safe admin helpers (NO public.profiles access)
-- ---------------------------------------------------------------------------
create or replace function public.is_admin_by_email(user_email text)
returns boolean
language sql
stable
as $$
  select lower(trim(coalesce(user_email, ''))) in (
    lower('sunyldjosesomailamatapa@gmail.com')
  );
$$;

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
  -- Read email from auth.users (no RLS; avoids recursion)
  select lower(email) into user_email
  from auth.users
  where id = uid;

  return public.is_admin_by_email(coalesce(user_email, ''));
end;
$$;

-- Permissions: callable by anon/authenticated (function itself is safe)
revoke all on function public.is_admin(uuid) from public;
revoke all on function public.is_admin_by_email(text) from public;
grant execute on function public.is_admin(uuid) to anon, authenticated;
grant execute on function public.is_admin_by_email(text) to anon, authenticated;

-- ---------------------------------------------------------------------------
-- 4) Ensure RLS enabled
-- ---------------------------------------------------------------------------
alter table public.profiles enable row level security;

-- ---------------------------------------------------------------------------
-- 5) Recreate minimal safe policies (no public.profiles references)
-- ---------------------------------------------------------------------------
drop policy if exists profiles_select_own_or_admin on public.profiles;
create policy profiles_select_own_or_admin
on public.profiles
for select
to authenticated
using (
  auth.uid() = id
  or public.is_admin(auth.uid())
);

drop policy if exists profiles_insert_own_or_admin on public.profiles;
create policy profiles_insert_own_or_admin
on public.profiles
for insert
to authenticated
with check (
  auth.uid() = id
  or public.is_admin(auth.uid())
);

drop policy if exists profiles_update_own_or_admin on public.profiles;
create policy profiles_update_own_or_admin
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

drop policy if exists profiles_delete_admin_only on public.profiles;
create policy profiles_delete_admin_only
on public.profiles
for delete
to authenticated
using (
  public.is_admin(auth.uid())
);

-- ---------------------------------------------------------------------------
-- 6) Ensure/admin upsert (idempotent) from auth.users by email (admin)
-- ---------------------------------------------------------------------------
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
on conflict (id) do update
set
  full_name = excluded.full_name,
  email = excluded.email,
  role = 'admin',
  status = 'approved',
  updated_at = now()
where lower(excluded.email) = lower('sunyldjosesomailamatapa@gmail.com');

-- ---------------------------------------------------------------------------
-- 7) Validation (run manually in SQL Editor)
-- ---------------------------------------------------------------------------
-- select * from pg_policies where schemaname='public' and tablename='profiles';
-- select id, email from auth.users where email ilike 'sunyldjosesomailamatapa@gmail.com';

