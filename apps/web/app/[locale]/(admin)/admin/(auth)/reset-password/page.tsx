import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

import { AdminResetPasswordForm } from '@/features/admin-auth';
import { AuthFormFallback } from '@/features/admin-auth/components/auth-form-fallback';
import { redirectIfAdminSession } from '@/features/admin-auth';
import {
  defaultLocale,
  getMessages,
  isLocale,
  type Locale,
} from '@/shared/i18n';

type Params = Promise<{ locale: string }>;

export default async function AdminResetPasswordPage({
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

  return (
    <Suspense fallback={<AuthFormFallback />}>
      <AdminResetPasswordForm locale={locale} messages={messages} />
    </Suspense>
  );
}
