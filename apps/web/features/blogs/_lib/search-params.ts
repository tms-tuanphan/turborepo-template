import { z } from 'zod';

import { BLOG_CATEGORIES, type BlogFilters } from '../_types';

const filtersSchema = z.object({
  search: z.string().trim().max(120).default(''),
  category: z.enum(['ALL', ...BLOG_CATEGORIES]).default('ALL'),
  pageNo: z.coerce.number().int().min(1).max(999).default(1),
});

export type RawSearchParams = Record<string, string | string[] | undefined>;

function pickFirst(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}

export function parseBlogFilters(params: RawSearchParams): BlogFilters {
  const parsed = filtersSchema.safeParse({
    search: pickFirst(params.search) ?? '',
    category: pickFirst(params.category) ?? 'ALL',
    pageNo: pickFirst(params.pageNo) ?? '1',
  });

  if (!parsed.success) {
    return { search: '', category: 'ALL', page: 1 };
  }

  return {
    search: parsed.data.search,
    category: parsed.data.category,
    page: parsed.data.pageNo,
  };
}
