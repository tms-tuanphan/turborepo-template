import { notFound } from 'next/navigation';

import { AdminBlogForm, listAdminBlogCategories } from '@/features/admin-blogs';
import { getMessages, isLocale, type Locale } from '@/shared/i18n';

type Params = Promise<{ locale: string }>;

export default async function AdminBlogNewPage({ params }: { params: Params }) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) {
    notFound();
  }
  const locale: Locale = rawLocale;
  const messages = getMessages(locale);
  const categories = await listAdminBlogCategories().catch(() => []);

  if (categories.length === 0) {
    notFound();
  }

  return (
    <div className="flex flex-1 flex-col">
      <AdminBlogForm
        mode="create"
        locale={locale}
        messages={messages}
        categories={categories}
      />
    </div>
  );
}
