'use client';

import { MailCheck } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMemo, useState } from 'react';

import { Button } from '@/components/ui/button';
import type { Messages } from '@/shared/i18n';

import { forgotPasswordAdmin } from '../lib/auth-api';
import { adminLoginPath } from '../lib/admin-auth-paths';
import { getAuthErrorMessage } from '../lib/map-auth-error';
import {
  createAdminForgotPasswordSchema,
  toForgotPasswordRequestBody,
} from '../validations/forgot-password.schema';
import { AuthBackLink } from './auth-back-link';
import { AuthCard } from './auth-card';

type AdminForgotPasswordSentProps = {
  locale: string;
  messages: Messages;
};

export function AdminForgotPasswordSent({
  locale,
  messages,
}: AdminForgotPasswordSentProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = messages.admin.forgotPasswordSent;
  const forgotT = messages.admin.forgotPassword;
  const loginPath = adminLoginPath(locale);

  const schema = useMemo(
    () => createAdminForgotPasswordSchema(forgotT),
    [forgotT],
  );

  const emailFromQuery = searchParams.get('email') ?? '';
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onResend() {
    setError(null);
    const parsed = schema.safeParse({ email: emailFromQuery });
    if (!parsed.success) {
      router.push(`/${locale}/admin/forgot-password`);
      return;
    }

    setPending(true);
    try {
      const body = toForgotPasswordRequestBody(parsed.data);
      const result = await forgotPasswordAdmin(body);

      if (!result.ok) {
        setError(getAuthErrorMessage(result.error, messages, 'forgotPassword'));
      }
    } catch {
      setError(getAuthErrorMessage('network', messages, 'forgotPassword'));
    } finally {
      setPending(false);
    }
  }

  return (
    <AuthCard
      title={t.title}
      description={t.description}
      icon={MailCheck}
      footer={<AuthBackLink href={loginPath} label={t.backToLogin} />}
    >
      <div className="space-y-4 text-center">
        <p className="text-sm text-muted-foreground">{t.hint}</p>
        {error ? (
          <p className="text-sm text-destructive" role="alert">
            {error}
          </p>
        ) : null}
        <Button
          type="button"
          variant="outline"
          className="w-full border-primary text-primary hover:bg-primary/5"
          size="lg"
          disabled={pending}
          onClick={onResend}
        >
          {pending ? t.resending : t.resend}
        </Button>
      </div>
    </AuthCard>
  );
}
