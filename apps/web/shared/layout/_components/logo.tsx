import Image from 'next/image';
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
      className={cn('inline-flex items-center', className)}
    >
      <Image
        src="/logo.png"
        alt=""
        width={201}
        height={36}
        className="h-7 w-auto object-contain object-left"
        priority
      />
    </Link>
  );
}
