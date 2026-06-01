'use client';

import { useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import useSWR from 'swr';

import { listAdminBlogsClient } from '../lib/admin-blogs-client-api';
import { parseAdminBlogFilters } from '../lib/parse-admin-blog-filters';

const BLOGS_LIST_KEY = '/api/admin/blogs';

export function useAdminBlogsPage() {
  const searchParams = useSearchParams();
  const queryString = searchParams.toString();

  const raw = useMemo(() => {
    const record: Record<string, string | string[] | undefined> = {};
    searchParams.forEach((value, key) => {
      record[key] = value;
    });
    return record;
  }, [searchParams]);

  const filters = useMemo(() => parseAdminBlogFilters(raw), [raw]);

  const { data, error, isLoading, mutate } = useSWR(
    queryString ? `${BLOGS_LIST_KEY}?${queryString}` : BLOGS_LIST_KEY,
    async (key: string) => {
      const query = key.includes('?') ? (key.split('?')[1] ?? '') : '';
      const response = await listAdminBlogsClient(query);
      if (!response.ok) {
        throw new Error(response.code);
      }
      return response.result;
    },
    { revalidateOnFocus: false },
  );

  return {
    filters,
    data,
    error,
    isLoading,
    mutate,
    emptyWithFilters: (data?.items.length ?? 0) === 0 && data?.hasActiveFilters,
  };
}
