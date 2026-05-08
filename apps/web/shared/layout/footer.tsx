import { Mail } from 'lucide-react';
import Link from 'next/link';

import { Separator } from '@/components/ui/separator';
import type { Locale, Messages } from '@/shared/i18n';

import { Logo } from './_components/logo';
import { footerColumns, navGroups } from './_data/nav';

type Props = {
  locale: Locale;
  messages: Messages;
};

function buildHref(locale: Locale, href: string): string {
  if (href === '#') return '#';
  if (href.startsWith('http')) return href;
  return `/${locale}${href}`;
}

export function Footer({ locale, messages }: Props) {
  return (
    <footer className="border-t border-border/60 bg-muted/30">
      <div className="mx-auto w-full max-w-[1280px] px-4 py-12 sm:px-6 lg:px-10 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_3fr]">
          <div className="space-y-4">
            <Logo href={`/${locale}`} />
            <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
              {messages.footer.address}
            </p>
            <Link
              href={`mailto:${messages.footer.email}`}
              className="inline-flex items-center gap-2 text-sm font-medium underline-offset-4 hover:underline"
            >
              <Mail className="size-4" aria-hidden />
              {messages.footer.email}
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {footerColumns.map(({ id, group }) => {
              const navGroup = navGroups.find((g) => g.id === group);
              if (!navGroup) return null;
              return (
                <div key={id} className="space-y-3">
                  <h3 className="text-sm font-semibold text-foreground">
                    {messages.footer.columns[id]}
                  </h3>
                  <ul className="space-y-2">
                    {navGroup.items.map((item) => (
                      <li key={item.labelKey}>
                        <Link
                          href={buildHref(locale, item.href)}
                          className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                        >
                          {messages.nav[item.labelKey]}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>

        <Separator className="my-8" />

        <p className="text-xs text-muted-foreground">
          {messages.footer.copyright}
        </p>
      </div>
    </footer>
  );
}
