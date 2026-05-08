import Link from 'next/link';

import { cn } from '@/lib/utils';

type Props = {
  href: string;
  className?: string;
};

export function Logo({ href, className }: Props) {
  return (
    <Link
      href={href}
      aria-label="DXODX home"
      className={cn(
        'inline-flex items-baseline gap-0.5 text-3xl font-bold tracking-tight text-foreground',
        className,
      )}
    >
      <span>DXODX</span>
      <span
        aria-hidden
        className="ml-0.5 inline-block size-1.5 rounded-full bg-brand"
      />
    </Link>
  );
}
