'use client';

import { useCallback, useEffect, useState } from 'react';

import type { AdminUserListResponse } from '@repo/api/client';

import {
  fetchDeletedAdminUsersList,
  type AdminUsersApiErrorCode,
} from '../lib/admin-users-client-api';

type UseDeletedAdminUsersOptions = {
  page: number;
  pageSize: number;
};

export function useDeletedAdminUsers({
  page,
  pageSize,
}: UseDeletedAdminUsersOptions) {
  const [data, setData] = useState<AdminUserListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<AdminUsersApiErrorCode | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    const result = await fetchDeletedAdminUsersList({ page, pageSize });
    if (result.ok && 'result' in result) {
      setData(result.result);
    } else if (!result.ok) {
      setError(result.code);
      setData(null);
    }
    setLoading(false);
  }, [page, pageSize]);

  useEffect(() => {
    void load();
  }, [load]);

  return { data, loading, error, reload: load };
}
