import Link from 'next/link';

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { cn } from '@/lib/utils';
import type { Locale, Messages } from '@/shared/i18n';

import { headerNavItems } from '../_data/nav';

type Props = {
  locale: Locale;
  messages: Messages;
};

function buildHref(locale: Locale, href: string): string {
  if (href === '#') return '#';
  if (href.startsWith('http')) return href;
  return `/${locale}${href}`;
}

const navLinkClassName =
  'h-full inline-flex items-center rounded-md bg-transparent px-4 py-2.5 text-base! font-medium text-foreground/80 transition-colors hover:bg-accent/60 hover:text-foreground';

export function DesktopNav({ locale, messages }: Props) {
  return (
    <NavigationMenu viewport={false} className="hidden lg:flex">
      <NavigationMenuList className="gap-2">
        {headerNavItems.map((entry) =>
          entry.type === 'link' ? (
            <NavigationMenuItem key={entry.id}>
              <NavigationMenuLink asChild>
                <Link
                  href={buildHref(locale, entry.href)}
                  className={navLinkClassName}
                >
                  {messages.nav[entry.labelKey]}
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          ) : (
            <NavigationMenuItem key={entry.id}>
              <NavigationMenuTrigger className="bg-transparent text-base! font-medium text-foreground/80 hover:bg-accent/60">
                {messages.nav[entry.labelKey]}
              </NavigationMenuTrigger>
              <NavigationMenuContent className="w-max">
                <ul className="flex min-w-max flex-col gap-1 p-2">
                  {entry.items.map((item) => (
                    <li key={item.labelKey}>
                      <NavigationMenuLink asChild>
                        <Link
                          href={buildHref(locale, item.href)}
                          className={cn(
                            'block rounded-md px-3 py-2.5 text-base! font-medium leading-snug whitespace-nowrap text-foreground/80 transition-colors hover:bg-accent hover:text-foreground',
                          )}
                        >
                          {messages.nav[item.labelKey]}
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          ),
        )}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
