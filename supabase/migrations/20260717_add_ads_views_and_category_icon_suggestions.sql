
-- CeluPublic: Add views counter to ads, ad_views table for fraud prevention, and category icon suggestions
-- Apply after existing migrations

-- 1) Add views column to ads table
alter table public.ads 
add column if not exists views int not null default 0;

-- Index for views to optimize most viewed queries
create index if not exists ads_views_idx on public.ads(views desc);

-- 2) Create ad_views table to track unique views per visitor
create table if not exists public.ad_views (
  id uuid primary key default gen_random_uuid(),
  ad_id uuid not null references public.ads(id) on delete cascade,
  visitor_identifier text not null,
  ip text null,
  user_agent text null,
  created_at timestamptz not null default now(),
  view_date date not null default current_date
);

-- Unique constraint to prevent duplicates within 24 hours (using view_date which is immutable)
create unique index if not exists ad_views_unique_per_day_idx 
on public.ad_views(ad_id, visitor_identifier, view_date);

-- Indexes for performance
create index if not exists ad_views_ad_id_idx on public.ad_views(ad_id);
create index if not exists ad_views_visitor_idx on public.ad_views(visitor_identifier);
create index if not exists ad_views_view_date_idx on public.ad_views(view_date);

-- 3) Function to increment ad views atomically
create or replace function public.increment_ad_view(
    p_ad_id uuid, 
    p_visitor_identifier text, 
    p_ip text default null, 
    p_user_agent text default null
)
returns boolean
language plpgsql
as $$
declare
    v_already_viewed boolean;
    v_current_date date := current_date;
begin
    -- Check if visitor already viewed this ad today
    select exists(
        select 1 from public.ad_views 
        where ad_id = p_ad_id 
        and visitor_identifier = p_visitor_identifier 
        and view_date = v_current_date
    ) into v_already_viewed;

    if not v_already_viewed then
        -- Insert the view
        insert into public.ad_views (ad_id, visitor_identifier, ip, user_agent, view_date)
        values (p_ad_id, p_visitor_identifier, p_ip, p_user_agent, v_current_date);

        -- Increment the view counter on ads table
        update public.ads 
        set views = views + 1 
        where id = p_ad_id;

        return true;
    end if;

    return false;
end;
$$;

-- RLS for ad_views
alter table public.ad_views enable row level security;

-- Public: can call increment_ad_view (via function, no direct access to table needed)
-- Admin: full access
create policy "Admin can read all ad_views"
    on public.ad_views for select
    using (
        exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
    );

comment on table public.ad_views is 'Tracks unique ad views per visitor per day to prevent fraud.';
comment on column public.ads.views is 'Total views counter for the ad.';
comment on column public.ad_views.view_date is 'Date of the view (used for unique constraint per day).';
comment on function public.increment_ad_view is 'Atomically increments ad views and records a unique view per visitor per day.';
