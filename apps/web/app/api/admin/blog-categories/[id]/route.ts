import { NextResponse } from 'next/server';

import { AdminApiError } from '@/core/api/fetch-admin-api';
import { getAdminSession } from '@/core/auth/server-session';

import {
  deleteBlogCategory,
  isCategoryInUseError,
  updateBlogCategory,
} from '@/features/admin-blog-categories/lib/blog-categories-api';
import { blogCategoryFormSchema } from '@/features/admin-blog-categories/validations/category.schema';

type ErrorCode =
  | 'unauthorized'
  | 'forbidden'
  | 'conflict'
  | 'inUse'
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

  const parsed = blogCategoryFormSchema.safeParse(body);
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
    const category = await updateBlogCategory(id, parsed.data);
    return NextResponse.json({ ok: true, category });
  } catch (error) {
    if (isCategoryInUseError(error)) {
      return jsonError('inUse', 409);
    }
    if (error instanceof AdminApiError && error.status === 409) {
      return jsonError('conflict', 409);
    }
    if (error instanceof AdminApiError && error.status === 404) {
      return jsonError('notFound', 404);
    }
    if (error instanceof AdminApiError && error.status === 401) {
      return jsonError('unauthorized', 401);
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
    await deleteBlogCategory(id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (isCategoryInUseError(error)) {
      return jsonError('inUse', 409);
    }
    if (error instanceof AdminApiError && error.status === 404) {
      return jsonError('notFound', 404);
    }
    if (error instanceof AdminApiError && error.status === 401) {
      return jsonError('unauthorized', 401);
    }
    return jsonError('invalid', 400);
  }
}
