import { notFound } from 'next/navigation';

import { AdminBlogForm } from '@/features/admin-blogs';
import { getBlogById } from '@/features/blogs';
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
  const post = getBlogById(id);
  if (!post) {
    notFound();
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-1 flex-col">
      <AdminBlogForm
        mode="edit"
        locale={locale}
        messages={messages}
        initial={post}
      />
    </div>
  );
}
