'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@/lib/utils';
import type { Locale, Messages } from '@/shared/i18n';

type AdminNavLinksProps = {
  locale: Locale;
  messages: Messages;
};

export function AdminNavLinks({ locale, messages }: AdminNavLinksProps) {
  const pathname = usePathname();
  const t = messages.admin.shell.nav;
  const blogsHref = `/${locale}/admin/blogs`;
  const items = [{ href: blogsHref, label: t.blogs }];

  return (
    <ul className="flex flex-col gap-0.5">
      {items.map((item) => {
        const active =
          pathname === item.href || pathname.startsWith(`${item.href}/`);

        return (
          <li key={item.href}>
            <Link
              href={item.href}
              className={cn(
                'block rounded-md px-3 py-2 text-sm font-medium transition-colors',
                active
                  ? 'bg-muted text-foreground'
                  : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground',
              )}
            >
              {item.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
