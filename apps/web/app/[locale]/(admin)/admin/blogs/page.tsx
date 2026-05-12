import { notFound, redirect } from 'next/navigation';

import { AdminBlogsTable } from '@/features/admin';
import { mockBlogs } from '@/features/blogs';
import { auth } from '@/auth';
import {
  defaultLocale,
  getMessages,
  isLocale,
  type Locale,
} from '@/shared/i18n';

type Params = Promise<{ locale: string }>;

export default async function AdminBlogsPage({ params }: { params: Params }) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) {
    notFound();
  }
  const locale: Locale = isLocale(rawLocale) ? rawLocale : defaultLocale;
  const session = await auth();

  if (!session) {
    redirect(`/${locale}/admin/login`);
  }

  const messages = getMessages(locale);
  const t = messages.admin.blogs;

  return (
    <div className="flex flex-1 flex-col gap-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">{t.pageTitle}</h1>
        <p className="text-sm text-muted-foreground">{t.pageDescription}</p>
      </header>
      <AdminBlogsTable blogs={mockBlogs} messages={messages} />
    </div>
  );
}
