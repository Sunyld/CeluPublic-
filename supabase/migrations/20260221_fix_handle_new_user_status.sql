-- =============================================================================
-- 20260221_fix_handle_new_user_status.sql
-- Fix "Database error saving new user": profiles.status only allows
-- ('pending', 'approved', 'rejected', 'blocked', 'suspended').
-- Trigger must use 'pending' for new users, not 'pending_payment'.
-- =============================================================================

drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user() cascade;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  is_admin_email boolean;
begin
  is_admin_email := lower(new.email) in (
    'sunyldjosesomailamatapa@gmail.com',
    'celupublic@gmail.com'
  );

  insert into public.profiles (
    id,
    full_name,
    email,
    role,
    status,
    account_type,
    created_at,
    updated_at
  )
  values (
    new.id,
    coalesce(
      new.raw_user_meta_data->>'full_name',
      new.raw_user_meta_data->>'name',
      split_part(new.email, '@', 1),
      'Utilizador'
    ),
    lower(new.email),
    case when is_admin_email then 'admin' else 'seller' end,
    case when is_admin_email then 'approved' else 'pending' end,
    'seller',
    now(),
    now()
  )
  on conflict (id) do update set
    email = lower(excluded.email),
    full_name = coalesce(excluded.full_name, profiles.full_name),
    role = case when is_admin_email then 'admin' else profiles.role end,
    status = case when is_admin_email then 'approved' else profiles.status end,
    updated_at = now();

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

comment on function public.handle_new_user() is 'Creates/updates profile on signup. Uses status pending/approved only (no pending_payment).';
