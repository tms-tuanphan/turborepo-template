import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';

import { AdminResetPasswordSuccess } from '@/features/admin-auth';
import { redirectIfAdminSession } from '@/features/admin-auth/lib/redirect-if-admin-session';
import {
  defaultLocale,
  getMessages,
  isLocale,
  type Locale,
} from '@/shared/i18n';

type Params = Promise<{ locale: string }>;

export default async function AdminResetPasswordSuccessPage({
  params,
}: {
  params: Params;
}) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) {
    notFound();
  }
  const locale: Locale = isLocale(rawLocale) ? rawLocale : defaultLocale;
  const cookieStore = await cookies();
  redirectIfAdminSession(cookieStore, locale);

  const messages = getMessages(locale);

  return <AdminResetPasswordSuccess locale={locale} messages={messages} />;
}
