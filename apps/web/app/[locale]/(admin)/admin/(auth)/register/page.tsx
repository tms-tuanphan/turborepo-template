import { redirect } from 'next/navigation';

import { isLocale } from '@/shared/i18n';

type Params = Promise<{ locale: string }>;

export default async function AdminRegisterPage({
  params,
}: {
  params: Params;
}) {
  const { locale: rawLocale } = await params;
  const locale = isLocale(rawLocale) ? rawLocale : 'en';
  redirect(`/${locale}/admin/login`);
}
