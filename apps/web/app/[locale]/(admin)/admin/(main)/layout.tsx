import { cookies } from 'next/headers';
import { notFound, redirect } from 'next/navigation';

import { Toaster } from '@/components/ui/sonner';
import { hasAdminSessionCookie } from '@/core/auth/session-cookie';
import { AdminShell } from '@/features/admin-shell';
import { getMessages, isLocale } from '@/shared/i18n';

type Params = Promise<{ locale: string }>;

export default async function AdminMainLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Params;
}) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) {
    notFound();
  }
  const locale = rawLocale;
  const cookieStore = await cookies();

  if (!hasAdminSessionCookie(cookieStore)) {
    const loginPath = `/${locale}/admin/login`;
    redirect(
      `${loginPath}?callbackUrl=${encodeURIComponent(`/${locale}/admin`)}`,
    );
  }

  const messages = getMessages(locale);

  return (
    <AdminShell
      locale={locale}
      messages={messages}
      userEmail={null}
      userName={null}
    >
      {children}
      <Toaster richColors position="top-right" />
    </AdminShell>
  );
}
