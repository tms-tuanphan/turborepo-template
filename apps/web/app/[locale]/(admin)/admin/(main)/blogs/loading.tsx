import { Skeleton } from '@/components/ui/skeleton';

export default function AdminBlogsLoading() {
  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-56" />
        <Skeleton className="h-4 w-96 max-w-full" />
      </div>
      <div className="overflow-hidden rounded-lg border bg-card">
        <div className="grid grid-cols-4 gap-4 border-b bg-muted/50 px-4 py-3">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-14" />
        </div>
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="grid grid-cols-4 items-center gap-4 border-b px-4 py-4 last:border-0"
          >
            <Skeleton className="h-4 w-full max-w-[200px]" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-4 w-32" />
          </div>
        ))}
      </div>
    </div>
  );
}
