import { notFound } from 'next/navigation';

import { AdminBlogForm } from '@/features/admin';
import { getMessages, isLocale, type Locale } from '@/shared/i18n';

type Params = Promise<{ locale: string }>;

export default async function AdminBlogNewPage({ params }: { params: Params }) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) {
    notFound();
  }
  const locale: Locale = rawLocale;
  const messages = getMessages(locale);

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">
          {messages.admin.blogs.newPageTitle}
        </h1>
        <p className="text-sm text-muted-foreground">
          {messages.admin.blogs.newPageDescription}
        </p>
      </div>
      <AdminBlogForm mode="create" locale={locale} messages={messages} />
    </div>
  );
}
