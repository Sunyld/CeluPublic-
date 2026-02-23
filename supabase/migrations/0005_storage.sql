-- CeluPublic: Storage buckets (idempotent).
-- Policies for storage.objects may require Dashboard (if SQL Editor returns "must be owner").
-- See STORAGE_POLICIES_MANUAL.md for manual policy setup.

-- Minimal columns for compatibility across Supabase versions
insert into storage.buckets (id, name, public)
values
  ('ad-images', 'ad-images', true),
  ('banner-images', 'banner-images', true)
on conflict (id) do update set public = excluded.public;

-- Optional: if your Supabase allows creating storage policies via SQL, uncomment below.
-- If you get "must be owner of table objects", use STORAGE_POLICIES_MANUAL.md instead.

/*
-- ad-images: anyone can read (public bucket)
-- ad-images: insert/update/delete only if (storage.foldername(name))[1] = auth.uid()::text OR is_admin
drop policy if exists "ad_images_select" on storage.objects;
drop policy if exists "ad_images_insert" on storage.objects;
drop policy if exists "ad_images_update" on storage.objects;
drop policy if exists "ad_images_delete" on storage.objects;

create policy "ad_images_select" on storage.objects for select
  using (bucket_id = 'ad-images');
create policy "ad_images_insert" on storage.objects for insert to authenticated
  with check (bucket_id = 'ad-images' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "ad_images_update" on storage.objects for update to authenticated
  using (bucket_id = 'ad-images' and ((storage.foldername(name))[1] = auth.uid()::text or public.is_admin(auth.uid())));
create policy "ad_images_delete" on storage.objects for delete to authenticated
  using (bucket_id = 'ad-images' and ((storage.foldername(name))[1] = auth.uid()::text or public.is_admin(auth.uid())));

-- banner-images: public read; only admin write
drop policy if exists "banner_images_select" on storage.objects;
drop policy if exists "banner_images_insert" on storage.objects;
drop policy if exists "banner_images_update" on storage.objects;
drop policy if exists "banner_images_delete" on storage.objects;

create policy "banner_images_select" on storage.objects for select
  using (bucket_id = 'banner-images');
create policy "banner_images_insert" on storage.objects for insert to authenticated
  with check (bucket_id = 'banner-images' and public.is_admin(auth.uid()));
create policy "banner_images_update" on storage.objects for update to authenticated
  using (bucket_id = 'banner-images' and public.is_admin(auth.uid()));
create policy "banner_images_delete" on storage.objects for delete to authenticated
  using (bucket_id = 'banner-images' and public.is_admin(auth.uid()));
*/
