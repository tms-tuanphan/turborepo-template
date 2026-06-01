import { NextResponse } from 'next/server';

import { AdminApiError } from '@/core/api/fetch-admin-api';
import { getAdminSession } from '@/core/auth/server-session';
import {
  deleteAdminBlog,
  getAdminBlogById,
} from '@/features/admin-blogs/lib/admin-blogs-api';
import { mutateUpdateBlog } from '@/features/admin-blogs/lib/blog-form-mutation';

type RouteContext = { params: Promise<{ id: string }> };

function unauthorized() {
  return NextResponse.json(
    { ok: false, code: 'unauthorized' },
    { status: 401 },
  );
}

export async function GET(_request: Request, context: RouteContext) {
  const session = await getAdminSession();
  if (!session) {
    return unauthorized();
  }

  const { id } = await context.params;
  const post = await getAdminBlogById(id);
  if (!post) {
    return NextResponse.json({ ok: false, code: 'notFound' }, { status: 404 });
  }

  return NextResponse.json({ ok: true, post });
}

export async function PATCH(request: Request, context: RouteContext) {
  const session = await getAdminSession();
  if (!session) {
    return unauthorized();
  }

  const { id } = await context.params;
  const formData = await request.formData();
  formData.set('id', id);
  const state = await mutateUpdateBlog(formData);

  if (!state.ok) {
    const status =
      state.formError === 'unauthorized'
        ? 401
        : state.formError === 'notFound'
          ? 404
          : 400;
    return NextResponse.json(state, { status });
  }

  return NextResponse.json(state);
}

export async function DELETE(_request: Request, context: RouteContext) {
  const session = await getAdminSession();
  if (!session) {
    return unauthorized();
  }

  const { id } = await context.params;

  try {
    await deleteAdminBlog(id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof AdminApiError && error.status === 404) {
      return NextResponse.json(
        { ok: false, code: 'notFound' },
        { status: 404 },
      );
    }
    return NextResponse.json({ ok: false, code: 'invalid' }, { status: 400 });
  }
}
