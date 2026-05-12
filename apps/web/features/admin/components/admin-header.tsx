'use client';

import { BellIcon, MenuIcon } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { signOut } from 'next-auth/react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import type { Locale, Messages } from '@/shared/i18n';

type AdminHeaderProps = {
  locale: Locale;
  messages: Messages;
  userEmail: string | null;
  userName: string | null;
  mobileNav: React.ReactNode;
};

export function AdminHeader({
  locale,
  messages,
  userEmail,
  userName,
  mobileNav,
}: AdminHeaderProps) {
  const t = messages.admin.shell;
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const displayName = userName ?? userEmail ?? t.userFallback;

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <header className="flex h-16 shrink-0 items-center gap-3 border-b bg-card px-4 md:px-6">
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
            <SheetTitle>{t.brand}</SheetTitle>
          </SheetHeader>
          <div className="p-3">{mobileNav}</div>
        </SheetContent>
      </Sheet>

      <div className="flex min-w-0 flex-1 items-center md:pl-0">
        <Input
          type="search"
          placeholder={t.searchPlaceholder}
          aria-label={t.searchAria}
          disabled
          className="mx-auto max-w-md md:mx-0"
        />
      </div>

      <div className="flex shrink-0 items-center gap-1">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          disabled
          aria-label={t.notifications}
          title={t.notificationsDisabled}
        >
          <BellIcon className="size-5" aria-hidden />
        </Button>
        <span className="hidden max-w-[160px] truncate text-sm text-muted-foreground sm:inline">
          {displayName}
        </span>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => {
            void signOut({ callbackUrl: `/${locale}/admin/login` });
          }}
        >
          {t.signOut}
        </Button>
      </div>
    </header>
  );
}
