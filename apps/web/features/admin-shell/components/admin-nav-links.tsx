'use client';

import { BookOpenIcon, TagsIcon, UsersIcon } from 'lucide-react';
import type { AuthUserRole } from '@repo/api/client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@/lib/utils';
import type { Locale, Messages } from '@/shared/i18n';

import { useAdminSidebarCollapsed } from './admin-sidebar-collapse-context';

type AdminNavLinksProps = {
  locale: Locale;
  messages: Messages;
  userRole: AuthUserRole;
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
          ? 'bg-primary/20 text-foreground'
          : 'text-muted-foreground hover:bg-primary/20 hover:text-foreground',
      )}
    >
      <Icon className="size-5 shrink-0" aria-hidden />
      {!collapsed ? <span className="truncate">{label}</span> : null}
    </Link>
  );
}

export function AdminNavLinks({
  locale,
  messages,
  userRole,
}: AdminNavLinksProps) {
  const pathname = usePathname();
  const collapsed = useAdminSidebarCollapsed();
  const t = messages.admin.shell.nav;

  const blogsHref = `/${locale}/admin/blogs`;
  const blogCategoriesHref = `/${locale}/admin/blog-categories`;
  const usersHref = `/${locale}/admin/users`;

  const blogActive =
    pathname === blogsHref || pathname.startsWith(`${blogsHref}/`);
  const blogCategoriesActive =
    pathname === blogCategoriesHref ||
    pathname.startsWith(`${blogCategoriesHref}/`);
  const usersActive =
    pathname === usersHref || pathname.startsWith(`${usersHref}/`);

  return (
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
          href={blogCategoriesHref}
          label={t.blogCategories}
          icon={TagsIcon}
          active={blogCategoriesActive}
          collapsed={collapsed}
        />
      </li>
      {userRole === 'admin' ? (
        <li>
          <NavLinkRow
            href={usersHref}
            label={t.users}
            icon={UsersIcon}
            active={usersActive}
            collapsed={collapsed}
          />
        </li>
      ) : null}
    </ul>
  );
}
