import type {
  BlogCategory,
  CreateBlogCategoryBody,
  UpdateBlogCategoryBody,
} from '@repo/api/client';

export type BlogCategoryApiErrorCode =
  | 'unauthorized'
  | 'forbidden'
  | 'conflict'
  | 'inUse'
  | 'notFound'
  | 'invalid';

export type BlogCategoryApiError = {
  ok: false;
  code: BlogCategoryApiErrorCode;
  fieldErrors?: Record<string, string[] | undefined>;
};

export type ListBlogCategoriesResponse =
  | { ok: true; categories: BlogCategory[] }
  | BlogCategoryApiError;

export type UpsertBlogCategoryResponse =
  | { ok: true; category: BlogCategory }
  | BlogCategoryApiError;

export type DeleteBlogCategoryResponse = { ok: true } | BlogCategoryApiError;

async function parseJson<T>(response: Response): Promise<T> {
  const text = await response.text();
  if (!text) return {} as T;
  return JSON.parse(text) as T;
}

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(path, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
  });

  const json = await parseJson<T>(response);
  return json;
}

export async function listBlogCategoriesClient(): Promise<ListBlogCategoriesResponse> {
  return apiFetch<ListBlogCategoriesResponse>('/api/admin/blog-categories');
}

export async function createBlogCategoryClient(
  body: CreateBlogCategoryBody,
): Promise<UpsertBlogCategoryResponse> {
  return apiFetch<UpsertBlogCategoryResponse>('/api/admin/blog-categories', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export async function updateBlogCategoryClient(
  id: string,
  body: UpdateBlogCategoryBody,
): Promise<UpsertBlogCategoryResponse> {
  return apiFetch<UpsertBlogCategoryResponse>(
    `/api/admin/blog-categories/${id}`,
    {
      method: 'PATCH',
      body: JSON.stringify(body),
    },
  );
}

export async function deleteBlogCategoryClient(
  id: string,
): Promise<DeleteBlogCategoryResponse> {
  return apiFetch<DeleteBlogCategoryResponse>(
    `/api/admin/blog-categories/${id}`,
    {
      method: 'DELETE',
    },
  );
}
