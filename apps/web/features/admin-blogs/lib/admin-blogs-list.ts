import { listAdminBlogs } from './admin-blogs-api';
import {
  parseAdminBlogFilters,
  type RawSearchParams,
} from './parse-admin-blog-filters';
import type { AdminBlogFilters, AdminBlogListItem } from '../types/admin-blog';

export type AdminBlogsPageData = {
  items: AdminBlogListItem[];
  totalPages: number;
  currentPage: number;
  totalItems: number;
  filters: AdminBlogFilters;
  hasActiveFilters: boolean;
};

export async function loadAdminBlogsPage(
  rawSearchParams: RawSearchParams,
): Promise<AdminBlogsPageData> {
  const filters = parseAdminBlogFilters(rawSearchParams);

  try {
    const result = await listAdminBlogs(filters);
    const hasActiveFilters =
      filters.search.trim() !== '' ||
      filters.category !== 'ALL' ||
      filters.status !== 'ALL';

    return {
      items: result.items,
      totalPages: result.totalPages,
      currentPage: result.currentPage,
      totalItems: result.totalItems,
      filters,
      hasActiveFilters,
    };
  } catch {
    return {
      items: [],
      totalPages: 1,
      currentPage: 1,
      totalItems: 0,
      filters,
      hasActiveFilters:
        filters.search.trim() !== '' ||
        filters.category !== 'ALL' ||
        filters.status !== 'ALL',
    };
  }
}
