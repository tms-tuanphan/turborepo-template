'use client';

import {
  MenuIcon,
  SquareArrowLeftIcon,
  SquareArrowRightIcon,
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import type { Messages } from '@/shared/i18n';
import { Logo } from '@/shared/layout/_components/logo';

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
            <div className="flex items-center gap-3">
              <Logo href={homeHref} ariaLabel={logoAria} priority={false} />
              <span className="text-sm font-semibold tracking-tight">
                {t.brand}
              </span>
            </div>
          </SheetHeader>
          <div className="p-3">{mobileNav}</div>
        </SheetContent>
      </Sheet>

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

      <div className="flex shrink-0 items-center gap-1">
        <span className="max-w-[200px] truncate text-base text-muted-foreground">
          {displayName}
        </span>
      </div>
    </header>
  );
}
