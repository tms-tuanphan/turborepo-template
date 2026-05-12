import { Footer, Header } from '@/shared/layout';
import {
  getMessages,
  defaultLocale,
  isLocale,
  type Locale,
} from '@/shared/i18n';

type Params = Promise<{ locale: string }>;

export default async function SiteLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Params;
}) {
  const { locale: rawLocale } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : defaultLocale;
  const messages = getMessages(locale);

  return (
    <div className="flex min-h-svh flex-col">
      <Header locale={locale} messages={messages} />
      <main className="flex-1">{children}</main>
      <Footer locale={locale} messages={messages} />
    </div>
  );
}
