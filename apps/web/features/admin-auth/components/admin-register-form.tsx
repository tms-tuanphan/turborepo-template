'use client';

import { I18nKey } from '@repo/api/client';
import { Lock, Mail } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import type { Messages } from '@/shared/i18n';

import { registerAdmin } from '../lib/auth-api';
import { adminLoginPath } from '../lib/admin-auth-paths';
import { mapAuthErrorToMessage } from '../lib/map-auth-error';
import { adminRegisterSchema } from '../validations/register.schema';
import { AuthCard } from './auth-card';
import { AuthInput } from './auth-input';

type AdminRegisterFormProps = {
  locale: string;
  messages: Messages;
};

export function AdminRegisterForm({
  locale,
  messages,
}: AdminRegisterFormProps) {
  const router = useRouter();
  const t = messages.admin.register;
  const loginPath = adminLoginPath(locale);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [emailError, setEmailError] = useState<string | null>(null);
  const [confirmError, setConfirmError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setEmailError(null);
    setConfirmError(null);
    setFormError(null);

    const parsed = adminRegisterSchema.safeParse({
      email,
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
      const result = await registerAdmin({
        email: parsed.data.email,
        password: parsed.data.password,
      });

      if (!result.ok) {
        if (result.error.code === I18nKey.Errors.Auth.EmailAlreadyExists) {
          setEmailError(t.errorEmailExists);
          return;
        }
        setFormError(mapAuthErrorToMessage(result.error, messages, 'register'));
        return;
      }

      router.push(loginPath);
      router.refresh();
    } finally {
      setPending(false);
    }
  }

  return (
    <AuthCard
      title={t.title}
      description={t.description}
      footer={
        <p className="text-center text-sm text-muted-foreground">
          {t.hasAccount}{' '}
          <Link href={loginPath} className="text-primary hover:underline">
            {t.signIn}
          </Link>
        </p>
      }
    >
      <form className="space-y-4" onSubmit={onSubmit} noValidate>
        <AuthInput
          id="admin-register-email"
          name="email"
          type="email"
          label={t.emailLabel}
          placeholder={t.emailPlaceholder}
          value={email}
          onChange={setEmail}
          icon={Mail}
          disabled={pending}
          autoComplete="email"
          error={emailError}
        />
        <AuthInput
          id="admin-register-password"
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
          id="admin-register-confirm"
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
