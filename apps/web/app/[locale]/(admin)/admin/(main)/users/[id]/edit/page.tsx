import { notFound } from 'next/navigation';

import { AdminApiError } from '@/core/api/fetch-admin-api';
import { AdminUserEditForm } from '@/features/admin-users';
import { getAdminUser } from '@/features/admin-users/lib/admin-users-api';
import { getMessages, isLocale, type Locale } from '@/shared/i18n';

type Params = Promise<{ locale: string; id: string }>;

export default async function AdminUserEditPage({
  params,
}: {
  params: Params;
}) {
  const { locale: rawLocale, id } = await params;
  if (!isLocale(rawLocale)) {
    notFound();
  }
  const locale: Locale = rawLocale;
  const messages = getMessages(locale);
  const t = messages.admin.users;

  let user;
  try {
    user = await getAdminUser(id);
  } catch (error) {
    if (error instanceof AdminApiError && error.status === 404) {
      notFound();
    }
    throw error;
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          {t.editPageTitle}
        </h1>
        <p className="text-sm text-muted-foreground">{t.editPageDescription}</p>
      </div>
      <AdminUserEditForm locale={locale} messages={messages} user={user} />
    </div>
  );
}
