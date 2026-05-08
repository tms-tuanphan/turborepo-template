import { BLOG_CATEGORIES, type BlogCategory } from '../_types';

export type CategoryOption = {
  value: BlogCategory | 'ALL';
};

export const categoryOptions: CategoryOption[] = [
  { value: 'ALL' },
  ...BLOG_CATEGORIES.map((value) => ({ value })),
];
