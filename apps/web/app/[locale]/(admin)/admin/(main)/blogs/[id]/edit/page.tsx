'use client';

import { AdminBlogEditorPageClient } from '@/features/admin-blogs';
import { useAdminBlogRouteContext } from '@/features/admin-blogs/hooks/use-admin-blog-route-context';

export default function AdminBlogEditPage() {
  const { locale, messages, postId } = useAdminBlogRouteContext({
    requirePostId: true,
  });

  return (
    <AdminBlogEditorPageClient
      mode="edit"
      locale={locale}
      messages={messages}
      postId={postId}
    />
  );
}
