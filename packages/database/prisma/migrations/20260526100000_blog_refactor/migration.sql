-- Blog refactor: category table, PUBLISHED/UNPUBLISHED, drop tags & scheduledAt

CREATE TABLE "blog_categories" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "nameKey" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "blog_categories_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "blog_categories_slug_key" ON "blog_categories"("slug");

INSERT INTO "blog_categories" ("id", "slug", "nameKey", "sortOrder", "createdAt", "updatedAt")
VALUES
    ('cat_it_partnership', 'it-partnership', 'blogs.categories.it_partnership', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('cat_daas', 'daas', 'blogs.categories.daas', 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('cat_ai', 'ai', 'blogs.categories.ai', 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

ALTER TABLE "Blog" ADD COLUMN "categoryId" TEXT;

UPDATE "Blog" SET "categoryId" = 'cat_it_partnership' WHERE "category" = 'IT_PARTNERSHIP';
UPDATE "Blog" SET "categoryId" = 'cat_daas' WHERE "category" = 'DAAS';
UPDATE "Blog" SET "categoryId" = 'cat_ai' WHERE "category" = 'AI';
UPDATE "Blog" SET "categoryId" = 'cat_it_partnership' WHERE "categoryId" IS NULL;

CREATE TYPE "BlogStatus_new" AS ENUM ('PUBLISHED', 'UNPUBLISHED');

ALTER TABLE "Blog" ADD COLUMN "status_new" "BlogStatus_new";

UPDATE "Blog" SET "status_new" = 'PUBLISHED'::"BlogStatus_new" WHERE "status" = 'PUBLISHED';
UPDATE "Blog" SET "status_new" = 'UNPUBLISHED'::"BlogStatus_new" WHERE "status_new" IS NULL;

ALTER TABLE "Blog" DROP COLUMN "status";
ALTER TABLE "Blog" RENAME COLUMN "status_new" TO "status";
ALTER TABLE "Blog" ALTER COLUMN "status" SET DEFAULT 'UNPUBLISHED'::"BlogStatus_new";
ALTER TABLE "Blog" ALTER COLUMN "status" SET NOT NULL;

DROP TYPE "BlogStatus";
ALTER TYPE "BlogStatus_new" RENAME TO "BlogStatus";

DROP INDEX IF EXISTS "Blog_category_idx";
ALTER TABLE "Blog" DROP COLUMN "category";
ALTER TABLE "Blog" DROP COLUMN "tags";
ALTER TABLE "Blog" DROP COLUMN "scheduledAt";

ALTER TABLE "Blog" ALTER COLUMN "categoryId" SET NOT NULL;

ALTER TABLE "Blog" ADD CONSTRAINT "Blog_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "blog_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

CREATE INDEX "Blog_categoryId_idx" ON "Blog"("categoryId");

DROP TYPE "BlogCategory";
