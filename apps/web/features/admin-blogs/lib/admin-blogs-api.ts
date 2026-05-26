import type {
  AdminBlogCheckSlugResponse,
  AdminBlogListResponse,
  BlogCategory,
  BlogDetail,
  CreateAdminBlogBody,
  UpdateAdminBlogBody,
} from '@repo/api/client';

import { AdminApiError, fetchAdminApi } from '@/core/api/fetch-admin-api';

import type { AdminBlogFilters } from '../types/admin-blog';
import { ADMIN_BLOGS_PER_PAGE } from '../types/admin-blog';

export type AdminBlogListQuery = {
  search?: string;
  category?: string;
  status?: string;
  page?: number;
  pageSize?: number;
};

function buildListQuery(filters: AdminBlogFilters): string {
  const params = new URLSearchParams();
  const search = filters.search.trim();
  if (search) params.set('search', search);
  if (filters.category && filters.category !== 'ALL') {
    params.set('category', filters.category);
  }
  if (filters.status && filters.status !== 'ALL') {
    params.set('status', filters.status);
  }
  params.set('page', String(filters.page));
  params.set('pageSize', String(ADMIN_BLOGS_PER_PAGE));
  return params.toString();
}

export async function listAdminBlogs(
  filters: AdminBlogFilters,
): Promise<AdminBlogListResponse> {
  const query = buildListQuery(filters);
  return fetchAdminApi<AdminBlogListResponse>(`/admin/blogs?${query}`);
}

export async function getAdminBlogById(id: string): Promise<BlogDetail | null> {
  try {
    return await fetchAdminApi<BlogDetail>(`/admin/blogs/${id}`);
  } catch (error) {
    if (error instanceof AdminApiError && error.status === 404) {
      return null;
    }
    throw error;
  }
}

export async function checkAdminBlogSlug(
  slug: string,
  excludeId?: string,
): Promise<AdminBlogCheckSlugResponse> {
  const params = new URLSearchParams({ slug });
  if (excludeId) params.set('excludeId', excludeId);
  return fetchAdminApi<AdminBlogCheckSlugResponse>(
    `/admin/blogs/check-slug?${params.toString()}`,
  );
}

export async function createAdminBlog(
  body: CreateAdminBlogBody,
): Promise<BlogDetail> {
  return fetchAdminApi<BlogDetail>('/admin/blogs', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export async function updateAdminBlog(
  id: string,
  body: UpdateAdminBlogBody,
): Promise<BlogDetail> {
  return fetchAdminApi<BlogDetail>(`/admin/blogs/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(body),
  });
}

export async function deleteAdminBlog(id: string): Promise<void> {
  await fetchAdminApi<void>(`/admin/blogs/${id}`, { method: 'DELETE' });
}

export async function listAdminBlogCategories(): Promise<BlogCategory[]> {
  return fetchAdminApi<BlogCategory[]>('/admin/blog-categories');
}
