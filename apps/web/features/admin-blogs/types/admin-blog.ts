import type {
  BlogApiStatus,
  BlogCategorySummary,
  BlogDetail,
  BlogListItem,
  BlogSeoSummary,
} from '@repo/api/client';

export type {
  BlogApiStatus,
  BlogCategorySummary,
  BlogDetail,
  BlogListItem,
  BlogSeoSummary,
};

/** Form sidebar status labels (maps to API via DRAFT → UNPUBLISHED). */
export const ADMIN_FORM_STATUSES = ['DRAFT', 'PUBLISHED'] as const;
export type AdminFormStatus = (typeof ADMIN_FORM_STATUSES)[number];

export const ADMIN_FILTER_STATUSES = [
  'ALL',
  'PUBLISHED',
  'UNPUBLISHED',
] as const;
export type AdminFilterStatus = (typeof ADMIN_FILTER_STATUSES)[number];

export type AdminBlogCategoryOption = BlogCategorySummary;

export type AdminBlogPost = BlogDetail;

export type AdminBlogListItem = BlogListItem;

export type AdminBlogFilters = {
  search: string;
  category: string;
  status: AdminFilterStatus;
  page: number;
};

export const ADMIN_BLOGS_PER_PAGE = 9;

export function formStatusToApiStatus(status: AdminFormStatus): BlogApiStatus {
  return status === 'PUBLISHED' ? 'PUBLISHED' : 'UNPUBLISHED';
}

export function apiStatusToFormStatus(status: BlogApiStatus): AdminFormStatus {
  return status === 'PUBLISHED' ? 'PUBLISHED' : 'DRAFT';
}
