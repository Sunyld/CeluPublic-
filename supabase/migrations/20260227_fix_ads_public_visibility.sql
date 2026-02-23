-- Garantir bucket ad-images público e policies de leitura para anônimo.
-- Idempotente.

-- Bucket público (permite URLs /storage/v1/object/public/ad-images/...)
insert into storage.buckets (id, name, public)
values ('ad-images', 'ad-images', true)
on conflict (id) do update set public = true;

-- Policy SELECT para anon + authenticated (leitura pública)
drop policy if exists "ad_images_select" on storage.objects;
create policy "ad_images_select" on storage.objects for select
  using (bucket_id = 'ad-images');
