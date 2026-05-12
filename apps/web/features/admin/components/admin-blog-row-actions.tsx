'use client';

import { MoreHorizontalIcon, PencilIcon, Trash2Icon } from 'lucide-react';
import Link from 'next/link';
import { useTransition } from 'react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { deleteBlogAction } from '@/app/[locale]/(admin)/admin/(main)/blogs/_actions/blog-actions';
import type { Locale, Messages } from '@/shared/i18n';

type AdminBlogRowActionsProps = {
  locale: Locale;
  blogId: string;
  messages: Messages;
};

export function AdminBlogRowActions({
  locale,
  blogId,
  messages,
}: AdminBlogRowActionsProps) {
  const t = messages.admin.blogs.actions;
  const editHref = `/${locale}/admin/blogs/${blogId}/edit`;
  const [pending, startTransition] = useTransition();

  function onDelete() {
    if (!window.confirm(t.confirmDelete)) return;
    startTransition(() => {
      const fd = new FormData();
      fd.set('id', blogId);
      fd.set('locale', locale);
      void deleteBlogAction(fd);
    });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-8"
          aria-label={messages.admin.blogs.columns.actions}
        >
          <MoreHorizontalIcon className="size-4" aria-hidden />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuItem asChild>
          <Link
            href={editHref}
            className="flex cursor-pointer items-center gap-2"
          >
            <PencilIcon className="size-4" aria-hidden />
            {t.edit}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="text-destructive focus:text-destructive"
          disabled={pending}
          onSelect={(e) => e.preventDefault()}
          onClick={onDelete}
        >
          <span className="flex items-center gap-2">
            <Trash2Icon className="size-4" aria-hidden />
            {t.delete}
          </span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
