'use client';

import { useCallback, useMemo, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';

import type { AdminUser } from '@repo/api/client';
import type { Locale, Messages } from '@/shared/i18n';

import type { AdminUsersApiError } from '../hooks/use-admin-users';
import { useAdminUsers } from '../hooks/use-admin-users';
import type { AdminUserCreateInput } from '../validations/user.schema';
import type { AdminUserUpdateInput } from '../validations/user.schema';
import { UserDeleteDialog } from './user-delete-dialog';
import { UserUpsertDialog } from './user-upsert-dialog';
import { UsersPagination } from './users-pagination';
import { UsersTable } from './users-table';
import { UsersToolbar } from './users-toolbar';

type AdminUsersClientProps = {
  locale: Locale;
  messages: Messages;
};

type UpsertMode = 'create' | 'edit' | null;

export function AdminUsersClient({ locale, messages }: AdminUsersClientProps) {
  const { data: session } = useSession();
  const userRole = session?.user?.role ?? 'sub_admin';
  const t = messages.admin.users;
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
  const [editing, setEditing] = useState<AdminUser | null>(null);
  const [deleting, setDeleting] = useState<AdminUser | null>(null);
  const [serverError, setServerError] = useState<AdminUsersApiError | null>(
    null,
  );

  const {
    items,
    totalItems,
    totalPages,
    currentPage,
    isLoading,
    error,
    createUser,
    updateUser,
    deleteUser,
    isCreating,
    isUpdating,
    isDeleting,
  } = useAdminUsers({ page, pageSize });

  const pendingUpsert = isCreating || isUpdating;

  const openCreate = useCallback(() => {
    setServerError(null);
    setEditing(null);
    setUpsertMode('create');
  }, []);

  const openEdit = useCallback((user: AdminUser) => {
    setServerError(null);
    setEditing(user);
    setUpsertMode('edit');
  }, []);

  const closeUpsert = useCallback(() => {
    setUpsertMode(null);
    setEditing(null);
    setServerError(null);
  }, []);

  const openDelete = useCallback((user: AdminUser) => {
    setServerError(null);
    setDeleting(user);
  }, []);

  const closeDelete = useCallback(() => {
    setDeleting(null);
    setServerError(null);
  }, []);

  const serverErrorText = serverError ? t.errors[serverError.code] : undefined;

  const onSubmitCreate = async (values: AdminUserCreateInput) => {
    if (!canMutate) return;
    const result = await createUser(values);
    if (!result.ok) {
      setServerError(result.error);
      toast.error(t.errors[result.error.code] ?? t.errors.invalid);
      return;
    }
    toast.success(t.toast.created);
    closeUpsert();
  };

  const onSubmitEdit = async (values: AdminUserUpdateInput) => {
    if (!canMutate || !editing) return;
    const result = await updateUser(editing.id, values);
    if (!result.ok) {
      setServerError(result.error);
      toast.error(t.errors[result.error.code] ?? t.errors.invalid);
      return;
    }
    toast.success(t.toast.updated);
    closeUpsert();
  };

  const onConfirmDelete = async () => {
    if (!canMutate || !deleting) return;
    const result = await deleteUser(deleting.id);
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
      <UsersToolbar
        canMutate={canMutate}
        messages={messages}
        onCreate={openCreate}
      />

      {isLoading ? (
        <p className="text-sm text-muted-foreground">{t.listLoading}</p>
      ) : error ? (
        <p className="text-sm text-destructive" role="alert">
          {t.errors[error] ?? t.listError}
        </p>
      ) : (
        <UsersTable
          locale={locale}
          messages={messages}
          users={items}
          canMutate={canMutate}
          onEdit={openEdit}
          onDelete={openDelete}
        />
      )}

      <UsersPagination
        totalItems={totalItems}
        totalPages={totalPages}
        currentPage={currentPage}
        messages={messages}
        onPageChange={setPage}
      />

      <UserUpsertDialog
        open={upsertMode !== null}
        mode={upsertMode ?? 'create'}
        messages={messages}
        user={editing}
        pending={pendingUpsert}
        serverErrorText={serverErrorText}
        serverFieldErrors={serverError?.fieldErrors}
        onOpenChange={(open) => {
          if (!open) closeUpsert();
        }}
        onSubmitCreate={onSubmitCreate}
        onSubmitEdit={onSubmitEdit}
      />

      <UserDeleteDialog
        open={deleting !== null}
        user={deleting}
        messages={messages}
        pending={isDeleting}
        onOpenChange={(open) => {
          if (!open) closeDelete();
        }}
        onConfirm={() => {
          void onConfirmDelete();
        }}
      />
    </div>
  );
}
