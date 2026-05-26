import { Badge } from '@/components/ui/badge';
import type { BlogApiStatus } from '@repo/api/client';
import type { Messages } from '@/shared/i18n';

import { cn } from '@/lib/utils';

type AdminBlogStatusBadgeProps = {
  status: BlogApiStatus;
  messages: Messages;
};

export function AdminBlogStatusBadge({
  status,
  messages,
}: AdminBlogStatusBadgeProps) {
  const t = messages.admin.blogs.status;
  const label = status === 'PUBLISHED' ? t.published : t.unpublished;

  return (
    <Badge
      variant="secondary"
      className={cn(
        'whitespace-nowrap font-normal',
        status === 'PUBLISHED' &&
          'bg-emerald-600/15 text-emerald-800 dark:text-emerald-200',
        status === 'UNPUBLISHED' && 'bg-muted text-muted-foreground',
      )}
    >
      {label}
    </Badge>
  );
}
