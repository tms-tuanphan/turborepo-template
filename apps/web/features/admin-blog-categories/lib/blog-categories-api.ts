import type {
  BlogCategory,
  CreateBlogCategoryBody,
  UpdateBlogCategoryBody,
} from '@repo/api/client';

import { AdminApiError, fetchAdminApi } from '@/core/api/fetch-admin-api';

export async function listBlogCategories(): Promise<BlogCategory[]> {
  return fetchAdminApi<BlogCategory[]>('/admin/blog-categories');
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
