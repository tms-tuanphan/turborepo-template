import { notFound, redirect } from 'next/navigation';

import { AdminShell } from '@/features/admin-shell';
import { auth } from '@/auth';
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
  const session = await auth();
  if (!session) {
    redirect(`/${locale}/admin/login`);
  }

  const messages = getMessages(locale);

  return (
    <AdminShell
      locale={locale}
      messages={messages}
      userEmail={session.user?.email ?? null}
      userName={session.user?.name ?? null}
    >
      {children}
    </AdminShell>
  );
}
