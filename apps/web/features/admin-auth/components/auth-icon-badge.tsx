import type { LucideIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

type AuthIconBadgeProps = {
  icon: LucideIcon;
  className?: string;
  size?: 'default' | 'lg';
};

export function AuthIconBadge({
  icon: Icon,
  className,
  size = 'default',
}: AuthIconBadgeProps) {
  return (
    <div
      className={cn(
        'mx-auto flex items-center justify-center rounded-full bg-primary text-primary-foreground',
        size === 'lg' ? 'size-16' : 'size-14',
        className,
      )}
    >
      <Icon
        className={size === 'lg' ? 'size-8' : 'size-7'}
        strokeWidth={1.75}
        aria-hidden
      />
    </div>
  );
}
