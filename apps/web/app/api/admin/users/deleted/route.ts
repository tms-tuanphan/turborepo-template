import { NextResponse } from 'next/server';

import { getAdminSession } from '@/core/auth/server-session';
import { listDeletedAdminUsers } from '@/features/admin-users/lib/admin-users-api';

type ErrorCode = 'unauthorized' | 'forbidden' | 'invalid';

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

    const result = await listDeletedAdminUsers({
      page: page ? Number(page) : undefined,
      pageSize: pageSize ? Number(pageSize) : undefined,
    });
    return NextResponse.json({ ok: true, result });
  } catch {
    return jsonError('invalid', 400);
  }
}
