'use client';

import { PlusIcon } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import type { Locale, Messages } from '@/shared/i18n';

type UsersToolbarProps = {
  locale: Locale;
  messages: Messages;
  showCreate?: boolean;
};

export function UsersToolbar({
  locale,
  messages,
  showCreate = true,
}: UsersToolbarProps) {
  const t = messages.admin.users;

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex gap-2">
        <Button type="button" variant="outline" asChild>
          <Link href={`/${locale}/admin/users`}>{t.tabs.active}</Link>
        </Button>
        <Button type="button" variant="outline" asChild>
          <Link href={`/${locale}/admin/users/deleted`}>{t.tabs.deleted}</Link>
        </Button>
      </div>
      {showCreate ? (
        <Button type="button" asChild>
          <Link href={`/${locale}/admin/users/new`}>
            <PlusIcon className="size-4" aria-hidden />
            {t.actions.create}
          </Link>
        </Button>
      ) : null}
    </div>
  );
}
