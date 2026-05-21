'use client';

import { LogOutIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useId, useState } from 'react';

import { Button } from '@/components/ui/button';
import { logoutAdmin } from '@/core/auth/session-client';
import { cn } from '@/lib/utils';
import { Logo } from '@/shared/layout/_components/logo';

import { AdminSidebarCollapsedProvider } from './admin-sidebar-collapse-context';

type AdminSidebarProps = {
  id?: string;
  homeHref: string;
  logoAria: string;
  navLabel: string;
  collapsed: boolean;
  signOutLabel: string;
  signOutErrorLabel: string;
  signOutCallbackUrl: string;
  children: React.ReactNode;
};

export function AdminSidebar({
  id,
  homeHref,
  logoAria,
  navLabel,
  collapsed,
  signOutLabel,
  signOutErrorLabel,
  signOutCallbackUrl,
  children,
}: AdminSidebarProps) {
  const navId = useId();
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);
  const [signOutError, setSignOutError] = useState<string | null>(null);

  async function handleSignOut() {
    setSignOutError(null);
    setSigningOut(true);
    try {
      const result = await logoutAdmin();
      if (result.ok) {
        router.push(signOutCallbackUrl);
        router.refresh();
        return;
      }
      setSignOutError(signOutErrorLabel);
    } finally {
      setSigningOut(false);
    }
  }

  return (
    <aside
      id={id}
      className={cn(
        'hidden h-full min-h-0 shrink-0 flex-col overflow-hidden bg-primary/05 transition-[width] duration-200 ease-out md:flex',
        collapsed ? 'w-14' : 'w-60',
      )}
    >
      <div
        className={cn(
          'flex h-16 shrink-0 items-center px-3 justify-center',
          collapsed ? 'justify-center' : 'gap-2 px-4',
        )}
      >
        <Logo
          href={homeHref}
          ariaLabel={logoAria}
          className={cn(collapsed && 'justify-center')}
          imageClassName={cn(collapsed && 'h-6 max-w-[2.5rem]')}
        />
      </div>
      <AdminSidebarCollapsedProvider value={collapsed}>
        <nav
          id={navId}
          className="min-h-0 flex-1 overflow-hidden px-3 py-5"
          aria-label={navLabel}
        >
          {children}
        </nav>
      </AdminSidebarCollapsedProvider>
      <div className="shrink-0 space-y-2 p-2 mb-5">
        {signOutError ? (
          <p className="text-xs text-destructive" role="alert">
            {signOutError}
          </p>
        ) : null}
        <Button
          type="button"
          variant={collapsed ? 'ghost' : 'outline'}
          size="sm"
          className={cn(
            'w-full gap-2 cursor-pointer bg-transparent border-none shadow-none relative',
            collapsed ? 'justify-center px-0' : 'justify-center',
          )}
          onClick={() => {
            void handleSignOut();
          }}
          disabled={signingOut}
          aria-label={signOutLabel}
        >
          <LogOutIcon
            className="size-4 shrink-0 absolute left-3 top-1/2 -translate-y-1/2"
            aria-hidden
          />
          {!collapsed ? (
            <span className="truncate text-base">{signOutLabel}</span>
          ) : null}
        </Button>
      </div>
    </aside>
  );
}
