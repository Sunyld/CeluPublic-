-- CeluPublic: seed admin profile and default settings (idempotent).
-- Admin = user with email celupublic@gmail.com (must exist in auth.users after first sign-up).

-- Ensure admin profile exists for the configured admin email (from auth.users)
insert into public.profiles (id, full_name, email, role, status, account_type, created_at, updated_at)
select
  u.id,
  coalesce(u.raw_user_meta_data->>'full_name', u.raw_user_meta_data->>'name', split_part(u.email, '@', 1), 'Admin'),
  lower(u.email),
  'admin',
  'approved',
  'seller',
  now(),
  now()
from auth.users u
where public.is_admin_by_email(u.email)
  and not exists (select 1 from public.profiles p where p.id = u.id)
on conflict (id) do update set
  role = 'admin',
  status = 'approved',
  email = excluded.email,
  full_name = coalesce(public.profiles.full_name, excluded.full_name),
  updated_at = now();

-- Default admin_settings (contact + activation fee)
insert into public.admin_settings (key, value, updated_at)
values
  ('admin_whatsapp', '{"number":"+258 87 833 0517","raw":"258878330517"}'::jsonb, now()),
  ('support_email', '"celupublic@gmail.com"'::jsonb, now()),
  ('activation_fee_mzn', '{"amount":20}'::jsonb, now())
on conflict (key) do update set
  value = excluded.value,
  updated_at = now();
