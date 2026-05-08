import { Skeleton } from '@/components/ui/skeleton';

export default function BlogsLoading() {
  return (
    <div className="mx-auto w-full max-w-[1280px] px-4 pb-16 sm:px-6 lg:px-10">
      <div className="px-4 pb-10 pt-12 text-center sm:px-6 lg:pt-20 lg:pb-14">
        <Skeleton className="mx-auto h-12 w-40" />
        <Skeleton className="mx-auto mt-6 h-5 w-96 max-w-full" />
      </div>

      <div className="space-y-10">
        <div className="grid gap-3 sm:grid-cols-[1fr_minmax(160px,220px)]">
          <Skeleton className="h-12 w-full rounded-md" />
          <Skeleton className="h-12 w-full rounded-md" />
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="aspect-video w-full rounded-md" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
