'use client';

import { useCallback, useMemo, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';

import type { BlogCategory } from '@repo/api/client';
import { useSession } from 'next-auth/react';
import type { Locale, Messages } from '@/shared/i18n';

import type { BlogCategoryApiError } from '../lib/blog-categories-client-api';
import { useBlogCategories } from '../hooks/use-blog-categories';
import type { BlogCategoryFormInput } from '../validations/category.schema';
import { BlogCategoriesToolbar } from './blog-categories-toolbar';
import { BlogCategoriesPagination } from './blog-categories-pagination';
import { BlogCategoriesTable } from './blog-categories-table';
import { CategoryDeleteDialog } from './category-delete-dialog';
import { CategoryUpsertDialog } from './category-upsert-dialog';

type AdminBlogCategoriesClientProps = {
  locale: Locale;
  messages: Messages;
};

type UpsertMode = 'create' | 'edit' | null;

export function AdminBlogCategoriesClient({
  locale,
  messages,
}: AdminBlogCategoriesClientProps) {
  const { data: session } = useSession();
  const userRole = session?.user?.role ?? 'sub_admin';
  const t = messages.admin.blogCategories;
  const canMutate = userRole === 'admin';
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const page = useMemo(() => {
    const raw = searchParams.get('page');
    const parsed = raw ? Number(raw) : Number.NaN;
    return Number.isFinite(parsed) && parsed >= 1 ? Math.floor(parsed) : 1;
  }, [searchParams]);

  const pageSize = 20;

  const [upsertMode, setUpsertMode] = useState<UpsertMode>(null);
  const [editing, setEditing] = useState<BlogCategory | null>(null);
  const [deleting, setDeleting] = useState<BlogCategory | null>(null);
  const [serverError, setServerError] = useState<BlogCategoryApiError | null>(
    null,
  );

  const {
    items,
    totalItems,
    totalPages,
    currentPage,
    createCategory,
    updateCategory,
    deleteCategory,
    isCreating,
    isUpdating,
    isDeleting,
  } = useBlogCategories({
    query: { page, pageSize },
  });

  const pendingUpsert = isCreating || isUpdating;

  const openCreate = useCallback(() => {
    setServerError(null);
    setEditing(null);
    setUpsertMode('create');
  }, []);

  const openEdit = useCallback((category: BlogCategory) => {
    setServerError(null);
    setEditing(category);
    setUpsertMode('edit');
  }, []);

  const closeUpsert = useCallback(() => {
    setUpsertMode(null);
    setEditing(null);
    setServerError(null);
  }, []);

  const openDelete = useCallback((category: BlogCategory) => {
    setServerError(null);
    setDeleting(category);
  }, []);

  const closeDelete = useCallback(() => {
    setDeleting(null);
    setServerError(null);
  }, []);

  const serverErrorText = serverError ? t.errors[serverError.code] : undefined;

  const onSubmitUpsert = async (values: BlogCategoryFormInput) => {
    if (!canMutate) return;

    if (upsertMode === 'edit' && editing) {
      const result = await updateCategory(editing.id, values);
      if (!result.ok) {
        setServerError(result.error);
        toast.error(t.errors[result.error.code] ?? t.errors.invalid);
        return;
      }
      toast.success(t.toast.updated);
      closeUpsert();
      return;
    }

    const result = await createCategory(values);
    if (!result.ok) {
      setServerError(result.error);
      toast.error(t.errors[result.error.code] ?? t.errors.invalid);
      return;
    }
    toast.success(t.toast.created);
    closeUpsert();
  };

  const onConfirmDelete = async () => {
    if (!canMutate) return;
    if (!deleting) return;

    const result = await deleteCategory(deleting.id);
    if (!result.ok) {
      setServerError(result.error);
      toast.error(t.errors[result.error.code] ?? t.errors.invalid);
      return;
    }

    toast.success(t.toast.deleted);
    closeDelete();
  };

  const setPage = useCallback(
    (nextPage: number) => {
      const next = new URLSearchParams(searchParams.toString());
      if (nextPage <= 1) next.delete('page');
      else next.set('page', String(nextPage));
      const qs = next.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  return (
    <div className="flex flex-col gap-6">
      <BlogCategoriesToolbar
        canMutate={canMutate}
        messages={messages}
        onCreate={openCreate}
      />

      <BlogCategoriesTable
        locale={locale}
        messages={messages}
        categories={items}
        canMutate={canMutate}
        onEdit={openEdit}
        onDelete={openDelete}
      />

      <BlogCategoriesPagination
        messages={messages}
        totalItems={totalItems}
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={setPage}
      />

      <CategoryUpsertDialog
        open={upsertMode !== null}
        mode={upsertMode ?? 'create'}
        messages={messages}
        category={editing}
        pending={pendingUpsert}
        serverErrorText={serverErrorText}
        serverFieldErrors={serverError?.fieldErrors}
        onOpenChange={(open) => {
          if (!open) closeUpsert();
        }}
        onSubmit={onSubmitUpsert}
      />

      <CategoryDeleteDialog
        open={deleting !== null}
        messages={messages}
        category={deleting}
        pending={isDeleting}
        onOpenChange={(open) => {
          if (!open) closeDelete();
        }}
        onConfirm={onConfirmDelete}
      />
    </div>
  );
}
