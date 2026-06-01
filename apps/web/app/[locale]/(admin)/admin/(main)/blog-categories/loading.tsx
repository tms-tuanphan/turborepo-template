import { Skeleton } from '@/components/ui/skeleton';

export default function AdminBlogCategoriesLoading() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-8 w-56" />
          <Skeleton className="h-4 w-96 max-w-full" />
        </div>
        <Skeleton className="h-9 w-36" />
      </div>
      <div className="overflow-hidden rounded-lg border bg-card">
        <div className="grid grid-cols-4 gap-4 border-b bg-muted/50 px-4 py-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-4 w-16" />
          ))}
        </div>
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="grid grid-cols-4 items-center gap-4 border-b px-4 py-4 last:border-0"
          >
            <Skeleton className="h-4 w-full max-w-[180px]" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-8 w-16 justify-self-end" />
          </div>
        ))}
      </div>
    </div>
  );
}
