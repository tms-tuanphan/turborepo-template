import Link from 'next/link';
import { Suspense } from 'react';

import { Button } from '@/components/ui/button';
import type { Locale, Messages } from '@/shared/i18n';

import { DesktopNav } from './_components/desktop-nav';
import { LanguageSwitcher } from './_components/language-switcher';
import { Logo } from './_components/logo';
import { MobileNav } from './_components/mobile-nav';

type Props = {
  locale: Locale;
  messages: Messages;
};

export function Header({ locale, messages }: Props) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80">
      <div className="mx-auto flex w-full items-center justify-between gap-6 p-4 sm:px-6 lg:px-20">
        <div className="flex items-center gap-10">
          <Logo href={`/${locale}`} />
          <DesktopNav locale={locale} messages={messages} />
        </div>

        <div className="flex items-center gap-1.5 sm:gap-3">
          <Suspense fallback={<div className="h-9 w-14" />}>
            <LanguageSwitcher locale={locale} />
          </Suspense>
          <Button
            asChild
            className="hidden bg-brand text-brand-foreground hover:bg-brand/90 sm:inline-flex"
          >
            <Link href={`/${locale}/contact`}>
              {messages.cta.urgentInquiry}
            </Link>
          </Button>
          <MobileNav locale={locale} messages={messages} />
        </div>
      </div>
    </header>
  );
}
