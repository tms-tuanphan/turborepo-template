'use client';

import { AdminBlogsPageClient } from '@/features/admin-blogs';
import { useAdminBlogRouteContext } from '@/features/admin-blogs/hooks/use-admin-blog-route-context';

export default function AdminBlogsPage() {
  const { locale, messages } = useAdminBlogRouteContext();

  return <AdminBlogsPageClient locale={locale} messages={messages} />;
}
