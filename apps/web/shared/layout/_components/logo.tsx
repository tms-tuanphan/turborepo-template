import Image from 'next/image';
import Link from 'next/link';

import { cn } from '@/lib/utils';

type Props = {
  href: string;
  className?: string;
  /** When set, used for the link `aria-label` (prefer i18n). */
  ariaLabel?: string;
  imageClassName?: string;
  priority?: boolean;
};

const DEFAULT_ARIA = 'DXODX home';

export function Logo({
  href,
  className,
  ariaLabel,
  imageClassName,
  priority = true,
}: Props) {
  return (
    <Link
      href={href}
      aria-label={ariaLabel ?? DEFAULT_ARIA}
      className={cn('inline-flex items-center', className)}
    >
      <Image
        src="/logo.png"
        alt=""
        width={201}
        height={36}
        className={cn('h-7 w-auto object-contain object-left', imageClassName)}
        priority={priority}
      />
    </Link>
  );
}
