import { NextResponse } from 'next/server';

import { getAdminSession } from '@/core/auth/server-session';
import { listAdminBlogs } from '@/features/admin-blogs/lib/admin-blogs-api';
import { mutateCreateBlog } from '@/features/admin-blogs/lib/blog-form-mutation';
import { parseAdminBlogFilters } from '@/features/admin-blogs/lib/parse-admin-blog-filters';

function unauthorized() {
  return NextResponse.json(
    { ok: false, code: 'unauthorized' },
    { status: 401 },
  );
}

export async function GET(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return unauthorized();
  }

  const url = new URL(request.url);
  const raw: Record<string, string | string[] | undefined> = {};
  url.searchParams.forEach((value, key) => {
    raw[key] = value;
  });

  try {
    const filters = parseAdminBlogFilters(raw);
    const result = await listAdminBlogs(filters);
    const hasActiveFilters =
      filters.search.trim() !== '' ||
      filters.category !== 'ALL' ||
      filters.status !== 'ALL';

    return NextResponse.json({
      ok: true,
      result: {
        items: result.items,
        totalPages: result.totalPages,
        currentPage: result.currentPage,
        totalItems: result.totalItems,
        hasActiveFilters,
      },
    });
  } catch {
    return NextResponse.json({ ok: false, code: 'invalid' }, { status: 400 });
  }
}

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return unauthorized();
  }

  const formData = await request.formData();
  const state = await mutateCreateBlog(formData);

  if (!state.ok) {
    return NextResponse.json(state, {
      status: state.formError === 'unauthorized' ? 401 : 400,
    });
  }

  return NextResponse.json(state);
}
