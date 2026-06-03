'use client';

import { useMemo, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';

import type { AdminUser } from '@repo/api/client';
import type { Locale, Messages } from '@/shared/i18n';

import { useDeletedAdminUsers } from '../hooks/use-deleted-admin-users';
import { restoreAdminUserClient } from '../lib/admin-users-client-api';
import { UsersPagination } from './users-pagination';
import { UsersTable } from './users-table';
import { UsersToolbar } from './users-toolbar';

type AdminDeletedUsersClientProps = {
  locale: Locale;
  messages: Messages;
};

export function AdminDeletedUsersClient({
  locale,
  messages,
}: AdminDeletedUsersClientProps) {
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
  const { data, loading, error, reload } = useDeletedAdminUsers({
    page,
    pageSize,
  });
  const [restoringId, setRestoringId] = useState<string | null>(null);

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

  async function handleRestore(user: AdminUser) {
    setRestoringId(user.id);
    const result = await restoreAdminUserClient(user.id);
    setRestoringId(null);
    if (!result.ok) {
      toast.error(
        'code' in result
          ? (t.errors[result.code] ?? t.errors.invalid)
          : t.errors.invalid,
      );
      return;
    }
    toast.success(t.toast.restored);
    void reload();
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          {t.deletedPageTitle}
        </h1>
        <p className="text-sm text-muted-foreground">
          {t.deletedPageDescription}
        </p>
      </div>

      <UsersToolbar locale={locale} messages={messages} showCreate={false} />

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
            mode="deleted"
            onRestore={(user) => {
              if (restoringId) return;
              void handleRestore(user);
            }}
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
    </div>
  );
}
