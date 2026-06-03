import type { ReactNode } from 'react';

import { requireAdminRole } from '@/features/admin-users';
import { isLocale } from '@/shared/i18n';
import { notFound } from 'next/navigation';

type Params = Promise<{ locale: string }>;

export default async function AdminUsersLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Params;
}) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) {
    notFound();
  }
  await requireAdminRole(rawLocale);
  return children;
}
