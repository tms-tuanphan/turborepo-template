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
}: {
  params: Params;
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
  const categories = await listBlogCategories().catch(() => []);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          {messages.admin.blogCategories.pageTitle}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {messages.admin.blogCategories.pageDescription}
        </p>
      </div>
      <AdminBlogCategoriesClient
        locale={locale}
        messages={messages}
        categories={categories}
        userRole={session.user.role}
      />
    </div>
  );
}
