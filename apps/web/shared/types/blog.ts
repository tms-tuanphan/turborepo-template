export const BLOG_CATEGORIES = ['IT_PARTNERSHIP', 'DAAS', 'AI'] as const;

export type BlogCategory = (typeof BLOG_CATEGORIES)[number];

export const BLOG_STATUSES = [
  'DRAFT',
  'REVIEWING',
  'SCHEDULED',
  'PUBLISHED',
  'ARCHIVED',
] as const;

export type BlogStatus = (typeof BLOG_STATUSES)[number];

export type BlogSeo = {
  metaTitle: string;
  metaDescription: string;
  primaryKeyword?: string;
};

export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  description: string;
  content: string;
  category: BlogCategory;
  tags: string[];
  status: BlogStatus;
  coverImage: string;
  author: string;
  views: number;
  publishedAt: string | null;
  scheduledAt: string | null;
  createdAt: string;
  updatedAt: string;
  seo: BlogSeo;
};

export type BlogFilters = {
  search: string;
  category: BlogCategory | 'ALL';
  status: BlogStatus | 'ALL';
  page: number;
};

export const BLOGS_PER_PAGE = 9;
