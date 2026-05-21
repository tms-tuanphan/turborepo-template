import { cookies } from 'next/headers';
import { notFound, redirect } from 'next/navigation';
import { Suspense } from 'react';

import { Skeleton } from '@/components/ui/skeleton';
import { hasAdminSessionCookie } from '@/core/auth/session-cookie';
import { AdminLoginForm } from '@/features/admin-auth';
import {
  defaultLocale,
  getMessages,
  isLocale,
  type Locale,
} from '@/shared/i18n';

type Params = Promise<{ locale: string }>;

function LoginFormFallback() {
  return (
    <div className="mx-auto w-full max-w-md space-y-4 rounded-lg border bg-card p-6 shadow-sm">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
    </div>
  );
}

export default async function AdminLoginPage({ params }: { params: Params }) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) {
    notFound();
  }
  const locale: Locale = isLocale(rawLocale) ? rawLocale : defaultLocale;
  const cookieStore = await cookies();

  if (hasAdminSessionCookie(cookieStore)) {
    redirect(`/${locale}/admin`);
  }

  const messages = getMessages(locale);

  return (
    <Suspense fallback={<LoginFormFallback />}>
      <AdminLoginForm locale={locale} messages={messages} />
    </Suspense>
  );
}
