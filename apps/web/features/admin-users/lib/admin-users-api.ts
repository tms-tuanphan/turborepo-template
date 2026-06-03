import type {
  AdminUser,
  AdminUserListResponse,
  CreateAdminUserBody,
  UpdateAdminUserBody,
} from '@repo/api/client';

import { AdminApiError, fetchAdminApi } from '@/core/api/fetch-admin-api';

export type AdminUserListQuery = {
  page?: number;
  pageSize?: number;
};

function buildListQuery(query?: AdminUserListQuery): string {
  const params = new URLSearchParams();
  if (query?.page !== undefined) params.set('page', String(query.page));
  if (query?.pageSize !== undefined)
    params.set('pageSize', String(query.pageSize));
  return params.toString();
}

export async function getAdminUser(id: string): Promise<AdminUser> {
  return fetchAdminApi<AdminUser>(`/admin/users/${id}`);
}

export async function listAdminUsers(
  query?: AdminUserListQuery,
): Promise<AdminUserListResponse> {
  const qs = buildListQuery(query);
  return fetchAdminApi<AdminUserListResponse>(
    `/admin/users${qs ? `?${qs}` : ''}`,
  );
}

export async function listDeletedAdminUsers(
  query?: AdminUserListQuery,
): Promise<AdminUserListResponse> {
  const qs = buildListQuery(query);
  return fetchAdminApi<AdminUserListResponse>(
    `/admin/users/deleted${qs ? `?${qs}` : ''}`,
  );
}

export async function createAdminUser(
  body: CreateAdminUserBody,
): Promise<AdminUser> {
  return fetchAdminApi<AdminUser>('/admin/users', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export async function updateAdminUser(
  id: string,
  body: UpdateAdminUserBody,
): Promise<AdminUser> {
  return fetchAdminApi<AdminUser>(`/admin/users/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(body),
  });
}

export async function deleteAdminUser(id: string): Promise<void> {
  await fetchAdminApi<void>(`/admin/users/${id}`, { method: 'DELETE' });
}

export async function restoreAdminUser(id: string): Promise<AdminUser> {
  return fetchAdminApi<AdminUser>(`/admin/users/${id}/restore`, {
    method: 'POST',
  });
}

export function isAdminUserConflictError(error: unknown): boolean {
  return error instanceof AdminApiError && error.status === 409;
}
