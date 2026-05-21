'use client';

import { Lock } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import type { Messages } from '@/shared/i18n';

import { resetPasswordAdmin } from '../lib/auth-api';
import {
  adminLoginPath,
  adminResetPasswordSuccessPath,
} from '../lib/admin-auth-paths';
import { mapAuthErrorToMessage } from '../lib/map-auth-error';
import { adminResetPasswordSchema } from '../validations/reset-password.schema';
import { AuthBackLink } from './auth-back-link';
import { AuthCard } from './auth-card';
import { AuthInput } from './auth-input';

type AdminResetPasswordFormProps = {
  locale: string;
  messages: Messages;
};

export function AdminResetPasswordForm({
  locale,
  messages,
}: AdminResetPasswordFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = messages.admin.resetPassword;
  const loginPath = adminLoginPath(locale);
  const token = searchParams.get('token') ?? '';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [confirmError, setConfirmError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  if (!token) {
    return (
      <AuthCard
        title={t.title}
        description={t.missingToken}
        footer={<AuthBackLink href={loginPath} label={t.backToLogin} />}
      />
    );
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    setConfirmError(null);

    const parsed = adminResetPasswordSchema.safeParse({
      password,
      confirmPassword,
    });
    if (!parsed.success) {
      const issue = parsed.error.issues[0];
      if (
        issue?.path[0] === 'confirmPassword' &&
        issue.message === 'mismatch'
      ) {
        setConfirmError(t.errorMismatch);
      } else {
        setFormError(t.errorInvalid);
      }
      return;
    }

    setPending(true);
    try {
      const result = await resetPasswordAdmin({
        token,
        newPassword: parsed.data.password,
      });
      if (!result.ok) {
        setFormError(
          mapAuthErrorToMessage(result.error, messages, 'resetPassword'),
        );
        return;
      }

      router.push(adminResetPasswordSuccessPath(locale));
    } finally {
      setPending(false);
    }
  }

  return (
    <AuthCard
      title={t.title}
      description={t.description}
      icon={Lock}
      backHref={loginPath}
      backLabel={t.backToLogin}
      footer={<AuthBackLink href={loginPath} label={t.backToLogin} />}
    >
      <form className="space-y-4" onSubmit={onSubmit} noValidate>
        <AuthInput
          id="admin-reset-password"
          name="password"
          type="password"
          label={t.passwordLabel}
          placeholder={t.passwordPlaceholder}
          value={password}
          onChange={setPassword}
          icon={Lock}
          disabled={pending}
          autoComplete="new-password"
        />
        <AuthInput
          id="admin-reset-confirm"
          name="confirmPassword"
          type="password"
          label={t.confirmPasswordLabel}
          placeholder={t.confirmPasswordPlaceholder}
          value={confirmPassword}
          onChange={setConfirmPassword}
          icon={Lock}
          disabled={pending}
          autoComplete="new-password"
          error={confirmError}
        />
        <p className="text-xs text-muted-foreground">{t.passwordHint}</p>
        {formError ? (
          <p className="text-sm text-destructive" role="alert">
            {formError}
          </p>
        ) : null}
        <Button type="submit" className="w-full" size="lg" disabled={pending}>
          {pending ? t.submitting : t.submit}
        </Button>
      </form>
    </AuthCard>
  );
}
