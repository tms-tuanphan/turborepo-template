'use client';

import { Mail } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import type { Messages } from '@/shared/i18n';

import { forgotPasswordAdmin } from '../lib/auth-api';
import {
  adminForgotPasswordSentPath,
  adminLoginPath,
} from '../lib/admin-auth-paths';
import { mapAuthErrorToMessage } from '../lib/map-auth-error';
import { adminForgotPasswordSchema } from '../validations/forgot-password.schema';
import { AuthBackLink } from './auth-back-link';
import { AuthCard } from './auth-card';
import { AuthInput } from './auth-input';

type AdminForgotPasswordFormProps = {
  locale: string;
  messages: Messages;
};

export function AdminForgotPasswordForm({
  locale,
  messages,
}: AdminForgotPasswordFormProps) {
  const router = useRouter();
  const t = messages.admin.forgotPassword;
  const loginPath = adminLoginPath(locale);

  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const parsed = adminForgotPasswordSchema.safeParse({ email });
    if (!parsed.success) {
      setError(t.errorInvalid);
      return;
    }

    setPending(true);
    try {
      const result = await forgotPasswordAdmin(parsed.data);
      if (!result.ok) {
        setError(
          mapAuthErrorToMessage(result.error, messages, 'forgotPassword'),
        );
        return;
      }

      const sentUrl = new URL(
        adminForgotPasswordSentPath(locale),
        window.location.origin,
      );
      sentUrl.searchParams.set('email', parsed.data.email);
      router.push(`${sentUrl.pathname}${sentUrl.search}`);
    } finally {
      setPending(false);
    }
  }

  return (
    <AuthCard
      title={t.title}
      description={t.description}
      backHref={loginPath}
      backLabel={t.backToLogin}
      footer={<AuthBackLink href={loginPath} label={t.backToLogin} />}
    >
      <form className="space-y-4" onSubmit={onSubmit} noValidate>
        <AuthInput
          id="admin-forgot-email"
          name="email"
          type="email"
          label={t.emailLabel}
          placeholder={t.emailPlaceholder}
          value={email}
          onChange={setEmail}
          icon={Mail}
          disabled={pending}
          autoComplete="email"
          error={error}
        />
        <Button type="submit" className="w-full" size="lg" disabled={pending}>
          {pending ? t.submitting : t.submit}
        </Button>
      </form>
    </AuthCard>
  );
}
