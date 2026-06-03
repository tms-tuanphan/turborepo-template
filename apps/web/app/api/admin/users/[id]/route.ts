import { NextResponse } from 'next/server';

import { AdminApiError } from '@/core/api/fetch-admin-api';
import { getAdminSession } from '@/core/auth/server-session';
import {
  deleteAdminUser,
  updateAdminUser,
} from '@/features/admin-users/lib/admin-users-api';
import { createAdminUserUpdateSchema } from '@/features/admin-users/validations/user.schema';
import { defaultLocale, getMessages } from '@/shared/i18n';

type ErrorCode =
  | 'unauthorized'
  | 'forbidden'
  | 'conflict'
  | 'notFound'
  | 'invalid';

function jsonError(code: ErrorCode, status: number) {
  return NextResponse.json({ ok: false, code }, { status });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getAdminSession();
  if (!session) {
    return jsonError('unauthorized', 401);
  }
  if (session.user.role !== 'admin') {
    return jsonError('forbidden', 403);
  }

  const { id } = await params;
  if (!id) {
    return jsonError('invalid', 400);
  }

  let body: unknown;
  try {
    body = (await request.json()) as unknown;
  } catch {
    body = null;
  }

  const t = getMessages(defaultLocale).admin.users;
  const parsed = createAdminUserUpdateSchema(t).safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        code: 'invalid',
        fieldErrors: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  const payload: {
    email: string;
    status: 'active' | 'disabled';
    password?: string;
  } = {
    email: parsed.data.email,
    status: parsed.data.status,
  };
  if (parsed.data.password) {
    payload.password = parsed.data.password;
  }

  try {
    const user = await updateAdminUser(id, payload);
    return NextResponse.json({ ok: true, user });
  } catch (error) {
    if (error instanceof AdminApiError && error.status === 409) {
      return jsonError('conflict', 409);
    }
    if (error instanceof AdminApiError && error.status === 404) {
      return jsonError('notFound', 404);
    }
    if (error instanceof AdminApiError && error.status === 401) {
      return jsonError('unauthorized', 401);
    }
    if (error instanceof AdminApiError && error.status === 403) {
      return jsonError('forbidden', 403);
    }
    return jsonError('invalid', 400);
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getAdminSession();
  if (!session) {
    return jsonError('unauthorized', 401);
  }
  if (session.user.role !== 'admin') {
    return jsonError('forbidden', 403);
  }

  const { id } = await params;
  if (!id) {
    return jsonError('invalid', 400);
  }

  try {
    await deleteAdminUser(id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof AdminApiError && error.status === 404) {
      return jsonError('notFound', 404);
    }
    if (error instanceof AdminApiError && error.status === 401) {
      return jsonError('unauthorized', 401);
    }
    if (error instanceof AdminApiError && error.status === 403) {
      return jsonError('forbidden', 403);
    }
    return jsonError('invalid', 400);
  }
}
