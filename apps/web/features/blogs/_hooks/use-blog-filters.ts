'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useTransition } from 'react';

import type { BlogCategory } from '../_types';

type UpdateFn = (params: {
  search?: string;
  category?: BlogCategory | 'ALL';
  pageNo?: number;
}) => void;

type Result = {
  search: string;
  category: BlogCategory | 'ALL';
  pageNo: number;
  isPending: boolean;
  setSearch: (value: string) => void;
  setCategory: (value: BlogCategory | 'ALL') => void;
  setPage: (value: number) => void;
};

export function useBlogFilters(): Result {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const search = searchParams.get('search') ?? '';
  const categoryRaw = searchParams.get('category') ?? 'ALL';
  const category = categoryRaw as BlogCategory | 'ALL';
  const pageNo = Number(searchParams.get('pageNo') ?? '1') || 1;

  const update: UpdateFn = useCallback(
    (changes) => {
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
    pageNo,
    isPending,
    setSearch: (value) => update({ search: value, pageNo: 1 }),
    setCategory: (value) => update({ category: value, pageNo: 1 }),
    setPage: (value) => update({ pageNo: value }),
  };
}
