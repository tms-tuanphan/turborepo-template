'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useTransition } from 'react';

import type { BlogCategory, BlogStatus } from '@/shared/types/blog';

type Changes = {
  search?: string;
  category?: BlogCategory | 'ALL';
  status?: BlogStatus | 'ALL';
  pageNo?: number;
};

type Result = {
  search: string;
  category: BlogCategory | 'ALL';
  status: BlogStatus | 'ALL';
  pageNo: number;
  isPending: boolean;
  setSearch: (value: string) => void;
  setCategory: (value: BlogCategory | 'ALL') => void;
  setStatus: (value: BlogStatus | 'ALL') => void;
  setPage: (value: number) => void;
};

export function useAdminBlogFilters(): Result {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const search = searchParams.get('search') ?? '';
  const categoryRaw = searchParams.get('category') ?? 'ALL';
  const category = categoryRaw as BlogCategory | 'ALL';
  const statusRaw = searchParams.get('status') ?? 'ALL';
  const status = statusRaw as BlogStatus | 'ALL';
  const pageNo = Number(searchParams.get('pageNo') ?? '1') || 1;

  const update = useCallback(
    (changes: Changes) => {
      const next = new URLSearchParams(searchParams.toString());

      if (changes.search !== undefined) {
        if (changes.search) next.set('search', changes.search);
        else next.delete('search');
      }
      if (changes.category !== undefined) {
        if (changes.category && changes.category !== 'ALL') {
          next.set('category', changes.category);
        } else {
          next.delete('category');
        }
      }
      if (changes.status !== undefined) {
        if (changes.status && changes.status !== 'ALL') {
          next.set('status', changes.status);
        } else {
          next.delete('status');
        }
      }
      if (changes.pageNo !== undefined) {
        if (changes.pageNo > 1) next.set('pageNo', String(changes.pageNo));
        else next.delete('pageNo');
      }

      const query = next.toString();
      const url = query ? `${pathname}?${query}` : pathname;
      startTransition(() => {
        router.replace(url, { scroll: false });
      });
    },
    [pathname, router, searchParams],
  );

  return {
    search,
    category,
    status,
    pageNo,
    isPending,
    setSearch: (value) => update({ search: value, pageNo: 1 }),
    setCategory: (value) => update({ category: value, pageNo: 1 }),
    setStatus: (value) => update({ status: value, pageNo: 1 }),
    setPage: (value) => update({ pageNo: value }),
  };
}
