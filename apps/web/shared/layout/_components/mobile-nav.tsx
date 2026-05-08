'use client';

import { ChevronDown, Menu } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import type { Locale, Messages } from '@/shared/i18n';

import { navGroups, type NavGroupId } from '../_data/nav';

type Props = {
  locale: Locale;
  messages: Messages;
};

function buildHref(locale: Locale, href: string): string {
  if (href === '#') return '#';
  if (href.startsWith('http')) return href;
  return `/${locale}${href}`;
}

export function MobileNav({ locale, messages }: Props) {
  const [openGroup, setOpenGroup] = useState<NavGroupId | null>(null);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Open menu"
          className="lg:hidden"
        >
          <Menu className="size-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-sm">
        <SheetHeader>
          <SheetTitle>{messages.nav.about}</SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col gap-1 px-4 pb-6">
          {navGroups.map((group) => {
            const isOpen = openGroup === group.id;
            return (
              <div key={group.id}>
                <button
                  type="button"
                  onClick={() =>
                    setOpenGroup((prev) =>
                      prev === group.id ? null : group.id,
                    )
                  }
                  className="flex w-full items-center justify-between rounded-md px-3 py-2.5 text-left text-base font-medium hover:bg-accent"
                  aria-expanded={isOpen}
                >
                  {messages.nav[group.labelKey]}
                  <ChevronDown
                    className={cn(
                      'size-4 transition-transform',
                      isOpen && 'rotate-180',
                    )}
                  />
                </button>
                {isOpen ? (
                  <ul className="mt-1 flex flex-col gap-0.5 pl-4">
                    {group.items.map((item) => (
                      <li key={item.labelKey}>
                        <SheetClose asChild>
                          <Link
                            href={buildHref(locale, item.href)}
                            className="block rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-foreground"
                          >
                            {messages.nav[item.labelKey]}
                          </Link>
                        </SheetClose>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            );
          })}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
