import { Badge } from '@/components/ui/badge';
import type { BlogStatus } from '@/shared/types/blog';
import type { Messages } from '@/shared/i18n';

import { cn } from '@/lib/utils';

type AdminBlogStatusBadgeProps = {
  status: BlogStatus;
  messages: Messages;
};

export function AdminBlogStatusBadge({
  status,
  messages,
}: AdminBlogStatusBadgeProps) {
  const t = messages.admin.blogs.status;
  const label =
    status === 'DRAFT'
      ? t.draft
      : status === 'REVIEWING'
        ? t.reviewing
        : status === 'SCHEDULED'
          ? t.scheduled
          : status === 'PUBLISHED'
            ? t.published
            : t.archived;

  return (
    <Badge
      variant="secondary"
      className={cn(
        'whitespace-nowrap font-normal',
        status === 'PUBLISHED' &&
          'bg-emerald-600/15 text-emerald-800 dark:text-emerald-200',
        status === 'DRAFT' && 'bg-muted text-muted-foreground',
        status === 'REVIEWING' &&
          'bg-amber-500/15 text-amber-900 dark:text-amber-100',
        status === 'SCHEDULED' &&
          'bg-sky-600/15 text-sky-900 dark:text-sky-100',
        status === 'ARCHIVED' &&
          'bg-zinc-500/15 text-zinc-800 dark:text-zinc-200',
      )}
    >
      {label}
    </Badge>
  );
}
