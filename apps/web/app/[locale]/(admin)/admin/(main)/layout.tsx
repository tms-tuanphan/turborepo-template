import { notFound } from 'next/navigation';

import { Toaster } from '@/components/ui/sonner';
import { auth } from '@/core/lib/auth';
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
  const session = await auth();
  const messages = getMessages(locale);

  return (
    <AdminShell
      locale={locale}
      messages={messages}
      userEmail={session?.user?.email ?? null}
      userName={session?.user?.name ?? null}
      userRole={session?.user?.role ?? 'sub_admin'}
    >
      {children}
      <Toaster richColors position="top-right" />
    </AdminShell>
  );
}
