-- =============================================================================
-- 20260222_fix_ad_click_counts_views.sql
-- Fix 400 Bad Request: ad_click_counts_all must have columns clicks_total AND clicks_7d.
-- Code expects: select('ad_id, clicks_total, clicks_7d')
-- Current views have nulls or missing columns.
-- 100% idempotent.
-- =============================================================================

-- 1) Ensure ad_clicks table exists (from 20250216_create_likes_and_clicks.sql)
CREATE TABLE IF NOT EXISTS public.ad_clicks (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    ad_id uuid NOT NULL REFERENCES public.ads(id) ON DELETE CASCADE,
    created_at timestamptz NOT NULL DEFAULT now(),
    type text NOT NULL DEFAULT 'whatsapp' CHECK (type IN ('whatsapp')),
    ip_hash text NULL,
    user_id uuid NULL REFERENCES public.profiles(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS ad_clicks_ad_id_idx ON public.ad_clicks(ad_id);
CREATE INDEX IF NOT EXISTS ad_clicks_created_at_idx ON public.ad_clicks(created_at);

-- 2) Drop existing views (must drop before recreating with different columns)
DROP VIEW IF EXISTS public.ad_click_counts_7d CASCADE;
DROP VIEW IF EXISTS public.ad_click_counts_all CASCADE;

-- 3) Create ad_click_counts_all with BOTH columns (clicks_total AND clicks_7d)
-- This matches what the code expects: select('ad_id, clicks_total, clicks_7d')
CREATE VIEW public.ad_click_counts_all AS
SELECT
    ad_id,
    COUNT(*)::bigint AS clicks_total,
    COUNT(*) FILTER (WHERE created_at >= (now() - interval '7 days'))::bigint AS clicks_7d
FROM public.ad_clicks
GROUP BY ad_id;

-- 4) Create ad_click_counts_7d with BOTH columns (for consistency)
CREATE VIEW public.ad_click_counts_7d AS
SELECT
    ad_id,
    COUNT(*)::bigint AS clicks_total,
    COUNT(*) FILTER (WHERE created_at >= (now() - interval '7 days'))::bigint AS clicks_7d
FROM public.ad_clicks
WHERE created_at >= (now() - interval '7 days')
GROUP BY ad_id;

-- 5) Grant SELECT to anon and authenticated (public read for marketplace metrics)
GRANT SELECT ON public.ad_click_counts_all TO anon, authenticated;
GRANT SELECT ON public.ad_click_counts_7d TO anon, authenticated;

COMMENT ON VIEW public.ad_click_counts_all IS 'Click counts per ad: total and last 7 days. Both columns always present for PostgREST select().';
COMMENT ON VIEW public.ad_click_counts_7d IS 'Click counts per ad (last 7 days only). Both columns present for consistency.';
