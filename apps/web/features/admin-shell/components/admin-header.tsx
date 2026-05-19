'use client';

import {
  MenuIcon,
  ChevronRightIcon,
  SquareArrowLeftIcon,
  SquareArrowRightIcon,
  MoonIcon,
  SunIcon,
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import type { Messages } from '@/shared/i18n';
import { Logo } from '@/shared/layout/_components/logo';

import { getAdminBreadcrumbItems } from '../lib/admin-breadcrumbs';

type AdminHeaderProps = {
  messages: Messages;
  userEmail: string | null;
  userName: string | null;
  homeHref: string;
  logoAria: string;
  mobileNav: React.ReactNode;
  sidebarId: string;
  collapsed: boolean;
  onToggleCollapsed: () => void;
  collapseLabel: string;
  expandLabel: string;
};

function AdminThemeToggle({ messages }: { messages: Messages }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const t = messages.admin.shell;

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <span
        className="inline-flex size-9 shrink-0 items-center justify-center"
        aria-hidden
      />
    );
  }

  const isDark = resolvedTheme === 'dark';

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className="size-9 shrink-0 text-foreground"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label={isDark ? t.switchToLightMode : t.switchToDarkMode}
    >
      {isDark ? (
        <SunIcon className="size-5" aria-hidden />
      ) : (
        <MoonIcon className="size-5" aria-hidden />
      )}
    </Button>
  );
}

export function AdminHeader({
  messages,
  userEmail,
  userName,
  homeHref,
  logoAria,
  mobileNav,
  sidebarId,
  collapsed,
  onToggleCollapsed,
  collapseLabel,
  expandLabel,
}: AdminHeaderProps) {
  const t = messages.admin.shell;
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const displayName = userName ?? userEmail ?? t.userFallback;
  const breadcrumbItems = getAdminBreadcrumbItems(pathname, messages);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <header className="flex h-16 shrink-0 items-center gap-3 border-b bg-card px-4 md:px-6 justify-between">
      <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            type="button"
            aria-expanded={menuOpen}
            aria-controls="admin-mobile-nav"
            aria-label={t.openMenu}
          >
            <MenuIcon className="size-5" aria-hidden />
          </Button>
        </SheetTrigger>
        <SheetContent
          side="left"
          className="w-72 gap-0 p-0"
          id="admin-mobile-nav"
        >
          <SheetHeader className="border-b p-4 text-left">
            <SheetTitle className="sr-only">{t.navLabel}</SheetTitle>
            <SheetDescription className="sr-only">
              {t.navLabel}
            </SheetDescription>
            <div className="flex items-center gap-3 justify-center">
              <Logo href={homeHref} ariaLabel={logoAria} />
            </div>
          </SheetHeader>
          <div className="p-3">{mobileNav}</div>
        </SheetContent>
      </Sheet>

      <div className="flex items-center gap-3">
        <div className="flex min-w-0 flex-1 items-center md:pl-0 max-md:hidden">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-muted-foreground cursor-pointer"
            onClick={onToggleCollapsed}
            aria-expanded={!collapsed}
            aria-controls={sidebarId}
            aria-label={collapsed ? expandLabel : collapseLabel}
          >
            {collapsed ? (
              <SquareArrowRightIcon className="size-5 shrink-0" aria-hidden />
            ) : (
              <SquareArrowLeftIcon className="size-5 shrink-0" aria-hidden />
            )}
          </Button>
        </div>

        <nav
          aria-label={t.navLabel}
          className="flex min-w-0 items-center max-md:hidden"
        >
          <ol className="flex min-w-0 items-center gap-2 text-sm text-muted-foreground">
            {breadcrumbItems.map((item, index) => {
              const isLast = index === breadcrumbItems.length - 1;
              return (
                <li
                  key={`${item.label}-${index}`}
                  className="min-w-0 text-lg flex items-center gap-1"
                >
                  {index > 0 ? (
                    <ChevronRightIcon
                      aria-hidden
                      className="inline-block size-5 text-foreground"
                    />
                  ) : null}
                  <span
                    className={
                      isLast
                        ? 'font-medium text-foreground'
                        : 'text-muted-foreground'
                    }
                  >
                    {item.label}
                  </span>
                </li>
              );
            })}
          </ol>
        </nav>

        <div className="flex min-w-0 flex-1 items-center md:hidden">
          <span className="min-w-0 truncate text-sm font-medium text-foreground">
            {breadcrumbItems[breadcrumbItems.length - 1]?.label ?? t.brand}
          </span>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <AdminThemeToggle messages={messages} />
        <span className="max-w-[200px] truncate text-lg text-foreground">
          {displayName}
        </span>
      </div>
    </header>
  );
}
