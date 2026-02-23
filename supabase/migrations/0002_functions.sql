-- CeluPublic: helper functions (idempotent).
-- is_admin(uid) reads auth.users — NEVER use profiles to check admin (avoids RLS 42P17).
-- Do NOT drop is_admin/is_admin_by_email — policies depend on them. Use CREATE OR REPLACE only.

-- Drop only trigger functions (no policy dependencies)
drop function if exists public.set_updated_at() cascade;
drop function if exists public.handle_updated_at() cascade;

-- Admin emails (support = celupublic@gmail.com; add others here if needed)
create or replace function public.is_admin_by_email(user_email text)
returns boolean
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  admin_emails text[] := array[
    'celupublic@gmail.com',
    'sunyldjosesomailamatapa@gmail.com'
  ];
  e text;
begin
  e := lower(trim(coalesce(user_email, '')));
  return e = any(admin_emails);
end;
$$;

-- Check if current user is admin (by auth.uid() -> auth.users.email)
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
  select lower(email) into user_email from auth.users where id = uid;
  return public.is_admin_by_email(coalesce(user_email, ''));
end;
$$;

-- Trigger function: set updated_at
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Alias for compatibility
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

revoke all on function public.is_admin(uuid) from public;
revoke all on function public.is_admin_by_email(text) from public;
grant execute on function public.is_admin(uuid) to anon, authenticated;
grant execute on function public.is_admin_by_email(text) to anon, authenticated;

comment on function public.is_admin(uuid) is 'Returns true if user is admin (by email from auth.users). Use in RLS instead of querying profiles.';
