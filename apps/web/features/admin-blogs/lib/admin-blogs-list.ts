import { listAllBlogs } from '@/shared/data/blogs-store';
import type { BlogFilters } from '@/shared/types/blog';
import { filterAndPaginateBlogs } from '@/shared/utils/blog-filters';
import {
  parseBlogFilters,
  type RawSearchParams,
} from '@/shared/utils/parse-blog-filters';

export type AdminBlogsPageData = {
  items: ReturnType<typeof filterAndPaginateBlogs>['items'];
  totalPages: number;
  currentPage: number;
  totalItems: number;
  filters: BlogFilters;
  hasActiveFilters: boolean;
};

export function loadAdminBlogsPage(
  rawSearchParams: RawSearchParams,
): AdminBlogsPageData {
  const filters = parseBlogFilters(rawSearchParams);
  const all = listAllBlogs();
  const { items, totalPages, currentPage, totalItems } = filterAndPaginateBlogs(
    all,
    filters,
  );

  const hasActiveFilters =
    filters.search.trim() !== '' ||
    filters.category !== 'ALL' ||
    filters.status !== 'ALL';

  return {
    items,
    totalPages,
    currentPage,
    totalItems,
    filters,
    hasActiveFilters,
  };
}
