import { notFound } from 'next/navigation';

import { getMessages, isLocale } from '@/shared/i18n';

type Params = Promise<{ locale: string }>;

export default async function AdminIntroPage({ params }: { params: Params }) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) {
    notFound();
  }
  getMessages(rawLocale);

  return (
    <div className="flex flex-col gap-6">
      {/** Page title lives in the admin header. */}
    </div>
  );
}
