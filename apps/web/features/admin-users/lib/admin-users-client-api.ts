import type {
  AdminUser,
  AdminUserListResponse,
  CreateAdminUserBody,
  UpdateAdminUserBody,
} from '@repo/api/client';

export type AdminUsersApiErrorCode =
  | 'unauthorized'
  | 'forbidden'
  | 'conflict'
  | 'notFound'
  | 'invalid';

export type AdminUsersApiResult<T> =
  | { ok: true; result: T }
  | { ok: true; user: AdminUser }
  | {
      ok: false;
      code: AdminUsersApiErrorCode;
      fieldErrors?: Record<string, string[]>;
    };

async function parseJson<T>(response: Response): Promise<T | null> {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text) as T;
  } catch {
    return null;
  }
}

export async function fetchAdminUsersList(query?: {
  page?: number;
  pageSize?: number;
}): Promise<AdminUsersApiResult<AdminUserListResponse>> {
  const params = new URLSearchParams();
  if (query?.page !== undefined) params.set('page', String(query.page));
  if (query?.pageSize !== undefined)
    params.set('pageSize', String(query.pageSize));
  const qs = params.toString();

  const response = await fetch(`/api/admin/users${qs ? `?${qs}` : ''}`, {
    cache: 'no-store',
  });
  const body =
    await parseJson<AdminUsersApiResult<AdminUserListResponse>>(response);
  if (!body) return { ok: false, code: 'invalid' };
  return body;
}

export async function fetchDeletedAdminUsersList(query?: {
  page?: number;
  pageSize?: number;
}): Promise<AdminUsersApiResult<AdminUserListResponse>> {
  const params = new URLSearchParams();
  if (query?.page !== undefined) params.set('page', String(query.page));
  if (query?.pageSize !== undefined)
    params.set('pageSize', String(query.pageSize));
  const qs = params.toString();

  const response = await fetch(
    `/api/admin/users/deleted${qs ? `?${qs}` : ''}`,
    { cache: 'no-store' },
  );
  const body =
    await parseJson<AdminUsersApiResult<AdminUserListResponse>>(response);
  if (!body) return { ok: false, code: 'invalid' };
  return body;
}

export async function postAdminUser(
  body: CreateAdminUserBody,
): Promise<AdminUsersApiResult<AdminUser>> {
  const response = await fetch('/api/admin/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const parsed = await parseJson<
    | { ok: true; user: AdminUser }
    | {
        ok: false;
        code: AdminUsersApiErrorCode;
        fieldErrors?: Record<string, string[]>;
      }
  >(response);
  if (!parsed) return { ok: false, code: 'invalid' };
  return parsed;
}

export async function patchAdminUser(
  id: string,
  body: UpdateAdminUserBody,
): Promise<AdminUsersApiResult<AdminUser>> {
  const response = await fetch(`/api/admin/users/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const parsed = await parseJson<
    | { ok: true; user: AdminUser }
    | {
        ok: false;
        code: AdminUsersApiErrorCode;
        fieldErrors?: Record<string, string[]>;
      }
  >(response);
  if (!parsed) return { ok: false, code: 'invalid' };
  return parsed;
}

export async function removeAdminUser(
  id: string,
): Promise<{ ok: true } | { ok: false; code: AdminUsersApiErrorCode }> {
  const response = await fetch(`/api/admin/users/${id}`, { method: 'DELETE' });
  const parsed = await parseJson<
    { ok: true } | { ok: false; code: AdminUsersApiErrorCode }
  >(response);
  if (!parsed) return { ok: false, code: 'invalid' };
  return parsed;
}

export async function restoreAdminUserClient(
  id: string,
): Promise<AdminUsersApiResult<AdminUser>> {
  const response = await fetch(`/api/admin/users/${id}/restore`, {
    method: 'POST',
  });
  const parsed = await parseJson<
    { ok: true; user: AdminUser } | { ok: false; code: AdminUsersApiErrorCode }
  >(response);
  if (!parsed) return { ok: false, code: 'invalid' };
  return parsed;
}
