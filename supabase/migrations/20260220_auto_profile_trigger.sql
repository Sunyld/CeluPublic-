-- =============================================================================
-- 20260220_auto_profile_trigger.sql
-- CeluPublic — Automatic profile creation on signup to avoid client-side RLS issues.
-- =============================================================================

-- 1) Function to handle new user creation from auth.users
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer 
set search_path = public, auth
as $$
declare
  is_admin_email boolean;
begin
  -- Check if user is the hardcoded admin
  is_admin_email := lower(new.email) = lower('sunyldjosesomailamatapa@gmail.com');

  insert into public.profiles (
    id, 
    full_name, 
    email, 
    role, 
    status,
    created_at,
    updated_at
  )
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    lower(new.email),
    case when is_admin_email then 'admin' else 'seller' end,
    case when is_admin_email then 'approved' else 'pending' end,
    now(),
    now()
  )
  on conflict (id) do update
  set
    email = lower(excluded.email),
    full_name = coalesce(excluded.full_name, profiles.full_name),
    role = case when is_admin_email then 'admin' else profiles.role end,
    status = case when is_admin_email then 'approved' else profiles.status end,
    updated_at = now();

  return new;
end;
$$;

-- 2) Create the trigger on auth.users
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 3) Sync existing users (idempotent)
-- This ensures that any user in auth.users that doesn't have a profile yet gets one.
insert into public.profiles (id, full_name, email, role, status, created_at, updated_at)
select 
  id, 
  coalesce(raw_user_meta_data->>'full_name', raw_user_meta_data->>'name', split_part(email, '@', 1)),
  lower(email),
  case when lower(email) = lower('sunyldjosesomailamatapa@gmail.com') then 'admin' else 'seller' end,
  case when lower(email) = lower('sunyldjosesomailamatapa@gmail.com') then 'approved' else 'pending' end,
  now(),
  now()
from auth.users
on conflict (id) do nothing;

-- 4) Update existing admin if necessary
update public.profiles
set role = 'admin', status = 'approved'
where lower(email) = lower('sunyldjosesomailamatapa@gmail.com');
