import type { Prisma } from '@repo/database';

import type {
  BlogCategorySummaryDto,
  BlogDetailDto,
  BlogListItemDto,
} from '@repo/api';

const categorySelect = {
  id: true,
  displayName: true,
} satisfies Prisma.BlogCategorySelect;

const detailSelect = {
  id: true,
  slug: true,
  title: true,
  description: true,
  content: true,
  categoryId: true,
  category: { select: categorySelect },
  status: true,
  coverImage: true,
  author: true,
  views: true,
  publishedAt: true,
  createdAt: true,
  updatedAt: true,
  seoMetaTitle: true,
  seoMetaDescription: true,
  seoPrimaryKeyword: true,
} satisfies Prisma.BlogSelect;

const listSelect = {
  id: true,
  slug: true,
  title: true,
  description: true,
  category: { select: categorySelect },
  status: true,
  coverImage: true,
  author: true,
  views: true,
  publishedAt: true,
  createdAt: true,
  updatedAt: true,
  seoMetaTitle: true,
  seoMetaDescription: true,
  seoPrimaryKeyword: true,
} satisfies Prisma.BlogSelect;

export type BlogDetailRow = Prisma.BlogGetPayload<{
  select: typeof detailSelect;
}>;

export type BlogListRow = Prisma.BlogGetPayload<{
  select: typeof listSelect;
}>;

export { detailSelect, listSelect };

export function toCategorySummaryDto(row: {
  id: string;
  displayName: string;
}): BlogCategorySummaryDto {
  return {
    id: row.id,
    displayName: row.displayName,
  };
}

export function toBlogListItemDto(row: BlogListRow): BlogListItemDto {
  const seo: BlogListItemDto['seo'] = {
    metaTitle: row.seoMetaTitle,
    metaDescription: row.seoMetaDescription,
  };
  if (row.seoPrimaryKeyword) {
    seo.primaryKeyword = row.seoPrimaryKeyword;
  }

  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description,
    category: toCategorySummaryDto(row.category),
    status: row.status,
    coverImage: row.coverImage,
    author: row.author,
    views: row.views,
    publishedAt: row.publishedAt?.toISOString() ?? null,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
    seo,
  };
}

export function toBlogDetailDto(row: BlogDetailRow): BlogDetailDto {
  return {
    ...toBlogListItemDto(row),
    content: row.content,
  };
}
