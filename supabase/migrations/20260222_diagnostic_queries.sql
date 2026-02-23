-- =============================================================================
-- 20260222_diagnostic_queries.sql
-- Queries de diagnóstico para executar ANTES e DEPOIS da migration
-- Execute estas queries no Supabase SQL Editor para validar o estado do banco
-- =============================================================================

-- A) Existe tabela?
SELECT to_regclass('public.seller_requests') as seller_requests_exists;
SELECT to_regclass('public.profiles') as profiles_exists;

-- B) Quantos registros existem?
SELECT COUNT(*) as seller_requests_total FROM public.seller_requests;
SELECT status, COUNT(*) FROM public.seller_requests GROUP BY status;
SELECT role, status, COUNT(*) FROM public.profiles GROUP BY role, status;

-- C) As requests estão sendo criadas para o user novo?
SELECT sr.*, p.email, p.full_name, p.role, p.status
FROM public.seller_requests sr
JOIN public.profiles p ON p.id = sr.user_id
ORDER BY sr.created_at DESC LIMIT 20;

-- D) Admin é admin mesmo?
-- IMPORTANTE: Execute esta query autenticado como admin no Supabase Dashboard
SELECT public.is_admin(auth.uid()) as is_admin_check;
SELECT id, email, role, status FROM public.profiles WHERE email ILIKE '%sunyldjosesomailamatapa@gmail.com%';

-- E) Trigger existe e está disparando?
SELECT tgname, tgrelid::regclass, tgenabled, tgisinternal
FROM pg_trigger
WHERE tgname ILIKE '%seller%' OR tgrelid::regclass = 'public.profiles'::regclass
ORDER BY tgname;

-- F) Verificar RLS policies:
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename IN ('profiles', 'seller_requests')
ORDER BY tablename, policyname;
