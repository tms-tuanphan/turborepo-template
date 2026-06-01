import { notFound, redirect } from 'next/navigation';

import {
  AdminBlogCategoriesClient,
  listBlogCategories,
} from '@/features/admin-blog-categories';
import { getAdminSession } from '@/core/auth/server-session';
import { getMessages, isLocale, type Locale } from '@/shared/i18n';

type Params = Promise<{ locale: string }>;

export default async function AdminBlogCategoriesPage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) {
    notFound();
  }
  const locale: Locale = rawLocale;

  const session = await getAdminSession();
  if (!session) {
    redirect(`/${locale}/admin/login`);
  }

  const messages = getMessages(locale);
  const rawSearchParams = (await searchParams) ?? {};
  const rawPage =
    typeof rawSearchParams.page === 'string' ? rawSearchParams.page : undefined;
  const page = rawPage ? Number(rawPage) : Number.NaN;

  const result = await listBlogCategories({
    page: Number.isFinite(page) && page >= 1 ? Math.floor(page) : 1,
    pageSize: 20,
  }).catch(() => ({
    items: [],
    totalItems: 0,
    totalPages: 1,
    currentPage: 1,
  }));

  return (
    <div className="flex flex-col gap-6">
      <AdminBlogCategoriesClient
        locale={locale}
        messages={messages}
        initialItems={result.items}
        initialTotalItems={result.totalItems}
        initialTotalPages={result.totalPages}
        initialCurrentPage={result.currentPage}
        userRole={session.user.role}
      />
    </div>
  );
}
