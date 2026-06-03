import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';

import type {
  AdminUserListResponse,
  CreateAdminUserBody,
  UpdateAdminUserBody,
} from '@repo/api/client';

import {
  fetchAdminUsersList,
  patchAdminUser,
  postAdminUser,
  removeAdminUser,
  type AdminUsersApiErrorCode,
  type AdminUsersApiResult,
} from '../lib/admin-users-client-api';
import { toCreateAdminUserBody } from '../validations/user.schema';
import type { AdminUserCreateInput } from '../validations/user.schema';
import type { AdminUserUpdateInput } from '../validations/user.schema';

const ADMIN_USERS_KEY = '/api/admin/users';

type UseAdminUsersOptions = {
  page: number;
  pageSize: number;
};

export type AdminUsersApiError = {
  ok: false;
  code: AdminUsersApiErrorCode;
  fieldErrors?: Record<string, string[]>;
};

type MutationResult =
  | { ok: true }
  | {
      ok: false;
      error: AdminUsersApiError;
    };

function toApiError(
  result: Extract<AdminUsersApiResult<unknown>, { ok: false }>,
): AdminUsersApiError {
  return {
    ok: false,
    code: result.code,
    fieldErrors: result.fieldErrors,
  };
}

export function useAdminUsers({ page, pageSize }: UseAdminUsersOptions) {
  const key = [ADMIN_USERS_KEY, String(page), String(pageSize)];

  const list = useSWR<AdminUserListResponse, AdminUsersApiError>(
    key,
    async (): Promise<AdminUserListResponse> => {
      const res = await fetchAdminUsersList({ page, pageSize });
      if (!res.ok) throw toApiError(res);
      if (!('result' in res)) throw { ok: false as const, code: 'invalid' };
      return res.result;
    },
  );

  const create = useSWRMutation<
    AdminUsersApiResult<unknown>,
    AdminUsersApiError,
    string,
    CreateAdminUserBody
  >(ADMIN_USERS_KEY, async (_key, { arg }) => postAdminUser(arg));

  const update = useSWRMutation<
    AdminUsersApiResult<unknown>,
    AdminUsersApiError,
    { id: string },
    { id: string; body: UpdateAdminUserBody }
  >({ id: 'admin-user-update' }, async (_key, { arg }) =>
    patchAdminUser(arg.id, arg.body),
  );

  const remove = useSWRMutation<
    { ok: true } | { ok: false; code: AdminUsersApiErrorCode },
    AdminUsersApiError,
    { id: string },
    string
  >({ id: 'admin-user-delete' }, async (_key, { arg }) => removeAdminUser(arg));

  const createUser = async (
    input: AdminUserCreateInput,
  ): Promise<MutationResult> => {
    const body = toCreateAdminUserBody(input);
    const res = await create.trigger(body);
    if (!res.ok) return { ok: false, error: toApiError(res) };
    await list.mutate();
    return { ok: true };
  };

  const updateUser = async (
    id: string,
    input: AdminUserUpdateInput,
  ): Promise<MutationResult> => {
    const body: UpdateAdminUserBody = {
      email: input.email,
      status: input.status,
    };
    if (input.password) {
      body.password = input.password;
    }
    const res = await update.trigger({ id, body });
    if (!res.ok) return { ok: false, error: toApiError(res) };
    await list.mutate();
    return { ok: true };
  };

  const deleteUser = async (id: string): Promise<MutationResult> => {
    const res = await remove.trigger(id);
    if (!res.ok) return { ok: false, error: { ok: false, code: res.code } };
    await list.mutate();
    return { ok: true };
  };

  const listError = list.error?.code ?? null;

  return {
    items: list.data?.items ?? [],
    totalItems: list.data?.totalItems ?? 0,
    totalPages: list.data?.totalPages ?? 1,
    currentPage: list.data?.currentPage ?? page,
    isLoading: list.isLoading,
    error: listError,
    mutate: list.mutate,

    createUser,
    updateUser,
    deleteUser,

    isCreating: create.isMutating,
    isUpdating: update.isMutating,
    isDeleting: remove.isMutating,
  };
}
