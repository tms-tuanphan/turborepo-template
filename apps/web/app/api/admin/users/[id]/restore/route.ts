import { NextResponse } from 'next/server';

import { AdminApiError } from '@/core/api/fetch-admin-api';
import { getAdminSession } from '@/core/auth/server-session';
import { restoreAdminUser } from '@/features/admin-users/lib/admin-users-api';

type ErrorCode = 'unauthorized' | 'forbidden' | 'notFound' | 'invalid';

function jsonError(code: ErrorCode, status: number) {
  return NextResponse.json({ ok: false, code }, { status });
}

export async function POST(
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
    const user = await restoreAdminUser(id);
    return NextResponse.json({ ok: true, user });
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
