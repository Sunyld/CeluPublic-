-- Fixups for CeluPublic Supabase schema & storage policies (Phase 4).

-- 1) Restrict public read on admin_settings to safe keys only.
alter table public.admin_settings enable row level security;

drop policy if exists "Public can read admin_settings" on public.admin_settings;

create policy "Public can read safe admin_settings"
  on public.admin_settings for select
  to public
  using (key in ('admin_whatsapp', 'activation_fee_mzn', 'support_email'));


-- 2) Storage policies for ad-images and banner-images buckets.
--    SKIPPED in SQL: "must be owner of table objects" in Supabase SQL Editor.
--    Configure policies manually in Dashboard: Storage → bucket → Policies.
--    See supabase/STORAGE_POLICIES_MANUAL.md for exact expressions.
--
-- (Statements below are commented out so this script runs without 42501.)
--
-- alter table if exists storage.objects enable row level security;
-- drop policy if exists "Public read ad-images" on storage.objects;
-- ... etc: use Dashboard or STORAGE_POLICIES_MANUAL.md

