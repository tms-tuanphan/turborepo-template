import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';

import type {
  BlogCategory,
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
  type UpsertBlogCategoryResponse,
} from '../lib/blog-categories-client-api';

const BLOG_CATEGORIES_KEY = '/api/admin/blog-categories';

type UseBlogCategoriesOptions = {
  fallbackData?: BlogCategory[];
};

type MutationResult =
  | { ok: true }
  | {
      ok: false;
      error: BlogCategoryApiError;
    };

export function useBlogCategories(options?: UseBlogCategoriesOptions) {
  const list = useSWR<BlogCategory[], BlogCategoryApiError>(
    BLOG_CATEGORIES_KEY,
    async (): Promise<BlogCategory[]> => {
      const res: ListBlogCategoriesResponse = await listBlogCategoriesClient();
      if (!res.ok) throw res;
      return res.categories;
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
    categories: list.data ?? [],
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
