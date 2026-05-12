import Link from 'next/link';

import { Button } from '@/components/ui/button';

export default function BlogsNotFound() {
  return (
    <div className="mx-auto flex w-full max-w-[640px] flex-col items-center gap-4 px-4 py-24 text-center">
      <h2 className="text-2xl font-semibold">404 — Page not found</h2>
      <p className="text-sm text-muted-foreground">
        The page you&apos;re looking for doesn&apos;t exist.
      </p>
      <Button asChild>
        <Link href="/">Go home</Link>
      </Button>
    </div>
  );
}
