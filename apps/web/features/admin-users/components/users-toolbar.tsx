'use client';

import { PlusIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import type { Messages } from '@/shared/i18n';

type UsersToolbarProps = {
  canMutate: boolean;
  messages: Messages;
  onCreate: () => void;
};

export function UsersToolbar({
  canMutate,
  messages,
  onCreate,
}: UsersToolbarProps) {
  const t = messages.admin.users;

  if (!canMutate) {
    return null;
  }

  return (
    <div className="flex justify-end">
      <Button type="button" onClick={onCreate}>
        <PlusIcon className="size-4" aria-hidden />
        {t.actions.create}
      </Button>
    </div>
  );
}
