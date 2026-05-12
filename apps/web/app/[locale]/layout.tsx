import { notFound } from 'next/navigation';

import { defaultLocale, isLocale, locales, type Locale } from '@/shared/i18n';

import { HtmlLang } from '../_components/html-lang';

type Params = Promise<{ locale: string }>;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
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
  const locale: Locale = isLocale(rawLocale) ? rawLocale : defaultLocale;

  return (
    <>
      <HtmlLang locale={locale} />
      {children}
    </>
  );
}
