import { notFound } from 'next/navigation';

import { AdminUsersClient } from '@/features/admin-users';
import { getMessages, isLocale, type Locale } from '@/shared/i18n';

type Params = Promise<{ locale: string }>;

export default async function AdminUsersPage({ params }: { params: Params }) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) {
    notFound();
  }
  const locale: Locale = rawLocale;
  const messages = getMessages(locale);

  return <AdminUsersClient locale={locale} messages={messages} />;
}
