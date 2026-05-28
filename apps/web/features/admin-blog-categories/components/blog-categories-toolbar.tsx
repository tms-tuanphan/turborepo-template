'use client';

import { PlusIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import type { Messages } from '@/shared/i18n';

type BlogCategoriesToolbarProps = {
  canMutate: boolean;
  messages: Messages;
  onCreate: () => void;
};

export function BlogCategoriesToolbar({
  canMutate,
  messages,
  onCreate,
}: BlogCategoriesToolbarProps) {
  const t = messages.admin.blogCategories;

  if (!canMutate) {
    return (
      <p className="text-sm text-muted-foreground" role="status">
        {t.readOnlyHint}
      </p>
    );
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
