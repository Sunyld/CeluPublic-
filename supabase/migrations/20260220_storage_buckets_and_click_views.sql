-- CeluPublic: storage buckets (ad-images, banner-images) + RLS policies + click views fix.
-- Execute depois das migrations de profiles, ads/images e likes/clicks.
-- Pode ser executado em segurança várias vezes (idempotente).

-- 1) Criar buckets de Storage (se ainda não existirem)
insert into storage.buckets (id, name, public)
values
  ('ad-images', 'ad-images', true),
  ('banner-images', 'banner-images', true)
on conflict (id) do nothing;

-- 2) Ajustar views de cliques para expor SEMPRE as colunas:
--    ad_id, clicks_total, clicks_7d
-- Isto evita erros 400 no PostgREST quando o frontend faz:
--   /rest/v1/ad_click_counts_all?select=ad_id,clicks_total,clicks_7d

-- Primeiro removemos as views antigas (se existirem) para evitar conflitos de rename.
drop view if exists public.ad_click_counts_7d;
drop view if exists public.ad_click_counts_all;

create or replace view public.ad_click_counts_7d as
select
  ad_id,
  null::bigint as clicks_total,
  count(*)::bigint as clicks_7d
from public.ad_clicks
where created_at >= (now() - interval '7 days')
group by ad_id;

create or replace view public.ad_click_counts_all as
select
  ad_id,
  count(*)::bigint as clicks_total,
  null::bigint as clicks_7d
from public.ad_clicks
group by ad_id;

grant select on public.ad_click_counts_7d to anon, authenticated;
grant select on public.ad_click_counts_all to anon, authenticated;

