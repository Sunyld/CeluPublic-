-- CeluPublic: normalize storage paths in DB (optional — run if you have full URLs in image_path/path).
-- Idempotent: safe to run multiple times.

-- banners.image_path: keep only path relative to bucket (e.g. banners/<id>/<uuid>.jpg)
update public.banners
set image_path = case
  when image_path ~ '^https?://' then
    substring(
      image_path from '.*/banner-images/(.+?)(\?|$)'
    )
  when image_path like '/%' then
    trim(both '/' from regexp_replace(image_path, '^/?(banner-images/)?', ''))
  else
    trim(both '/' from regexp_replace(image_path, '^banner-images/', ''))
end
where image_path is not null
  and (image_path ~ '^https?://' or image_path like '/%' or image_path like 'banner-images/%');

-- Ensure no double 'banners/' prefix
update public.banners
set image_path = regexp_replace(image_path, '^banners/banners/', 'banners/')
where image_path like 'banners/banners/%';

-- ad_images.path: keep only path relative to bucket
update public.ad_images
set path = case
  when path ~ '^https?://' then
    substring(path from '.*/ad-images/(.+?)(\?|$)')
  when path like '/%' then
    trim(both '/' from regexp_replace(path, '^/?(ad-images/)?', ''))
  else
    trim(both '/' from regexp_replace(path, '^ad-images/', ''))
end
where path is not null
  and (path ~ '^https?://' or path like '/%' or path like 'ad-images/%');
