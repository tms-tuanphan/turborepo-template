'use client';

import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { useAdminBlogRouteContext } from '@/features/admin-blogs/hooks/use-admin-blog-route-context';

export default function AdminBlogEditNotFound() {
  const { locale, messages } = useAdminBlogRouteContext();

  return (
    <div className="mx-auto flex max-w-lg flex-col gap-4 py-12 text-center">
      <h1 className="text-xl font-semibold">
        {messages.admin.blogs.form.errors.notFound}
      </h1>
      <Button type="button" asChild>
        <Link href={`/${locale}/admin/blogs`}>
          {messages.admin.blogs.actions.cancel}
        </Link>
      </Button>
    </div>
  );
}
