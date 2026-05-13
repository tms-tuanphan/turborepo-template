import { MapPin } from 'lucide-react';
import Link from 'next/link';

import { Separator } from '@/components/ui/separator';
import type { Locale, Messages } from '@/shared/i18n';

import { Logo } from './_components/logo';
import { headerNavItems } from './_data/nav';

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
      <div className="mx-auto w-full px-4 py-12 sm:px-6 lg:p-20">
        <div className="grid gap-10 lg:grid-cols-1">
          <div className="space-y-4">
            <Logo href={`/${locale}`} priority={false} />

            <div className="space-y-3">
              <p className="text-sm font-medium leading-relaxed text-foreground md:text-base lg:text-lg">
                {messages.footer.tagline}
              </p>
              {messages.footer.addresses.map((address) => (
                <p
                  key={address}
                  className="flex gap-2 text-sm leading-relaxed text-muted-foreground md:text-base lg:text-lg"
                >
                  <MapPin
                    className="size-5 shrink-0 translate-y-px text-muted-foreground mt-1"
                    aria-hidden
                  />
                  <span>{address}</span>
                </p>
              ))}
            </div>
          </div>

          <div className="grid w-full grid-cols-2 gap-8 sm:grid-cols-4">
            {headerNavItems.map((entry) =>
              entry.type === 'link' ? (
                <div key={entry.id} className="min-w-0 space-y-3">
                  <Link
                    href={buildHref(locale, entry.href)}
                    className="block text-sm font-semibold text-foreground transition-colors hover:text-foreground/80 md:text-base lg:text-lg"
                  >
                    {messages.nav[entry.labelKey]}
                  </Link>
                </div>
              ) : (
                <div key={entry.id} className="min-w-0 space-y-3">
                  <h3 className="text-sm font-semibold text-foreground md:text-base lg:text-lg">
                    {messages.nav[entry.labelKey]}
                  </h3>
                  <ul className="space-y-2">
                    {entry.items.map((item) => (
                      <li key={item.labelKey}>
                        <Link
                          href={buildHref(locale, item.href)}
                          className="text-sm text-muted-foreground transition-colors hover:text-foreground md:text-base lg:text-lg"
                        >
                          {messages.nav[item.labelKey]}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ),
            )}
          </div>
        </div>

        <Separator className="my-8" />

        <div className="space-y-0.5 text-sm text-muted-foreground md:text-base lg:text-lg">
          {messages.footer.copyrightLines.map((line, index) => (
            <p key={index}>{line}</p>
          ))}
        </div>
      </div>
    </footer>
  );
}
