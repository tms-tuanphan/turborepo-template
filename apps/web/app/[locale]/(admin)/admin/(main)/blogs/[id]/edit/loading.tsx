import { Skeleton } from '@/components/ui/skeleton';

export default function AdminBlogEditLoading() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-72" />
        <Skeleton className="h-4 w-full max-w-xl" />
      </div>
      <Skeleton className="h-[420px] w-full rounded-lg" />
    </div>
  );
}
