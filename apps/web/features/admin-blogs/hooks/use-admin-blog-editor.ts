'use client';

import useSWR from 'swr';

import type { BlogDetail } from '@repo/api/client';

import type {
  AdminBlogCategoryOption,
  AdminBlogPost,
} from '../types/admin-blog';
import {
  getAdminBlogByIdClient,
  listAdminBlogCategoriesClient,
} from '../lib/admin-blogs-client-api';

export function useAdminBlogEditor(mode: 'create' | 'edit', postId?: string) {
  const categoriesKey = '/api/admin/blog-categories/options';
  const postKey =
    mode === 'edit' && postId ? `/api/admin/blogs/${postId}` : null;

  const categoriesQuery = useSWR(categoriesKey, listAdminBlogCategoriesClient, {
    revalidateOnFocus: false,
  });

  const postQuery = useSWR(
    postKey,
    postKey ? () => getAdminBlogByIdClient(postId!) : null,
    { revalidateOnFocus: false },
  );

  const categories: AdminBlogCategoryOption[] =
    categoriesQuery.data?.map((c) => ({
      id: c.id,
      displayName: c.displayName,
    })) ?? [];

  const initial: AdminBlogPost | undefined = postQuery.data as
    | BlogDetail
    | undefined;

  const isLoading =
    categoriesQuery.isLoading || (mode === 'edit' && postQuery.isLoading);

  const notFound =
    mode === 'edit' &&
    !postQuery.isLoading &&
    (postQuery.data === null || postQuery.error);

  const categoriesReady = categories.length > 0;

  return {
    categories,
    initial,
    isLoading,
    notFound: notFound || (!isLoading && mode === 'edit' && !categoriesReady),
    categoriesReady,
  };
}
