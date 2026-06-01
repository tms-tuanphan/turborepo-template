import { NextResponse } from 'next/server';

import { getAdminSession } from '@/core/auth/server-session';
import { checkAdminBlogSlug } from '@/features/admin-blogs/lib/admin-blogs-api';

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
  const slug = url.searchParams.get('slug') ?? '';
  const excludeId = url.searchParams.get('excludeId') ?? undefined;

  if (!slug.trim()) {
    return NextResponse.json({ ok: false, code: 'invalid' }, { status: 400 });
  }

  try {
    const result = await checkAdminBlogSlug(slug, excludeId);
    return NextResponse.json({ ok: true, result });
  } catch {
    return NextResponse.json({ ok: false, code: 'invalid' }, { status: 400 });
  }
}
