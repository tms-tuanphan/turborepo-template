import type {
  AdminBlogCheckSlugResponse,
  AdminBlogListResponse,
  BlogCategory,
  BlogDetail,
} from '@repo/api/client';

import type { BlogFormActionState } from '../actions/blog-form-action-state';
import type { AdminBlogsPageData } from '../types/admin-blog';

const BLOGS_API = '/api/admin/blogs';
const CATEGORIES_OPTIONS_API = '/api/admin/blog-categories/options';

type ListBlogsResponse =
  | { ok: true; result: AdminBlogsPageData }
  | { ok: false; code: string };

export async function listAdminBlogsClient(
  query: string,
): Promise<ListBlogsResponse> {
  const response = await fetch(`${BLOGS_API}?${query}`, {
    credentials: 'include',
    cache: 'no-store',
  });
  return (await response.json()) as ListBlogsResponse;
}

export async function listAdminBlogCategoriesClient(): Promise<
  Pick<BlogCategory, 'id' | 'displayName'>[]
> {
  const response = await fetch(CATEGORIES_OPTIONS_API, {
    credentials: 'include',
    cache: 'no-store',
  });
  const payload = (await response.json()) as {
    ok: boolean;
    categories?: Pick<BlogCategory, 'id' | 'displayName'>[];
  };
  if (!payload.ok || !payload.categories) {
    return [];
  }
  return payload.categories;
}

export async function getAdminBlogByIdClient(
  id: string,
): Promise<BlogDetail | null> {
  const response = await fetch(`${BLOGS_API}/${id}`, {
    credentials: 'include',
    cache: 'no-store',
  });
  if (response.status === 404) {
    return null;
  }
  const payload = (await response.json()) as { ok: boolean; post?: BlogDetail };
  return payload.ok && payload.post ? payload.post : null;
}

export async function checkAdminBlogSlugClient(
  slug: string,
  excludeId?: string,
): Promise<AdminBlogCheckSlugResponse | null> {
  const params = new URLSearchParams({ slug });
  if (excludeId) params.set('excludeId', excludeId);
  const response = await fetch(`${BLOGS_API}/check-slug?${params}`, {
    credentials: 'include',
    cache: 'no-store',
  });
  if (!response.ok) {
    return null;
  }
  const payload = (await response.json()) as {
    ok: boolean;
    result?: AdminBlogCheckSlugResponse;
  };
  return payload.result ?? null;
}

export async function submitCreateBlogClient(
  formData: FormData,
): Promise<BlogFormActionState & { createdId?: string }> {
  const response = await fetch(BLOGS_API, {
    method: 'POST',
    credentials: 'include',
    body: formData,
  });
  return (await response.json()) as BlogFormActionState & {
    createdId?: string;
  };
}

export async function submitUpdateBlogClient(
  id: string,
  formData: FormData,
): Promise<BlogFormActionState> {
  const response = await fetch(`${BLOGS_API}/${id}`, {
    method: 'PATCH',
    credentials: 'include',
    body: formData,
  });
  return (await response.json()) as BlogFormActionState;
}

export async function deleteAdminBlogClient(id: string): Promise<boolean> {
  const response = await fetch(`${BLOGS_API}/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  const payload = (await response.json()) as { ok: boolean };
  return payload.ok;
}

export type { AdminBlogListResponse };
