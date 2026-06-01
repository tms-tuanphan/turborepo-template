import { notFound } from 'next/navigation';

import { AdminBlogCategoriesClient } from '@/features/admin-blog-categories';
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
  const messages = getMessages(locale);

  return (
    <div className="flex flex-col gap-6">
      <AdminBlogCategoriesClient locale={locale} messages={messages} />
    </div>
  );
}
