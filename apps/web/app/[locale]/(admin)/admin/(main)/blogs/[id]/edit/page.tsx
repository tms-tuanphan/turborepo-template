import { notFound } from 'next/navigation';

import {
  AdminBlogForm,
  getAdminBlogById,
  listAdminBlogCategories,
} from '@/features/admin-blogs';
import { getMessages, isLocale, type Locale } from '@/shared/i18n';

type Params = Promise<{ locale: string; id: string }>;

export default async function AdminBlogEditPage({
  params,
}: {
  params: Params;
}) {
  const { locale: rawLocale, id } = await params;
  if (!isLocale(rawLocale)) {
    notFound();
  }
  const locale: Locale = rawLocale;
  const messages = getMessages(locale);

  const [post, categories] = await Promise.all([
    getAdminBlogById(id),
    listAdminBlogCategories().catch(() => []),
  ]);

  if (!post || categories.length === 0) {
    notFound();
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-1 flex-col">
      <AdminBlogForm
        mode="edit"
        locale={locale}
        messages={messages}
        categories={categories}
        initial={post}
      />
    </div>
  );
}
