-- Add UPDATE policies for storage.objects (ad-images, banner-images).

alter table if exists storage.objects enable row level security;

-- Drop existing UPDATE policies if any (idempotent).
drop policy if exists "User update own ad-images" on storage.objects;
drop policy if exists "Admin update ad-images" on storage.objects;
drop policy if exists "Admin update banner-images" on storage.objects;

-- ad-images: owner can UPDATE metadata only in own folder
create policy "User update own ad-images"
  on storage.objects for update
  using (
    bucket_id = 'ad-images'
    and (storage.foldername(name))[1] = auth.uid()::text
  )
  with check (
    bucket_id = 'ad-images'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- ad-images: admin can UPDATE anywhere in this bucket
create policy "Admin update ad-images"
  on storage.objects for update
  using (
    bucket_id = 'ad-images'
    and exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  )
  with check (
    bucket_id = 'ad-images'
    and exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

-- banner-images: admin can UPDATE metadata
create policy "Admin update banner-images"
  on storage.objects for update
  using (
    bucket_id = 'banner-images'
    and exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  )
  with check (
    bucket_id = 'banner-images'
    and exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

