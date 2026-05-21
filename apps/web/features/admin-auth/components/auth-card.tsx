import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';

import type { LucideIcon } from 'lucide-react';

import { AuthBackLink } from './auth-back-link';
import { AuthIconBadge } from './auth-icon-badge';

type AuthCardProps = {
  title: string;
  description?: string;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  backHref?: string;
  backLabel?: string;
  icon?: LucideIcon;
  iconSize?: 'default' | 'lg';
  headerAlign?: 'center' | 'start';
  className?: string;
};

export function AuthCard({
  title,
  description,
  children,
  footer,
  backHref,
  backLabel,
  icon,
  iconSize,
  headerAlign = 'center',
  className,
}: AuthCardProps) {
  const centered = headerAlign === 'center';

  return (
    <Card
      className={cn('relative mx-auto w-full max-w-md shadow-sm', className)}
    >
      {backHref && backLabel ? (
        <AuthBackLink href={backHref} label={backLabel} variant="corner" />
      ) : null}
      <CardHeader className={cn('space-y-3', centered && 'text-center')}>
        {icon ? <AuthIconBadge icon={icon} size={iconSize} /> : null}
        <div className="space-y-1">
          <CardTitle className="text-2xl font-semibold tracking-tight">
            {title}
          </CardTitle>
          {description ? (
            <CardDescription>{description}</CardDescription>
          ) : null}
        </div>
      </CardHeader>
      {children ? <CardContent>{children}</CardContent> : null}
      {footer ? (
        <CardFooter className="flex flex-col items-center gap-4 pb-6">
          {footer}
        </CardFooter>
      ) : null}
    </Card>
  );
}
