import { Skeleton } from '@/components/ui/skeleton';

export function AuthFormFallback() {
  return (
    <div className="mx-auto w-full max-w-md space-y-4 rounded-lg border bg-card p-6 shadow-sm">
      <Skeleton className="mx-auto h-14 w-14 rounded-full" />
      <Skeleton className="mx-auto h-8 w-48" />
      <Skeleton className="mx-auto h-4 w-full" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
    </div>
  );
}
