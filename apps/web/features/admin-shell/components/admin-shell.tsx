import type { AuthUserRole } from '@repo/api/client';

import type { Locale, Messages } from '@/shared/i18n';

import { AdminNavLinks } from './admin-nav-links';
import { AdminShellClient } from './admin-shell-client';

type AdminShellProps = {
  locale: Locale;
  messages: Messages;
  userEmail: string | null;
  userName: string | null;
  userRole: AuthUserRole;
  children: React.ReactNode;
};

export function AdminShell({
  locale,
  messages,
  userEmail,
  userName,
  userRole,
  children,
}: AdminShellProps) {
  const t = messages.admin.shell;
  const homeHref = `/${locale}/admin/blogs`;
  const nav = (
    <AdminNavLinks locale={locale} messages={messages} userRole={userRole} />
  );

  return (
    <AdminShellClient
      locale={locale}
      messages={messages}
      userEmail={userEmail}
      userName={userName}
      homeHref={homeHref}
      logoAria={t.logoAria}
      navLabel={t.navLabel}
      collapseLabel={t.collapseSidebar}
      expandLabel={t.expandSidebar}
      mobileNav={nav}
    >
      {children}
    </AdminShellClient>
  );
}
