-- CreateEnum
CREATE TYPE "BlogCategory" AS ENUM ('IT_PARTNERSHIP', 'DAAS', 'AI');

-- CreateEnum
CREATE TYPE "BlogStatus" AS ENUM ('DRAFT', 'REVIEWING', 'SCHEDULED', 'PUBLISHED', 'ARCHIVED');

-- CreateTable
CREATE TABLE "Blog" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "content" TEXT NOT NULL DEFAULT '',
    "category" "BlogCategory" NOT NULL,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "status" "BlogStatus" NOT NULL DEFAULT 'DRAFT',
    "coverImage" TEXT NOT NULL DEFAULT '',
    "author" TEXT NOT NULL DEFAULT '',
    "views" INTEGER NOT NULL DEFAULT 0,
    "publishedAt" TIMESTAMP(3),
    "scheduledAt" TIMESTAMP(3),
    "seoMetaTitle" TEXT NOT NULL DEFAULT '',
    "seoMetaDescription" TEXT NOT NULL DEFAULT '',
    "seoPrimaryKeyword" TEXT,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Blog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Blog_slug_key" ON "Blog"("slug");

-- CreateIndex
CREATE INDEX "Blog_status_updatedAt_idx" ON "Blog"("status", "updatedAt");

-- CreateIndex
CREATE INDEX "Blog_category_idx" ON "Blog"("category");
