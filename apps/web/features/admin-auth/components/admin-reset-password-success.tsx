'use client';

import { Check } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import type { Messages } from '@/shared/i18n';

import { adminLoginPath } from '../lib/admin-auth-paths';
import { AuthCard } from './auth-card';

type AdminResetPasswordSuccessProps = {
  locale: string;
  messages: Messages;
};

export function AdminResetPasswordSuccess({
  locale,
  messages,
}: AdminResetPasswordSuccessProps) {
  const t = messages.admin.resetPasswordSuccess;
  const loginPath = adminLoginPath(locale);

  return (
    <AuthCard
      title={t.title}
      description={t.description}
      icon={Check}
      iconSize="lg"
    >
      <Button asChild className="w-full" size="lg">
        <Link href={loginPath}>{t.goToLogin}</Link>
      </Button>
    </AuthCard>
  );
}
