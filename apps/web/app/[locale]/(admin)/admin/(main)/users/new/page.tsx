import { notFound } from 'next/navigation';

import { AdminUserCreateForm } from '@/features/admin-users';
import { getMessages, isLocale, type Locale } from '@/shared/i18n';

type Params = Promise<{ locale: string }>;

export default async function AdminUserNewPage({ params }: { params: Params }) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) {
    notFound();
  }
  const locale: Locale = rawLocale;
  const messages = getMessages(locale);
  const t = messages.admin.users;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          {t.newPageTitle}
        </h1>
        <p className="text-sm text-muted-foreground">{t.newPageDescription}</p>
      </div>
      <AdminUserCreateForm locale={locale} messages={messages} />
    </div>
  );
}
