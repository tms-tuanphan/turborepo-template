import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';

import type {
  AdminBlogCategoryListResponse,
  CreateBlogCategoryBody,
  UpdateBlogCategoryBody,
} from '@repo/api/client';

import {
  createBlogCategoryClient,
  deleteBlogCategoryClient,
  listBlogCategoriesClient,
  updateBlogCategoryClient,
  type BlogCategoryApiError,
  type DeleteBlogCategoryResponse,
  type ListBlogCategoriesResponse,
  type ListBlogCategoriesQuery,
  type UpsertBlogCategoryResponse,
} from '../lib/blog-categories-client-api';

const BLOG_CATEGORIES_KEY = '/api/admin/blog-categories';

type UseBlogCategoriesOptions = {
  query?: ListBlogCategoriesQuery;
  fallbackData?: AdminBlogCategoryListResponse;
};

type MutationResult =
  | { ok: true }
  | {
      ok: false;
      error: BlogCategoryApiError;
    };

export function useBlogCategories(options?: UseBlogCategoriesOptions) {
  const query = options?.query;
  const key =
    query && (query.page !== undefined || query.pageSize !== undefined)
      ? [
          BLOG_CATEGORIES_KEY,
          String(query.page ?? ''),
          String(query.pageSize ?? ''),
        ]
      : BLOG_CATEGORIES_KEY;

  const list = useSWR<AdminBlogCategoryListResponse, BlogCategoryApiError>(
    key,
    async (): Promise<AdminBlogCategoryListResponse> => {
      const res: ListBlogCategoriesResponse =
        await listBlogCategoriesClient(query);
      if (!res.ok) throw res;
      return res.result;
    },
    { fallbackData: options?.fallbackData },
  );

  const create = useSWRMutation<
    UpsertBlogCategoryResponse,
    BlogCategoryApiError,
    string,
    CreateBlogCategoryBody
  >(BLOG_CATEGORIES_KEY, async (_key, { arg }) =>
    createBlogCategoryClient(arg),
  );

  const update = useSWRMutation<
    UpsertBlogCategoryResponse,
    BlogCategoryApiError,
    { id: string },
    { id: string; body: UpdateBlogCategoryBody }
  >({ id: 'blog-category-update' }, async (_key, { arg }) =>
    updateBlogCategoryClient(arg.id, arg.body),
  );

  const remove = useSWRMutation<
    DeleteBlogCategoryResponse,
    BlogCategoryApiError,
    { id: string },
    string
  >({ id: 'blog-category-delete' }, async (_key, { arg }) =>
    deleteBlogCategoryClient(arg),
  );

  const createCategory = async (
    body: CreateBlogCategoryBody,
  ): Promise<MutationResult> => {
    const res = await create.trigger(body);
    if (!res.ok) return { ok: false, error: res };
    await list.mutate();
    return { ok: true };
  };

  const updateCategory = async (
    id: string,
    body: UpdateBlogCategoryBody,
  ): Promise<MutationResult> => {
    const res = await update.trigger({ id, body });
    if (!res.ok) return { ok: false, error: res };
    await list.mutate();
    return { ok: true };
  };

  const deleteCategory = async (id: string): Promise<MutationResult> => {
    const res = await remove.trigger(id);
    if (!res.ok) return { ok: false, error: res };
    await list.mutate();
    return { ok: true };
  };

  return {
    items: list.data?.items ?? [],
    totalItems: list.data?.totalItems ?? 0,
    totalPages: list.data?.totalPages ?? 1,
    currentPage: list.data?.currentPage ?? query?.page ?? 1,
    isLoading: list.isLoading,
    error: list.error,
    mutate: list.mutate,

    createCategory,
    updateCategory,
    deleteCategory,

    isCreating: create.isMutating,
    isUpdating: update.isMutating,
    isDeleting: remove.isMutating,
  };
}
