-- CeluPublic: RLS policies (idempotent).
-- All admin checks use public.is_admin(auth.uid()) — NEVER select from profiles for admin.

-- ----- PROFILES -----
alter table public.profiles enable row level security;

drop policy if exists "profiles_insert_own" on public.profiles;
drop policy if exists "profiles_select_own_or_admin" on public.profiles;
drop policy if exists "profiles_update_own_or_admin" on public.profiles;
drop policy if exists "Users can insert own profile" on public.profiles;
drop policy if exists "Users can read own profile" on public.profiles;
drop policy if exists "Users can update own profile" on public.profiles;
drop policy if exists "Admin can select all profiles" on public.profiles;
drop policy if exists "Admin can update all profiles" on public.profiles;

create policy "profiles_insert_own"
  on public.profiles for insert to authenticated
  with check (auth.uid() = id);

create policy "profiles_select_own_or_admin"
  on public.profiles for select to authenticated
  using (auth.uid() = id or public.is_admin(auth.uid()));

create policy "profiles_update_own_or_admin"
  on public.profiles for update to authenticated
  using (auth.uid() = id or public.is_admin(auth.uid()))
  with check (auth.uid() = id or public.is_admin(auth.uid()));

-- ----- SELLER_REQUESTS -----
alter table public.seller_requests enable row level security;

drop policy if exists "Admin see all requests" on public.seller_requests;
drop policy if exists "User see own request" on public.seller_requests;
drop policy if exists "User create own request" on public.seller_requests;
drop policy if exists "Admin update requests" on public.seller_requests;

create policy "Admin see all requests"
  on public.seller_requests for select to authenticated
  using (public.is_admin(auth.uid()));

create policy "User see own request"
  on public.seller_requests for select to authenticated
  using (auth.uid() = user_id);

create policy "User create own request"
  on public.seller_requests for insert to authenticated
  with check (auth.uid() = user_id);

create policy "Admin update requests"
  on public.seller_requests for update to authenticated
  using (public.is_admin(auth.uid()))
  with check (public.is_admin(auth.uid()));

-- Trigger updated_at
drop trigger if exists tr_seller_requests_updated_at on public.seller_requests;
create trigger tr_seller_requests_updated_at
  before update on public.seller_requests
  for each row execute function public.set_updated_at();

-- ----- ADS -----
alter table public.ads enable row level security;

drop policy if exists "Public read published ads approved owners" on public.ads;
drop policy if exists "Owner select own ads" on public.ads;
drop policy if exists "Owner insert own ads" on public.ads;
drop policy if exists "Owner update own ads" on public.ads;
drop policy if exists "Owner delete own ads" on public.ads;
drop policy if exists "Admin all ads" on public.ads;

-- Public: only published ads whose owner has status approved (join profiles via owner_id)
create policy "Public read published ads approved owners"
  on public.ads for select to anon, authenticated
  using (
    status = 'published'
    and exists (
      select 1 from public.profiles p
      where p.id = ads.owner_id and p.status = 'approved'
    )
  );

create policy "Owner select own ads"
  on public.ads for select to authenticated
  using (auth.uid() = owner_id);

create policy "Owner insert own ads"
  on public.ads for insert to authenticated
  with check (auth.uid() = owner_id);

create policy "Owner update own ads"
  on public.ads for update to authenticated
  using (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);

create policy "Owner delete own ads"
  on public.ads for delete to authenticated
  using (auth.uid() = owner_id);

create policy "Admin all ads"
  on public.ads for all to authenticated
  using (public.is_admin(auth.uid()))
  with check (public.is_admin(auth.uid()));

-- ----- AD_IMAGES -----
alter table public.ad_images enable row level security;

drop policy if exists "Public read images public ads" on public.ad_images;
drop policy if exists "Owner read own ad images" on public.ad_images;
drop policy if exists "Owner insert images own ads" on public.ad_images;
drop policy if exists "Owner delete own ad images" on public.ad_images;
drop policy if exists "Admin all ad_images" on public.ad_images;

create policy "Public read images public ads"
  on public.ad_images for select to anon, authenticated
  using (
    exists (
      select 1 from public.ads a
      join public.profiles p on p.id = a.owner_id
      where a.id = ad_images.ad_id and a.status = 'published' and p.status = 'approved'
    )
  );

create policy "Owner read own ad images"
  on public.ad_images for select to authenticated
  using (exists (select 1 from public.ads a where a.id = ad_images.ad_id and a.owner_id = auth.uid()));

create policy "Owner insert images own ads"
  on public.ad_images for insert to authenticated
  with check (exists (select 1 from public.ads a where a.id = ad_images.ad_id and a.owner_id = auth.uid()));

create policy "Owner delete own ad images"
  on public.ad_images for delete to authenticated
  using (exists (select 1 from public.ads a where a.id = ad_images.ad_id and a.owner_id = auth.uid()));

create policy "Admin all ad_images"
  on public.ad_images for all to authenticated
  using (public.is_admin(auth.uid()))
  with check (public.is_admin(auth.uid()));

-- ----- BANNERS -----
alter table public.banners enable row level security;

drop policy if exists "Public read active banners" on public.banners;
drop policy if exists "Admin all banners" on public.banners;

create policy "Public read active banners"
  on public.banners for select to anon, authenticated
  using (active = true);

create policy "Admin all banners"
  on public.banners for all to authenticated
  using (public.is_admin(auth.uid()))
  with check (public.is_admin(auth.uid()));

-- ----- CATEGORIES -----
alter table public.categories enable row level security;

drop policy if exists "Public read categories" on public.categories;
drop policy if exists "Admin insert categories" on public.categories;
drop policy if exists "Admin update categories" on public.categories;
drop policy if exists "Admin delete categories" on public.categories;

create policy "Public read categories"
  on public.categories for select to anon, authenticated
  using (true);

create policy "Admin insert categories"
  on public.categories for insert to authenticated
  with check (public.is_admin(auth.uid()));

create policy "Admin update categories"
  on public.categories for update to authenticated
  using (public.is_admin(auth.uid()))
  with check (public.is_admin(auth.uid()));

create policy "Admin delete categories"
  on public.categories for delete to authenticated
  using (public.is_admin(auth.uid()));

-- ----- ADMIN_SETTINGS -----
alter table public.admin_settings enable row level security;

drop policy if exists "Public read admin_settings" on public.admin_settings;
drop policy if exists "Admin write admin_settings" on public.admin_settings;

create policy "Public read admin_settings"
  on public.admin_settings for select to anon, authenticated
  using (true);

create policy "Admin write admin_settings"
  on public.admin_settings for all to authenticated
  using (public.is_admin(auth.uid()))
  with check (public.is_admin(auth.uid()));

-- ----- AD_CLICKS -----
alter table public.ad_clicks enable row level security;

drop policy if exists "Public insert ad_clicks" on public.ad_clicks;
drop policy if exists "Admin read ad_clicks" on public.ad_clicks;

create policy "Public insert ad_clicks"
  on public.ad_clicks for insert to anon, authenticated
  with check (
    user_id is null or user_id = auth.uid()
  );

create policy "Admin read ad_clicks"
  on public.ad_clicks for select to authenticated
  using (public.is_admin(auth.uid()));

-- ----- AD_LIKES -----
alter table public.ad_likes enable row level security;

drop policy if exists "Users select own ad_likes" on public.ad_likes;
drop policy if exists "Users insert ad_likes" on public.ad_likes;
drop policy if exists "Users delete ad_likes" on public.ad_likes;

create policy "Users select own ad_likes"
  on public.ad_likes for select to authenticated
  using (user_id = auth.uid());

create policy "Users insert ad_likes"
  on public.ad_likes for insert to authenticated
  with check (user_id = auth.uid());

create policy "Users delete ad_likes"
  on public.ad_likes for delete to authenticated
  using (user_id = auth.uid());
