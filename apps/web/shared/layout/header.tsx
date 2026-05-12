import Link from 'next/link';
import { Suspense } from 'react';

import { Button } from '@/components/ui/button';
import type { Locale, Messages } from '@/shared/i18n';

import { DesktopNav } from './_components/desktop-nav';
import { LanguageSwitcher } from './_components/language-switcher';
import { Logo } from './_components/logo';
import { MobileNav } from './_components/mobile-nav';
import { StickyHeader } from './_components/sticky-header';

type Props = {
  locale: Locale;
  messages: Messages;
};

export function Header({ locale, messages }: Props) {
  return (
    <StickyHeader
      className="sticky top-0 z-40 w-full bg-background transition-shadow"
      scrolledClassName="shadow-md"
    >
      <div className="mx-auto flex min-h-18 w-full items-center justify-between gap-6 px-4 py-2 sm:px-6 lg:px-20 lg:py-4">
        <div className="flex items-center gap-10">
          <Logo href={`/${locale}`} />
          <DesktopNav locale={locale} messages={messages} />
        </div>

        <div className="flex items-center gap-1.5 sm:gap-3">
          <Suspense fallback={<div className="h-10 w-20" />}>
            <LanguageSwitcher locale={locale} messages={messages} />
          </Suspense>
          <Button
            asChild
            className="hidden bg-brand px-5 text-base font-medium text-brand-foreground hover:bg-brand/90 sm:inline-flex"
          >
            <Link href={`/${locale}/contact`}>{messages.cta.contact}</Link>
          </Button>
          <MobileNav locale={locale} messages={messages} />
        </div>
      </div>
    </StickyHeader>
  );
}
