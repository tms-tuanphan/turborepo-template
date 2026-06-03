'use client';

import Link from 'next/link';
import { Suspense } from 'react';

import { Button } from '@/components/ui/button';
import type { Locale, Messages } from '@/shared/i18n';

import { useAdminBlogsPage } from '../hooks/use-admin-blogs-page';
import { AdminBlogsFilterBar } from './admin-blogs-filter-bar';
import { AdminBlogsPagination } from './admin-blogs-pagination';
import { AdminBlogsTable } from './admin-blogs-table';
import { useAdminBlogCategoriesOptions } from '../hooks/use-admin-blog-categories-options';

type AdminBlogsPageClientProps = {
  locale: Locale;
  messages: Messages;
};

function AdminBlogsPageContent({
  locale,
  messages,
}: AdminBlogsPageClientProps) {
  const t = messages.admin.blogs;
  const { data, error, isLoading, emptyWithFilters } = useAdminBlogsPage();
  const { categories } = useAdminBlogCategoriesOptions();

  const resetHref = `/${locale}/admin/blogs`;
  const items = data?.items ?? [];
  const totalPages = data?.totalPages ?? 1;
  const currentPage = data?.currentPage ?? 1;
  const totalItems = data?.totalItems ?? 0;

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6" role="status" aria-busy="true">
        <p className="text-sm text-muted-foreground">{t.listLoading}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col gap-6" role="alert">
        <p className="text-sm text-destructive">{t.listError}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <AdminBlogsFilterBar
        messages={messages}
        categories={categories}
        createHref={`/${locale}/admin/blogs/new`}
        createLabel={t.actions.create}
      />

      {items.length === 0 && emptyWithFilters ? (
        <div
          className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed bg-card px-6 py-12 text-center"
          role="status"
        >
          <p className="text-sm text-muted-foreground">{t.filteredEmpty}</p>
          <Button type="button" variant="outline" size="sm" asChild>
            <Link href={resetHref}>{t.resetFilters}</Link>
          </Button>
        </div>
      ) : (
        <AdminBlogsTable blogs={items} messages={messages} locale={locale} />
      )}

      <AdminBlogsPagination
        totalItems={totalItems}
        totalPages={totalPages}
        currentPage={currentPage}
        messages={messages}
      />
    </div>
  );
}

export function AdminBlogsPageClient(props: AdminBlogsPageClientProps) {
  return (
    <Suspense
      fallback={
        <div className="text-sm text-muted-foreground" role="status">
          {props.messages.admin.blogs.listLoading}
        </div>
      }
    >
      <AdminBlogsPageContent {...props} />
    </Suspense>
  );
}
