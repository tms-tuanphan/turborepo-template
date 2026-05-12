import { Suspense } from 'react';

import { Skeleton } from '@/components/ui/skeleton';
import type { Locale, Messages } from '@/shared/i18n';

import { listPublishedBlogs } from '../_data/blogs-store';
import { filterAndPaginateBlogs } from '../_lib/filter-blogs';
import type { BlogFilters } from '../_types';

import { BlogList } from './blog-list';
import { BlogPagination } from './blog-pagination';
import { BlogsFilterBar } from './blogs-filter-bar';
import { BlogsHero } from './blogs-hero';

type Props = {
  locale: Locale;
  messages: Messages;
  filters: BlogFilters;
};

export function BlogsPage({ locale, messages, filters }: Props) {
  const { items, totalPages, currentPage } = filterAndPaginateBlogs(
    listPublishedBlogs(),
    filters,
  );

  return (
    <div className="mx-auto w-full max-w-[1280px] px-4 pb-16 sm:px-6 lg:px-10">
      <BlogsHero messages={messages} />
      <div className="space-y-10">
        <Suspense
          fallback={
            <div className="grid gap-3 sm:grid-cols-[1fr_minmax(160px,220px)]">
              <Skeleton className="h-12 w-full rounded-md" />
              <Skeleton className="h-12 w-full rounded-md" />
            </div>
          }
        >
          <BlogsFilterBar messages={messages} />
        </Suspense>
        <BlogList posts={items} locale={locale} messages={messages} />
        <div className="pt-2">
          <Suspense fallback={<div className="h-9" />}>
            <BlogPagination
              totalPages={totalPages}
              currentPage={currentPage}
              messages={messages}
            />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
