import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

type AuthBackLinkProps = {
  href: string;
  label: string;
  variant?: 'corner' | 'footer';
};

export function AuthBackLink({
  href,
  label,
  variant = 'footer',
}: AuthBackLinkProps) {
  if (variant === 'corner') {
    return (
      <Link
        href={href}
        className="absolute top-4 left-4 inline-flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        aria-label={label}
      >
        <ArrowLeft className="size-5" aria-hidden />
      </Link>
    );
  }

  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
    >
      <ArrowLeft className="size-4" aria-hidden />
      {label}
    </Link>
  );
}
