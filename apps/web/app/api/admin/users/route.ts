import { NextResponse } from 'next/server';

import { AdminApiError } from '@/core/api/fetch-admin-api';
import { getAdminSession } from '@/core/auth/server-session';
import {
  createAdminUser,
  listAdminUsers,
} from '@/features/admin-users/lib/admin-users-api';
import {
  createAdminUserCreateApiSchema,
  toCreateAdminUserBody,
} from '@/features/admin-users/validations/user.schema';
import { getMessages, defaultLocale } from '@/shared/i18n';

type ErrorCode =
  | 'unauthorized'
  | 'forbidden'
  | 'conflict'
  | 'notFound'
  | 'invalid';

function jsonError(code: ErrorCode, status: number) {
  return NextResponse.json({ ok: false, code }, { status });
}

export async function GET(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return jsonError('unauthorized', 401);
  }
  if (session.user.role !== 'admin') {
    return jsonError('forbidden', 403);
  }

  try {
    const url = new URL(request.url);
    const page = url.searchParams.get('page');
    const pageSize = url.searchParams.get('pageSize');

    const result = await listAdminUsers({
      page: page ? Number(page) : undefined,
      pageSize: pageSize ? Number(pageSize) : undefined,
    });
    return NextResponse.json({ ok: true, result });
  } catch {
    return jsonError('invalid', 400);
  }
}

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return jsonError('unauthorized', 401);
  }
  if (session.user.role !== 'admin') {
    return jsonError('forbidden', 403);
  }

  let body: unknown;
  try {
    body = (await request.json()) as unknown;
  } catch {
    body = null;
  }

  const t = getMessages(defaultLocale).admin.users;
  const parsed = createAdminUserCreateApiSchema(t).safeParse(body);
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

  try {
    const user = await createAdminUser(toCreateAdminUserBody(parsed.data));
    return NextResponse.json({ ok: true, user });
  } catch (error) {
    if (error instanceof AdminApiError && error.status === 409) {
      return jsonError('conflict', 409);
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
