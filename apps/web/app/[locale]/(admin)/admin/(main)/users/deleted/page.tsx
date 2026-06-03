import { notFound } from 'next/navigation';

import { AdminDeletedUsersClient } from '@/features/admin-users';
import { getMessages, isLocale, type Locale } from '@/shared/i18n';

type Params = Promise<{ locale: string }>;

export default async function AdminDeletedUsersPage({
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

  return <AdminDeletedUsersClient locale={locale} messages={messages} />;
}
