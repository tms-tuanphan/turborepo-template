'use client';

import { CheckIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import type { BlogStatus } from '@/shared/types/blog';

type AdminBlogDocumentStatusProps = {
  status: BlogStatus;
  statusLabel: string;
  saved?: boolean;
  savedLabel?: string;
  className?: string;
};

export function AdminBlogDocumentStatus({
  status,
  statusLabel,
  saved,
  savedLabel,
  className,
}: AdminBlogDocumentStatusProps) {
  return (
    <div
      className={cn(
        'flex min-w-0 flex-col items-center justify-center gap-0.5 text-center',
        className,
      )}
    >
      <span className="inline-flex items-center gap-1.5 rounded-full bg-muted/60 px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
        <span
          className={cn(
            'size-1.5 shrink-0 rounded-full',
            status === 'PUBLISHED' && 'bg-emerald-500',
            status === 'DRAFT' && 'bg-amber-500',
            status === 'REVIEWING' && 'bg-sky-500',
            status === 'SCHEDULED' && 'bg-violet-500',
            status === 'ARCHIVED' && 'bg-zinc-400',
          )}
          aria-hidden
        />
        {statusLabel}
      </span>
      {saved && savedLabel ? (
        <span
          className="inline-flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400"
          role="status"
        >
          <CheckIcon className="size-3 shrink-0" aria-hidden />
          {savedLabel}
        </span>
      ) : null}
    </div>
  );
}
