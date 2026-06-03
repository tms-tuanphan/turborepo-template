'use client';

import { useMemo, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';

import type { AdminUser } from '@repo/api/client';
import type { Locale, Messages } from '@/shared/i18n';
import { useAdminUsers } from '../hooks/use-admin-users';
import { removeAdminUser } from '../lib/admin-users-client-api';
import { UserDeleteDialog } from './user-delete-dialog';
import { UsersTable } from './users-table';
import { UsersPagination } from './users-pagination';
import { UsersToolbar } from './users-toolbar';

type AdminUsersClientProps = {
  locale: Locale;
  messages: Messages;
};

export function AdminUsersClient({ locale, messages }: AdminUsersClientProps) {
  const t = messages.admin.users;
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const page = useMemo(() => {
    const raw = searchParams.get('page');
    const parsed = raw ? Number(raw) : Number.NaN;
    return Number.isFinite(parsed) && parsed >= 1 ? Math.floor(parsed) : 1;
  }, [searchParams]);

  const pageSize = 20;
  const { data, loading, error, reload } = useAdminUsers({ page, pageSize });
  const [deleting, setDeleting] = useState<AdminUser | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const setPage = (nextPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (nextPage <= 1) {
      params.delete('page');
    } else {
      params.set('page', String(nextPage));
    }
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  };

  async function handleDeleteConfirm() {
    if (!deleting) return;
    setIsDeleting(true);
    const result = await removeAdminUser(deleting.id);
    setIsDeleting(false);
    if (!result.ok) {
      toast.error(t.errors[result.code] ?? t.errors.invalid);
      return;
    }
    toast.success(t.toast.deleted);
    setDeleting(null);
    void reload();
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{t.pageTitle}</h1>
        <p className="text-sm text-muted-foreground">{t.pageDescription}</p>
      </div>

      <UsersToolbar locale={locale} messages={messages} />

      {loading ? (
        <p className="text-sm text-muted-foreground">{t.listLoading}</p>
      ) : error ? (
        <p className="text-sm text-destructive" role="alert">
          {t.errors[error] ?? t.listError}
        </p>
      ) : (
        <>
          <UsersTable
            locale={locale}
            messages={messages}
            users={data?.items ?? []}
            mode="active"
            onDelete={setDeleting}
          />
          {data ? (
            <UsersPagination
              totalPages={data.totalPages}
              currentPage={data.currentPage}
              messages={messages}
              onPageChange={setPage}
            />
          ) : null}
        </>
      )}

      <UserDeleteDialog
        open={deleting !== null}
        user={deleting}
        messages={messages}
        pending={isDeleting}
        onOpenChange={(open) => {
          if (!open) setDeleting(null);
        }}
        onConfirm={() => {
          void handleDeleteConfirm();
        }}
      />
    </div>
  );
}
