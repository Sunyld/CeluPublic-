-- =============================================================================
-- 20260223_fix_seller_requests_creation.sql
-- FIX DEFINITIVO: seller_requests não está sendo criado no primeiro login
-- 
-- PROBLEMA IDENTIFICADO:
-- - Admin consegue consultar seller_requests (RLS OK)
-- - Mas seller_requests está VAZIO (count = 0)
-- - Trigger não está criando registros automaticamente
-- 
-- CAUSA RAIZ:
-- 1. Trigger pode não estar disparando corretamente
-- 2. Função ensure_seller_request pode ter condição muito restritiva
-- 3. /api/profile/ensure pode não estar fazendo upsert corretamente
-- 
-- SOLUÇÃO:
-- 1. Trigger simplificado: dispara para QUALQUER status='pending' (sem depender de role)
-- 2. Função ensure_seller_request() idempotente e robusta
-- 3. Backfill para profiles pendentes existentes
-- 4. Garantir RLS permite inserção via trigger (SECURITY DEFINER)
-- 
-- 100% IDEMPOTENTE: pode rodar múltiplas vezes sem erro.
-- =============================================================================

-- =============================================================================
-- FASE 0: QUERIES DE DIAGNÓSTICO (executar ANTES da migration)
-- =============================================================================
-- Execute estas queries no Supabase SQL Editor para diagnosticar:
--
-- 1) Tabela existe?
-- SELECT to_regclass('public.seller_requests') as seller_requests_exists;
--
-- 2) Quantidade atual:
-- SELECT COUNT(*) as total_requests FROM public.seller_requests;
--
-- 3) Perfis pendentes:
-- SELECT status, role, COUNT(*) as count
-- FROM public.profiles
-- GROUP BY status, role
-- ORDER BY status, role;
--
-- 4) Verificar se existe pedido para profiles pendentes:
-- SELECT p.id, p.email, p.status, p.role, sr.status as request_status, sr.id as request_id
-- FROM public.profiles p
-- LEFT JOIN public.seller_requests sr ON sr.user_id = p.id
-- WHERE p.status = 'pending'
-- ORDER BY p.created_at DESC
-- LIMIT 50;
-- =============================================================================

-- =============================================================================
-- FASE 1: CORREÇÃO SQL DEFINITIVA
-- =============================================================================

-- A) Garantir tabela seller_requests existe com schema correto
CREATE TABLE IF NOT EXISTS public.seller_requests (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    amount_mzn numeric DEFAULT 20,
    payment_method text,
    payment_reference text,
    note text,
    reviewed_by uuid REFERENCES auth.users(id),
    reviewed_at timestamptz,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

-- Garantir FK para profiles (REQUIRED para PostgREST embed)
ALTER TABLE public.seller_requests
    DROP CONSTRAINT IF EXISTS seller_requests_user_id_fkey;

ALTER TABLE public.seller_requests
    DROP CONSTRAINT IF EXISTS seller_requests_user_id_fkey_profiles;

ALTER TABLE public.seller_requests
    ADD CONSTRAINT seller_requests_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- Unique constraint: one request per user
-- Drop constraint if exists (idempotent)
ALTER TABLE public.seller_requests
    DROP CONSTRAINT IF EXISTS seller_requests_user_id_key;

-- Drop index if exists (pode existir como índice único)
DROP INDEX IF EXISTS public.seller_requests_user_id_key;

-- Create unique index (which creates constraint automatically)
-- PostgreSQL não suporta CREATE UNIQUE INDEX IF NOT EXISTS, então usamos DO block
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_indexes 
        WHERE schemaname = 'public' 
        AND tablename = 'seller_requests' 
        AND indexname = 'seller_requests_user_id_key'
    ) THEN
        CREATE UNIQUE INDEX seller_requests_user_id_key ON public.seller_requests (user_id);
    END IF;
END $$;

-- Indexes para queries admin
CREATE INDEX IF NOT EXISTS seller_requests_status_idx ON public.seller_requests (status);
CREATE INDEX IF NOT EXISTS seller_requests_created_at_idx ON public.seller_requests (created_at DESC);
CREATE INDEX IF NOT EXISTS seller_requests_user_id_idx ON public.seller_requests (user_id);
CREATE INDEX IF NOT EXISTS seller_requests_status_created_at_idx ON public.seller_requests (status, created_at DESC);

-- B) Função ensure_seller_request() - SIMPLIFICADA e ROBUSTA
DROP FUNCTION IF EXISTS public.ensure_seller_request() CASCADE;
DROP FUNCTION IF EXISTS public.ensure_seller_request(uuid) CASCADE;

-- Função como trigger (retorna TRIGGER)
CREATE OR REPLACE FUNCTION public.ensure_seller_request()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
BEGIN
    -- CORREÇÃO: Criar seller_request para QUALQUER profile pendente que NÃO seja admin
    -- Não depende de role='seller' - cria para qualquer role != 'admin' ou NULL
    IF NEW.status = 'pending' AND (NEW.role IS NULL OR NEW.role != 'admin') THEN
        INSERT INTO public.seller_requests (user_id, status)
        VALUES (NEW.id, 'pending')
        ON CONFLICT (user_id) DO UPDATE
        SET status = 'pending',
            updated_at = now()
        WHERE seller_requests.status != 'pending';
    END IF;
    RETURN NEW;
END;
$$;

COMMENT ON FUNCTION public.ensure_seller_request() IS 'Auto-creates seller_request when profile is created/updated to pending status (any role except admin). Trigger function.';

-- Função standalone para chamar manualmente (opcional, para debug)
CREATE OR REPLACE FUNCTION public.ensure_seller_request(p_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
BEGIN
    INSERT INTO public.seller_requests (user_id, status)
    VALUES (p_user_id, 'pending')
    ON CONFLICT (user_id) DO NOTHING;
END;
$$;

COMMENT ON FUNCTION public.ensure_seller_request(uuid) IS 'Manually ensure seller_request exists for a user_id. Standalone function for debugging.';

-- C) Trigger CORRIGIDO: dispara para QUALQUER status='pending'
DROP TRIGGER IF EXISTS tr_ensure_seller_request ON public.profiles;
DROP TRIGGER IF EXISTS ensure_seller_request_trigger ON public.profiles;

CREATE TRIGGER tr_ensure_seller_request
    AFTER INSERT OR UPDATE OF status, role ON public.profiles
    FOR EACH ROW
    -- CORREÇÃO CRÍTICA: Remove dependência de role, só verifica status='pending'
    WHEN (NEW.status = 'pending')
    EXECUTE FUNCTION public.ensure_seller_request();

-- D) RLS para seller_requests (idempotent)
ALTER TABLE public.seller_requests ENABLE ROW LEVEL SECURITY;

-- Drop ALL existing policies (idempotent - lista completa)
DROP POLICY IF EXISTS "Admin see all requests" ON public.seller_requests;
DROP POLICY IF EXISTS "User see own request" ON public.seller_requests;
DROP POLICY IF EXISTS "User create own request" ON public.seller_requests;
DROP POLICY IF EXISTS "Admin update requests" ON public.seller_requests;
DROP POLICY IF EXISTS "Admin delete requests" ON public.seller_requests;
DROP POLICY IF EXISTS "seller_req_select" ON public.seller_requests;
DROP POLICY IF EXISTS "seller_req_insert" ON public.seller_requests;
DROP POLICY IF EXISTS "seller_req_admin" ON public.seller_requests;
DROP POLICY IF EXISTS "Users can view own requests" ON public.seller_requests;
DROP POLICY IF EXISTS "Users can insert own requests" ON public.seller_requests;
DROP POLICY IF EXISTS "Admin can update requests" ON public.seller_requests;
DROP POLICY IF EXISTS "Admin can delete requests" ON public.seller_requests;

-- Create policies
CREATE POLICY "Admin see all requests"
    ON public.seller_requests FOR SELECT TO authenticated
    USING (public.is_admin(auth.uid()));

CREATE POLICY "User see own request"
    ON public.seller_requests FOR SELECT TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "User create own request"
    ON public.seller_requests FOR INSERT TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admin update requests"
    ON public.seller_requests FOR UPDATE TO authenticated
    USING (public.is_admin(auth.uid()))
    WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admin delete requests"
    ON public.seller_requests FOR DELETE TO authenticated
    USING (public.is_admin(auth.uid()));

-- IMPORTANTE: Permitir inserção via trigger (SECURITY DEFINER bypassa RLS)
-- Mas precisamos garantir que o trigger funcione mesmo com RLS ativo
-- A função usa SECURITY DEFINER, então bypassa RLS automaticamente

-- E) RLS para profiles (garantir que está correto)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop policies existentes (idempotent)
DROP POLICY IF EXISTS "profiles_select_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_select_admin" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_admin" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;
DROP POLICY IF EXISTS "profile_select" ON public.profiles;
DROP POLICY IF EXISTS "profile_update" ON public.profiles;

-- Create policies
CREATE POLICY "profiles_select_own"
    ON public.profiles FOR SELECT TO authenticated
    USING (auth.uid() = id);

CREATE POLICY "profiles_insert_own"
    ON public.profiles FOR INSERT TO authenticated
    WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_update_own"
    ON public.profiles FOR UPDATE TO authenticated
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_select_admin"
    ON public.profiles FOR SELECT TO authenticated
    USING (public.is_admin(auth.uid()));

CREATE POLICY "profiles_update_admin"
    ON public.profiles FOR UPDATE TO authenticated
    USING (public.is_admin(auth.uid()))
    WITH CHECK (public.is_admin(auth.uid()));

-- F) Trigger updated_at para seller_requests
DROP TRIGGER IF EXISTS tr_seller_requests_updated_at ON public.seller_requests;
DROP TRIGGER IF EXISTS seller_requests_updated_at ON public.seller_requests;
CREATE TRIGGER tr_seller_requests_updated_at
    BEFORE UPDATE ON public.seller_requests
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- G) BACKFILL OBRIGATÓRIO: cria seller_requests para TODOS os profiles pendentes existentes
-- Não depende de role='seller', cria para qualquer role != 'admin'
INSERT INTO public.seller_requests (user_id, status)
SELECT p.id, 'pending'
FROM public.profiles p
LEFT JOIN public.seller_requests sr ON sr.user_id = p.id
WHERE p.status = 'pending'
    AND (p.role IS NULL OR p.role != 'admin')
    AND sr.user_id IS NULL
ON CONFLICT (user_id) DO NOTHING;

-- Comments
COMMENT ON TABLE public.seller_requests IS 'Activation requests: auto-created when profile.status=pending (any role except admin). user_id -> profiles.id for PostgREST embed.';

-- =============================================================================
-- FASE 3: QUERIES DE AUDITORIA FINAL (executar DEPOIS da migration)
-- =============================================================================
-- Execute estas queries no Supabase SQL Editor para validar:
--
-- 1) Verificar contagens após migration:
-- SELECT COUNT(*) as total_requests FROM public.seller_requests;
-- SELECT status, COUNT(*) FROM public.seller_requests GROUP BY status;
-- SELECT role, status, COUNT(*) FROM public.profiles GROUP BY role, status;
--
-- 2) Verificar JOIN funciona:
-- SELECT sr.*, p.email, p.full_name, p.role, p.status
-- FROM public.seller_requests sr
-- JOIN public.profiles p ON p.id = sr.user_id
-- ORDER BY sr.created_at DESC LIMIT 10;
--
-- 3) Verificar trigger existe:
-- SELECT tgname, tgrelid::regclass, tgenabled, tgisinternal
-- FROM pg_trigger
-- WHERE tgname = 'tr_ensure_seller_request';
--
-- 4) Verificar profiles pendentes têm request:
-- SELECT p.id, p.email, p.status, p.role, sr.id as request_id, sr.status as request_status
-- FROM public.profiles p
-- LEFT JOIN public.seller_requests sr ON sr.user_id = p.id
-- WHERE p.status = 'pending'
-- ORDER BY p.created_at DESC;
-- =============================================================================
