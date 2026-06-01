'use client';

import type { Locale, Messages } from '@/shared/i18n';

import { useAdminBlogEditor } from '../hooks/use-admin-blog-editor';
import { AdminBlogForm } from './admin-blog-form';

type AdminBlogEditorPageClientProps = {
  mode: 'create' | 'edit';
  locale: Locale;
  messages: Messages;
  postId?: string;
};

export function AdminBlogEditorPageClient({
  mode,
  locale,
  messages,
  postId,
}: AdminBlogEditorPageClientProps) {
  const { categories, initial, isLoading, notFound, categoriesReady } =
    useAdminBlogEditor(mode, postId);

  if (isLoading) {
    return (
      <div
        className="flex min-h-[calc(100vh-4rem)] flex-1 items-center justify-center"
        role="status"
        aria-busy="true"
      >
        <p className="text-sm text-muted-foreground">
          {messages.admin.blogs.form.editorLoading}
        </p>
      </div>
    );
  }

  if (notFound || !categoriesReady) {
    return (
      <div className="flex flex-1 items-center justify-center p-8" role="alert">
        <p className="text-sm text-muted-foreground">
          {messages.admin.blogs.form.errors.notFound}
        </p>
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-1 flex-col">
      <AdminBlogForm
        mode={mode}
        locale={locale}
        messages={messages}
        categories={categories}
        initial={initial}
        postId={postId}
      />
    </div>
  );
}
