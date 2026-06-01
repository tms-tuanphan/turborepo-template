import type {
  AdminBlogCategoryListResponse,
  BlogCategory,
  CreateBlogCategoryBody,
  UpdateBlogCategoryBody,
} from '@repo/api/client';

import { AdminApiError, fetchAdminApi } from '@/core/api/fetch-admin-api';

export type AdminBlogCategoryListQuery = {
  page?: number;
  pageSize?: number;
};

function buildListQuery(query?: AdminBlogCategoryListQuery): string {
  const params = new URLSearchParams();
  if (query?.page !== undefined) params.set('page', String(query.page));
  if (query?.pageSize !== undefined)
    params.set('pageSize', String(query.pageSize));
  return params.toString();
}

export async function listBlogCategories(
  query?: AdminBlogCategoryListQuery,
): Promise<AdminBlogCategoryListResponse> {
  const qs = buildListQuery(query);
  return fetchAdminApi<AdminBlogCategoryListResponse>(
    `/admin/blog-categories${qs ? `?${qs}` : ''}`,
  );
}

export async function createBlogCategory(
  body: CreateBlogCategoryBody,
): Promise<BlogCategory> {
  return fetchAdminApi<BlogCategory>('/admin/blog-categories', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export async function updateBlogCategory(
  id: string,
  body: UpdateBlogCategoryBody,
): Promise<BlogCategory> {
  return fetchAdminApi<BlogCategory>(`/admin/blog-categories/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(body),
  });
}

export async function deleteBlogCategory(id: string): Promise<void> {
  await fetchAdminApi<void>(`/admin/blog-categories/${id}`, {
    method: 'DELETE',
  });
}

export function isCategoryInUseError(error: unknown): boolean {
  return (
    error instanceof AdminApiError &&
    error.status === 409 &&
    error.payload?.code === 'errors.blogs.categoryInUse'
  );
}

export function isCategoryConflictError(error: unknown): boolean {
  return error instanceof AdminApiError && error.status === 409;
}
