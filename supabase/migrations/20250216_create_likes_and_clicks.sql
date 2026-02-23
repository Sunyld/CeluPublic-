-- Phase 5: likes + WhatsApp clicks in Supabase (aggregates-only public read).

create table if not exists public.ad_clicks (
  id uuid primary key default gen_random_uuid(),
  ad_id uuid not null references public.ads(id) on delete cascade,
  created_at timestamptz not null default now(),
  type text not null default 'whatsapp' check (type in ('whatsapp')),
  ip_hash text null,
  user_id uuid null references public.profiles(id) on delete set null
);

create index if not exists ad_clicks_ad_id_idx on public.ad_clicks(ad_id);
create index if not exists ad_clicks_created_at_idx on public.ad_clicks(created_at);

create table if not exists public.ad_likes (
  ad_id uuid not null references public.ads(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (ad_id, user_id)
);

create index if not exists ad_likes_ad_id_idx on public.ad_likes(ad_id);
create index if not exists ad_likes_user_id_idx on public.ad_likes(user_id);

alter table public.ad_clicks enable row level security;
alter table public.ad_likes enable row level security;

drop policy if exists "Public insert ad_clicks" on public.ad_clicks;
create policy "Public insert ad_clicks"
  on public.ad_clicks for insert
  to public
  with check (
    user_id is null
    or (
      user_id = auth.uid()
      and not exists (
        select 1 from public.ad_clicks c
        where c.ad_id = ad_clicks.ad_id
          and c.user_id = ad_clicks.user_id
          and c.created_at >= (now() - interval '10 seconds')
      )
    )
  );

drop policy if exists "Users can select own ad_likes" on public.ad_likes;
create policy "Users can select own ad_likes"
  on public.ad_likes for select
  to authenticated
  using (user_id = auth.uid());

drop policy if exists "Users can insert ad_likes" on public.ad_likes;
create policy "Users can insert ad_likes"
  on public.ad_likes for insert
  to authenticated
  with check (user_id = auth.uid());

drop policy if exists "Users can delete ad_likes" on public.ad_likes;
create policy "Users can delete ad_likes"
  on public.ad_likes for delete
  to authenticated
  using (user_id = auth.uid());

-- Drop views first (cannot change columns with CREATE OR REPLACE)
drop view if exists public.ad_click_counts_7d;
drop view if exists public.ad_click_counts_all;
drop view if exists public.ad_like_counts;

create view public.ad_like_counts as
select ad_id, count(*)::bigint as likes_count
from public.ad_likes
group by ad_id;

create view public.ad_click_counts_7d as
select ad_id, count(*)::bigint as clicks_7d
from public.ad_clicks
where created_at >= (now() - interval '7 days')
group by ad_id;

create view public.ad_click_counts_all as
select ad_id, count(*)::bigint as clicks_total
from public.ad_clicks
group by ad_id;

grant select on public.ad_like_counts to anon, authenticated;
grant select on public.ad_click_counts_7d to anon, authenticated;
grant select on public.ad_click_counts_all to anon, authenticated;

