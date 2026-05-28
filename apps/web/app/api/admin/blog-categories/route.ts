import { NextResponse } from 'next/server';

import { AdminApiError } from '@/core/api/fetch-admin-api';
import { getAdminSession } from '@/core/auth/server-session';

import {
  createBlogCategory,
  listBlogCategories,
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

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return jsonError('unauthorized', 401);
  }

  try {
    const categories = await listBlogCategories();
    return NextResponse.json({ ok: true, categories });
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
    const category = await createBlogCategory(parsed.data);
    return NextResponse.json({ ok: true, category });
  } catch (error) {
    if (error instanceof AdminApiError && error.status === 409) {
      return jsonError('conflict', 409);
    }
    if (error instanceof AdminApiError && error.status === 401) {
      return jsonError('unauthorized', 401);
    }
    return jsonError('invalid', 400);
  }
}
