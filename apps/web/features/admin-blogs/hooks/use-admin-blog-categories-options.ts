'use client';

import useSWR from 'swr';

import { listAdminBlogCategoriesClient } from '../lib/admin-blogs-client-api';

export function useAdminBlogCategoriesOptions() {
  const { data, isLoading } = useSWR(
    '/api/admin/blog-categories/options',
    listAdminBlogCategoriesClient,
    { revalidateOnFocus: false },
  );

  return {
    categories: data ?? [],
    isLoading,
  };
}
