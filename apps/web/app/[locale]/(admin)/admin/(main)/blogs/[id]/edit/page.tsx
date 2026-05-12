import { notFound } from 'next/navigation';

import { AdminBlogForm } from '@/features/admin';
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
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">
          {messages.admin.blogs.editPageTitle}
        </h1>
        <p className="text-sm text-muted-foreground">
          {messages.admin.blogs.editPageDescription}
        </p>
      </div>
      <AdminBlogForm
        mode="edit"
        locale={locale}
        messages={messages}
        initial={post}
      />
    </div>
  );
}
