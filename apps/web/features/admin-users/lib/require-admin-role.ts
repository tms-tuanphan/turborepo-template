import { redirect } from 'next/navigation';

import { auth } from '@/core/lib/auth';

export async function requireAdminRole(locale: string): Promise<void> {
  const session = await auth();
  if (session?.user?.role !== 'admin') {
    redirect(`/${locale}/admin/blogs`);
  }
}
