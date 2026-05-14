'use client';

import { useCallback, useEffect, useState } from 'react';

import type { Locale, Messages } from '@/shared/i18n';

import { AdminHeader } from './admin-header';
import { AdminSidebar } from './admin-sidebar';

const STORAGE_KEY = 'admin-sidebar-collapsed';
const SIDEBAR_ID = 'admin-sidebar';

type AdminShellClientProps = {
  locale: Locale;
  messages: Messages;
  userEmail: string | null;
  userName: string | null;
  homeHref: string;
  logoAria: string;
  navLabel: string;
  collapseLabel: string;
  expandLabel: string;
  mobileNav: React.ReactNode;
  children: React.ReactNode;
};

export function AdminShellClient({
  locale,
  messages,
  userEmail,
  userName,
  homeHref,
  logoAria,
  navLabel,
  collapseLabel,
  expandLabel,
  mobileNav,
  children,
}: AdminShellClientProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === '1') {
        setCollapsed(true);
      }
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  const toggleCollapsed = useCallback(() => {
    setCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(STORAGE_KEY, next ? '1' : '0');
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  const collapseActive = hydrated && collapsed;

  return (
    <div className="flex h-svh min-h-0 w-full overflow-hidden bg-muted/30">
      <AdminSidebar
        id={SIDEBAR_ID}
        homeHref={homeHref}
        logoAria={logoAria}
        navLabel={navLabel}
        collapsed={collapseActive}
        signOutLabel={messages.admin.shell.signOut}
        signOutCallbackUrl={`/${locale}/admin/login`}
      >
        {/** Nav is passed by parent for reuse in desktop + mobile. */}
        {mobileNav}
      </AdminSidebar>
      <div className="flex h-full min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-background">
        <AdminHeader
          messages={messages}
          userEmail={userEmail}
          userName={userName}
          homeHref={homeHref}
          logoAria={logoAria}
          mobileNav={mobileNav}
          sidebarId={SIDEBAR_ID}
          collapsed={collapseActive}
          onToggleCollapsed={toggleCollapsed}
          collapseLabel={collapseLabel}
          expandLabel={expandLabel}
        />
        <main className="min-h-0 flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
}
