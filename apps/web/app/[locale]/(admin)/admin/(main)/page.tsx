import { notFound, redirect } from 'next/navigation';

import { isLocale } from '@/shared/i18n';

type Params = Promise<{ locale: string }>;

export default async function AdminHomePage({ params }: { params: Params }) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) {
    notFound();
  }

  redirect(`/${rawLocale}/admin/blogs`);
}
