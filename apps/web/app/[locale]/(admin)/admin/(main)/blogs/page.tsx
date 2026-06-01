import { notFound } from 'next/navigation';

import { AdminBlogsPageClient } from '@/features/admin-blogs/components/admin-blogs-page-client';
import { getMessages, isLocale, type Locale } from '@/shared/i18n';

type Params = Promise<{ locale: string }>;

export default async function AdminBlogsPage({ params }: { params: Params }) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) {
    notFound();
  }
  const locale: Locale = rawLocale;
  const messages = getMessages(locale);

  return <AdminBlogsPageClient locale={locale} messages={messages} />;
}
