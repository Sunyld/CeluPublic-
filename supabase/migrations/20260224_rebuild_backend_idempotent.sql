-- =============================================================================
-- 20260224_rebuild_backend_idempotent.sql
-- Garante schema, backfill e consistência. NÃO dropa tabelas (preserva dados).
-- 100% idempotente: pode rodar múltiplas vezes.
-- =============================================================================

-- 1) Garantir coluna updated_at em banners (se não existir)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'banners' AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE public.banners ADD COLUMN updated_at timestamptz NOT NULL DEFAULT now();
  END IF;
END $$;

-- 2) Backfill seller_requests (profiles pendentes sem request)
INSERT INTO public.seller_requests (user_id, status)
SELECT p.id, 'pending'
FROM public.profiles p
LEFT JOIN public.seller_requests sr ON sr.user_id = p.id
WHERE p.status = 'pending'
  AND (p.role IS NULL OR p.role != 'admin')
  AND sr.user_id IS NULL
ON CONFLICT (user_id) DO NOTHING;

-- 3) Garantir ad_click_counts views (clicks_total + clicks_7d)
DROP VIEW IF EXISTS public.ad_click_counts_7d CASCADE;
DROP VIEW IF EXISTS public.ad_click_counts_all CASCADE;

CREATE VIEW public.ad_click_counts_all AS
SELECT
  ad_id,
  COUNT(*)::bigint AS clicks_total,
  COUNT(*) FILTER (WHERE created_at >= (now() - interval '7 days'))::bigint AS clicks_7d
FROM public.ad_clicks
GROUP BY ad_id;

CREATE VIEW public.ad_click_counts_7d AS
SELECT
  ad_id,
  COUNT(*)::bigint AS clicks_total,
  COUNT(*)::bigint AS clicks_7d
FROM public.ad_clicks
WHERE created_at >= (now() - interval '7 days')
GROUP BY ad_id;

GRANT SELECT ON public.ad_click_counts_all TO anon, authenticated;
GRANT SELECT ON public.ad_click_counts_7d TO anon, authenticated;
