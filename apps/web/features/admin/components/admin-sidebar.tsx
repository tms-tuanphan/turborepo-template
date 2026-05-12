'use client';

import { LogOutIcon } from 'lucide-react';
import { signOut } from 'next-auth/react';
import { useId } from 'react';

import { Button } from '@/components/ui/button';
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
  signOutCallbackUrl,
  children,
}: AdminSidebarProps) {
  const navId = useId();

  return (
    <aside
      id={id}
      className={cn(
        'hidden shrink-0 flex-col bg-primary/05 transition-[width] duration-200 ease-out md:flex',
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
          priority={false}
          className={cn(collapsed && 'justify-center')}
          imageClassName={cn(collapsed && 'h-6 max-w-[2.5rem]')}
        />
      </div>
      <AdminSidebarCollapsedProvider value={collapsed}>
        <nav
          id={navId}
          className="min-h-0 flex-1 overflow-y-auto px-3 py-5"
          aria-label={navLabel}
        >
          {children}
        </nav>
      </AdminSidebarCollapsedProvider>
      <div className="shrink-0 p-2 mb-5">
        <Button
          type="button"
          variant={collapsed ? 'ghost' : 'outline'}
          size="sm"
          className={cn(
            'w-full gap-2 cursor-pointer bg-primary/05 relative',
            collapsed ? 'justify-center px-0' : 'justify-center',
          )}
          onClick={() => {
            void signOut({ callbackUrl: signOutCallbackUrl });
          }}
          aria-label={signOutLabel}
        >
          <LogOutIcon
            className="size-4 shrink-0 absolute left-3 top-1/2 -translate-y-1/2"
            aria-hidden
          />
          {!collapsed ? <span className="truncate">{signOutLabel}</span> : null}
        </Button>
      </div>
    </aside>
  );
}
