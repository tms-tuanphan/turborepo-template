import { NextResponse } from 'next/server';

import { getAdminSession } from '@/core/auth/server-session';
import { listAdminBlogCategories } from '@/features/admin-blogs/lib/admin-blogs-api';

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json(
      { ok: false, code: 'unauthorized' },
      { status: 401 },
    );
  }

  try {
    const categories = await listAdminBlogCategories();
    return NextResponse.json({ ok: true, categories });
  } catch {
    return NextResponse.json({ ok: false, code: 'invalid' }, { status: 400 });
  }
}
