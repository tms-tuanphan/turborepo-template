'use client';

import {
  BookOpenIcon,
  LayoutDashboardIcon,
  PackageIcon,
  SparklesIcon,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@/lib/utils';
import type { Locale, Messages } from '@/shared/i18n';

import { useAdminSidebarCollapsed } from './admin-sidebar-collapse-context';

type AdminNavLinksProps = {
  locale: Locale;
  messages: Messages;
};

type IconType = React.ComponentType<{
  className?: string;
  'aria-hidden'?: boolean;
}>;

function NavLinkRow({
  href,
  label,
  icon: Icon,
  active,
  collapsed,
}: {
  href: string;
  label: string;
  icon: IconType;
  active: boolean;
  collapsed: boolean;
}) {
  return (
    <Link
      href={href}
      title={collapsed ? label : undefined}
      className={cn(
        'flex items-center gap-2 rounded-md py-2 text-sm font-medium transition-colors',
        collapsed ? 'justify-center px-0' : 'px-3',
        active
          ? 'bg-muted text-foreground'
          : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground',
      )}
    >
      <Icon className="size-4 shrink-0" aria-hidden />
      {!collapsed ? <span className="truncate">{label}</span> : null}
    </Link>
  );
}

export function AdminNavLinks({ locale, messages }: AdminNavLinksProps) {
  const pathname = usePathname();
  const collapsed = useAdminSidebarCollapsed();
  const t = messages.admin.shell.nav;

  const introHref = `/${locale}/admin`;
  const blogsHref = `/${locale}/admin/blogs`;
  const productsHref = `/${locale}/admin/products`;
  const aiHref = `/${locale}/admin/ai-driven-development`;

  const introActive = pathname === introHref || pathname === `${introHref}/`;

  const blogActive =
    pathname === blogsHref || pathname.startsWith(`${blogsHref}/`);
  const productsActive =
    pathname === productsHref || pathname.startsWith(`${productsHref}/`);
  const aiActive = pathname === aiHref || pathname.startsWith(`${aiHref}/`);

  return (
    <div className="flex flex-col gap-4">
      <ul className="flex flex-col gap-0.5">
        <li>
          <NavLinkRow
            href={introHref}
            label={t.intro}
            icon={LayoutDashboardIcon}
            active={introActive}
            collapsed={collapsed}
          />
        </li>
      </ul>

      <section aria-label={t.resources} className="flex flex-col gap-1 pt-4">
        {!collapsed ? (
          <p className="px-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {t.resources}
          </p>
        ) : null}
        <ul className="flex flex-col gap-0.5">
          <li>
            <NavLinkRow
              href={blogsHref}
              label={t.blog}
              icon={BookOpenIcon}
              active={blogActive}
              collapsed={collapsed}
            />
          </li>
          <li>
            <NavLinkRow
              href={productsHref}
              label={t.products}
              icon={PackageIcon}
              active={productsActive}
              collapsed={collapsed}
            />
          </li>
        </ul>
      </section>

      <ul className="flex flex-col gap-0.5 pt-4">
        <li>
          <NavLinkRow
            href={aiHref}
            label={t.aiDriven}
            icon={SparklesIcon}
            active={aiActive}
            collapsed={collapsed}
          />
        </li>
      </ul>
    </div>
  );
}
