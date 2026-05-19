import { Skeleton } from '@/components/ui/skeleton';

export default function AdminBlogEditLoading() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-1 flex-col">
      <div className="sticky top-0 z-30 border-b bg-background/80 px-4 sm:px-6">
        <div className="mx-auto flex h-12 w-full max-w-[1280px] items-center justify-between gap-3">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="hidden h-6 w-20 rounded-full sm:block" />
          <div className="flex gap-2">
            <Skeleton className="hidden h-8 w-20 sm:block" />
            <Skeleton className="hidden h-8 w-24 sm:block" />
            <Skeleton className="h-8 w-28" />
          </div>
        </div>
      </div>
      <div className="mx-auto grid w-full max-w-[1280px] flex-1 grid-cols-1 gap-6 px-4 py-4 sm:px-6 sm:py-5 xl:grid-cols-[minmax(0,1fr)_20rem] xl:gap-8">
        <div className="mx-auto w-full space-y-3">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-16 w-full rounded-xl" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-[min(32rem,55vh)] w-full rounded-2xl" />
        </div>
        <div className="hidden space-y-3 xl:block">
          <Skeleton className="h-48 w-full rounded-xl" />
          <Skeleton className="h-40 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}
