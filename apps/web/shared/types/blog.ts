export const BLOG_CATEGORIES = ['IT_PARTNERSHIP', 'DAAS', 'AI'] as const;

export type BlogCategory = (typeof BLOG_CATEGORIES)[number];

export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: BlogCategory;
  coverImage: string;
  publishedAt: string;
};

export type BlogFilters = {
  search: string;
  category: BlogCategory | 'ALL';
  page: number;
};

export const BLOGS_PER_PAGE = 9;
