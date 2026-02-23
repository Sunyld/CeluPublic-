-- Optional migration: Normalize storage paths in DB (remove full URLs, keep only paths).
-- Run this if you have existing records with full URLs in image_path columns.
-- This migration extracts paths from URLs and updates the records.

-- Normalize banners.image_path
UPDATE public.banners
SET image_path = CASE
  WHEN image_path LIKE 'http://%' OR image_path LIKE 'https://%' THEN
    -- Extract path from URL
    -- Format: .../storage/v1/object/public/banner-images/<path>
    -- Or: .../storage/v1/object/banner-images/<path> (wrong format)
    SUBSTRING(
      image_path FROM 
      '.*/(?:storage/v1/object/(?:public|sign)/)?banner-images/(.+?)(?:\?|$)'
    )
  ELSE
    -- Already a path, just clean it
    TRIM(BOTH '/' FROM image_path)
END
WHERE image_path IS NOT NULL
  AND (image_path LIKE 'http://%' OR image_path LIKE 'https://%' OR image_path LIKE '/%');

-- Normalize ad_images.path
UPDATE public.ad_images
SET path = CASE
  WHEN path LIKE 'http://%' OR path LIKE 'https://%' THEN
    -- Extract path from URL
    SUBSTRING(
      path FROM 
      '.*/(?:storage/v1/object/(?:public|sign)/)?ad-images/(.+?)(?:\?|$)'
    )
  ELSE
    -- Already a path, just clean it
    TRIM(BOTH '/' FROM path)
END
WHERE path IS NOT NULL
  AND (path LIKE 'http://%' OR path LIKE 'https://%' OR path LIKE '/%');

-- Log how many records were updated
DO $$
DECLARE
  banners_updated INTEGER;
  ad_images_updated INTEGER;
BEGIN
  SELECT COUNT(*) INTO banners_updated
  FROM public.banners
  WHERE image_path IS NOT NULL
    AND (image_path LIKE 'http://%' OR image_path LIKE 'https://%' OR image_path LIKE '/%');
  
  SELECT COUNT(*) INTO ad_images_updated
  FROM public.ad_images
  WHERE path IS NOT NULL
    AND (path LIKE 'http://%' OR path LIKE 'https://%' OR path LIKE '/%');
  
  RAISE NOTICE 'Migration completed: % banners and % ad_images records may need normalization.', 
    banners_updated, ad_images_updated;
END $$;

-- -------------------------------------------------------------------
-- AUDIT QUERIES (run manually after migration)
-- -------------------------------------------------------------------
-- -- banners still storing URLs?
-- -- select count(*) as banners_with_url from public.banners where image_path like 'http%';
-- -- banners with leading slash?
-- -- select count(*) as banners_with_leading_slash from public.banners where image_path like '/%';
-- -- ad_images still storing URLs?
-- -- select count(*) as ad_images_with_url from public.ad_images where path like 'http%';
-- -- ad_images with leading slash?
-- -- select count(*) as ad_images_with_leading_slash from public.ad_images where path like '/%';
