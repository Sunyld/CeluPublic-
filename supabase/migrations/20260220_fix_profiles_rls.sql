-- =============================================================================
-- 20260220_fix_profiles_rls.sql
-- CeluPublic — Fix DEFINITIVO de RLS em public.profiles (Sem Recursão)
-- =============================================================================

-- 1) Limpeza: Drop de policies e funções antigas (Idempotente)
do $$
declare pol record;
begin
  for pol in
    select policyname from pg_policies
    where schemaname = 'public' and tablename = 'profiles'
  loop
    execute format('drop policy if exists %I on public.profiles;', pol.policyname);
  end loop;
end $$;

drop function if exists public.is_admin(uuid);

-- 2) Função is_admin segura (SECURITY DEFINER)
-- Acessa auth.users para evitar selecionar public.profiles (evita recursão 42P17)
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
  select lower(email) into user_email
  from auth.users
  where id = uid;

  return lower(trim(coalesce(user_email, ''))) in (
    lower('sunyldjosesomailamatapa@gmail.com')
  );
end;
$$;

grant execute on function public.is_admin(uuid) to authenticated;

-- 3) Garantir RLS habilitado
alter table public.profiles enable row level security;

-- 4) Criar novas Policies (Lógica SaaS)

-- SELECT: Próprio usuário ou Admin
create policy profiles_select_own on public.profiles
  for select to authenticated
  using (auth.uid() = id or public.is_admin(auth.uid()));

-- INSERT: Próprio usuário ou Admin
-- Nota: O route handler API usará service_role, ignorando RLS. 
-- Mas permitimos aqui para flexibilidade se o client quiser tentar.
create policy profiles_insert_own on public.profiles
  for insert to authenticated
  with check (auth.uid() = id or public.is_admin(auth.uid()));

-- UPDATE: Próprio usuário ou Admin
create policy profiles_update_own on public.profiles
  for update to authenticated
  using (auth.uid() = id or public.is_admin(auth.uid()))
  with check (auth.uid() = id or public.is_admin(auth.uid()));

-- DELETE: Apenas Admin
create policy profiles_delete_admin on public.profiles
  for delete to authenticated
  using (public.is_admin(auth.uid()));

-- 5) Sync Admin (Garante que o admin tem o perfil correto se já logou antes)
insert into public.profiles (id, full_name, email, role, status, account_type, created_at, updated_at)
select 
  id, 
  coalesce(raw_user_meta_data->>'full_name', raw_user_meta_data->>'name', split_part(email, '@', 1)),
  lower(email),
  'admin',
  'approved',
  'seller',
  now(),
  now()
from auth.users
where lower(email) = lower('sunyldjosesomailamatapa@gmail.com')
on conflict (id) do update
set 
  role = 'admin', 
  status = 'approved',
  updated_at = now();
