import { notFound } from 'next/navigation';

import { AdminBlogEditorPageClient } from '@/features/admin-blogs';
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

  return (
    <AdminBlogEditorPageClient
      mode="edit"
      locale={locale}
      messages={messages}
      postId={id}
    />
  );
}
