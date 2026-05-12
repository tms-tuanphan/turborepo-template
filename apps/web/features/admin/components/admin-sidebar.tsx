'use client';

import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { useCallback, useEffect, useId, useState } from 'react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Logo } from '@/shared/layout/_components/logo';

import { AdminSidebarCollapsedProvider } from './admin-sidebar-collapse-context';

const STORAGE_KEY = 'admin-sidebar-collapsed';

type AdminSidebarProps = {
  homeHref: string;
  logoAria: string;
  navLabel: string;
  collapseLabel: string;
  expandLabel: string;
  children: React.ReactNode;
};

export function AdminSidebar({
  homeHref,
  logoAria,
  navLabel,
  collapseLabel,
  expandLabel,
  children,
}: AdminSidebarProps) {
  const navId = useId();
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

  const toggle = useCallback(() => {
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

  return (
    <aside
      className={cn(
        'hidden shrink-0 flex-col border-r bg-card transition-[width] duration-200 ease-out md:flex',
        hydrated && collapsed ? 'w-14' : 'w-60',
      )}
    >
      <div
        className={cn(
          'flex h-16 shrink-0 items-center border-b px-3 justify-center',
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
      <AdminSidebarCollapsedProvider value={collapsed && hydrated}>
        <nav
          id={navId}
          className="min-h-0 flex-1 overflow-y-auto px-3 py-5"
          aria-label={navLabel}
        >
          {children}
        </nav>
      </AdminSidebarCollapsedProvider>
      <div className="shrink-0 border-t p-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={cn(
            'w-full gap-2 text-muted-foreground',
            collapsed ? 'justify-center px-0' : 'justify-start',
          )}
          onClick={toggle}
          aria-expanded={!collapsed}
          aria-controls={navId}
          aria-label={collapsed ? expandLabel : collapseLabel}
        >
          {collapsed ? (
            <ChevronRightIcon className="size-4 shrink-0" aria-hidden />
          ) : (
            <>
              <ChevronLeftIcon className="size-4 shrink-0" aria-hidden />
              <span className="truncate">{collapseLabel}</span>
            </>
          )}
        </Button>
      </div>
    </aside>
  );
}
