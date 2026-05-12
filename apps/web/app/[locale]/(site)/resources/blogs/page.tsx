import { notFound } from 'next/navigation';

import { BlogsPage, parseBlogFilters } from '@/features/blogs';
import {
  defaultLocale,
  getMessages,
  isLocale,
  type Locale,
} from '@/shared/i18n';

type Params = Promise<{ locale: string }>;
type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function BlogsRoute({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: SearchParams;
}) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) {
    notFound();
  }
  const locale: Locale = isLocale(rawLocale) ? rawLocale : defaultLocale;
  const messages = getMessages(locale);

  const rawSearchParams = await searchParams;
  const filters = parseBlogFilters(rawSearchParams);

  return <BlogsPage locale={locale} messages={messages} filters={filters} />;
}
