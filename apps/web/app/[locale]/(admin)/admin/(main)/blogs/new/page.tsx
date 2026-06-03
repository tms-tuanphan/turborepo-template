'use client';

import { AdminBlogEditorPageClient } from '@/features/admin-blogs';
import { useAdminBlogRouteContext } from '@/features/admin-blogs/hooks/use-admin-blog-route-context';

export default function AdminBlogNewPage() {
  const { locale, messages } = useAdminBlogRouteContext();

  return (
    <AdminBlogEditorPageClient
      mode="create"
      locale={locale}
      messages={messages}
    />
  );
}
