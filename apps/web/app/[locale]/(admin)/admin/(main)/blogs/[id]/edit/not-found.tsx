import Link from 'next/link';

import { Button } from '@/components/ui/button';
import {
  defaultLocale,
  getMessages,
  isLocale,
  type Locale,
} from '@/shared/i18n';

type Params = Promise<{ locale: string; id: string }>;

export default async function AdminBlogEditNotFound({
  params,
}: {
  params: Params;
}) {
  const { locale: rawLocale } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : defaultLocale;
  const messages = getMessages(locale);

  return (
    <div className="mx-auto flex max-w-lg flex-col gap-4 py-12 text-center">
      <h1 className="text-xl font-semibold">
        {messages.admin.blogs.form.errors.notFound}
      </h1>
      <Button type="button" asChild>
        <Link href={`/${locale}/admin/blogs`}>
          {messages.admin.blogs.actions.cancel}
        </Link>
      </Button>
    </div>
  );
}
