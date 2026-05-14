import { Skeleton } from '@/components/ui/skeleton';

export default function AdminBlogNewLoading() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-1 flex-col">
      <div className="border-b bg-background/95 px-4 py-3 sm:px-6">
        <div className="mx-auto flex w-full max-w-[1400px] items-center justify-between gap-3">
          <Skeleton className="h-8 w-36" />
          <Skeleton className="h-6 w-24 rounded-full" />
          <div className="flex gap-2">
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-28" />
            <Skeleton className="h-8 w-32" />
          </div>
        </div>
      </div>
      <div className="mx-auto grid w-full max-w-[1400px] flex-1 grid-cols-1 gap-6 px-4 py-6 sm:gap-8 sm:px-6 lg:grid-cols-[minmax(0,1fr)_min(100%,380px)]">
        <div className="flex flex-col gap-6">
          <div className="flex gap-4">
            <Skeleton className="size-12 shrink-0 rounded-xl" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-8 w-2/3 max-w-md" />
              <Skeleton className="h-4 w-full max-w-lg" />
            </div>
          </div>
          <Skeleton className="h-14 w-full max-w-2xl" />
          <Skeleton className="h-[min(480px,50vh)] w-full rounded-xl" />
        </div>
        <div className="space-y-3">
          <Skeleton className="h-10 w-full rounded-lg" />
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}
