import type { Locale, Messages } from '@/shared/i18n';

import { AdminHeader } from './admin-header';
import { AdminNavLinks } from './admin-nav-links';
import { AdminSidebar } from './admin-sidebar';

type AdminShellProps = {
  locale: Locale;
  messages: Messages;
  userEmail: string | null;
  userName: string | null;
  children: React.ReactNode;
};

export function AdminShell({
  locale,
  messages,
  userEmail,
  userName,
  children,
}: AdminShellProps) {
  const t = messages.admin.shell;

  return (
    <div className="flex min-h-svh w-full bg-muted/30">
      <AdminSidebar brand={t.brand} navLabel={t.navLabel}>
        <AdminNavLinks locale={locale} messages={messages} />
      </AdminSidebar>
      <div className="flex min-h-svh min-w-0 flex-1 flex-col bg-background">
        <AdminHeader
          locale={locale}
          messages={messages}
          userEmail={userEmail}
          userName={userName}
          mobileNav={<AdminNavLinks locale={locale} messages={messages} />}
        />
        <main className="min-h-0 flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
}
