import Link from 'next/link';
import { notFound } from 'next/navigation';

import {
  AdminBlogsFilterBar,
  AdminBlogsPagination,
  AdminBlogsTable,
  listAdminBlogCategories,
  loadAdminBlogsPage,
} from '@/features/admin-blogs';
import { Button } from '@/components/ui/button';
import { getMessages, isLocale, type Locale } from '@/shared/i18n';

type Params = Promise<{ locale: string }>;
type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function AdminBlogsPage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: SearchParams;
}) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) {
    notFound();
  }
  const locale: Locale = rawLocale;
  const messages = getMessages(locale);
  const t = messages.admin.blogs;

  const raw = await searchParams;
  const [pageData, categories] = await Promise.all([
    loadAdminBlogsPage(raw),
    listAdminBlogCategories().catch(() => []),
  ]);

  const { items, totalPages, currentPage, totalItems, hasActiveFilters } =
    pageData;

  const resetHref = `/${locale}/admin/blogs`;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-end">
        <Button type="button" asChild>
          <Link href={`/${locale}/admin/blogs/new`}>{t.actions.create}</Link>
        </Button>
      </div>

      <AdminBlogsFilterBar messages={messages} categories={categories} />

      {items.length === 0 && hasActiveFilters ? (
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

      {totalItems > 0 ? (
        <AdminBlogsPagination
          totalPages={totalPages}
          currentPage={currentPage}
          messages={messages}
        />
      ) : null}
    </div>
  );
}
