-- Blog categories: replace slug/nameKey/sortOrder with displayName

-- 1) Add new column (temporary default to avoid nulls during migration)
ALTER TABLE "blog_categories" ADD COLUMN "displayName" TEXT NOT NULL DEFAULT '';

-- 2) Backfill displayName from existing data (prefer nameKey → slug fallback)
UPDATE "blog_categories"
SET "displayName" = COALESCE(NULLIF(TRIM("nameKey"), ''), NULLIF(TRIM("slug"), ''), 'Category')
WHERE "displayName" = '';

-- 3) Drop old columns and unique index
DROP INDEX IF EXISTS "blog_categories_slug_key";

ALTER TABLE "blog_categories" DROP COLUMN "slug";
ALTER TABLE "blog_categories" DROP COLUMN "nameKey";
ALTER TABLE "blog_categories" DROP COLUMN "sortOrder";

-- 4) Remove default now that values are populated
ALTER TABLE "blog_categories" ALTER COLUMN "displayName" DROP DEFAULT;

