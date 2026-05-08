import { notFound } from 'next/navigation';

import { Footer, Header } from '@/shared/layout';
import {
  defaultLocale,
  getMessages,
  isLocale,
  locales,
  type Locale,
} from '@/shared/i18n';

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
  const messages = getMessages(locale);

  return (
    <>
      <HtmlLang locale={locale} />
      <div className="flex min-h-svh flex-col">
        <Header locale={locale} messages={messages} />
        <main className="flex-1">{children}</main>
        <Footer locale={locale} messages={messages} />
      </div>
    </>
  );
}
