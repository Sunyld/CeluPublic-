
-- CeluPublic: Remove views counter and ad_views table
-- Revert changes from 20260717_add_ads_views_and_category_icon_suggestions.sql

-- 1) Drop the increment_ad_view function
drop function if exists public.increment_ad_view(uuid, text, text, text);

-- 2) Drop the ad_views table and all related objects
drop table if exists public.ad_views cascade;

-- 3) Drop views column from ads table
alter table public.ads 
drop column if exists views;

-- 4) Drop the ads_views_idx index
drop index if exists public.ads_views_idx;
