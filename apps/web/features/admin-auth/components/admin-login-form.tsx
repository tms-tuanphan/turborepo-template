'use client';

import { Lock, Mail } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import type { Messages } from '@/shared/i18n';

import { loginAdmin } from '../lib/auth-api';
import {
  adminForgotPasswordPath,
  adminRegisterPath,
} from '../lib/admin-auth-paths';
import { mapAuthErrorToMessage } from '../lib/map-auth-error';
import { sanitizeAdminCallbackUrl } from '../lib/sanitize-callback-url';
import { adminLoginSchema } from '../validations/login.schema';
import { AuthCard } from './auth-card';
import { AuthInput } from './auth-input';

type AdminLoginFormProps = {
  locale: string;
  messages: Messages;
};

export function AdminLoginForm({ locale, messages }: AdminLoginFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = messages.admin.login;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const callbackUrl = sanitizeAdminCallbackUrl(
    searchParams.get('callbackUrl'),
    locale,
  );

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const parsed = adminLoginSchema.safeParse({ email, password });
    if (!parsed.success) {
      const first = parsed.error.issues[0]?.message ?? t.errorInvalid;
      setError(first);
      return;
    }

    setPending(true);
    try {
      const result = await loginAdmin(parsed.data);

      if (!result.ok) {
        setError(mapAuthErrorToMessage(result.error, messages, 'login'));
        return;
      }

      router.push(callbackUrl);
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
          {t.noAccount}{' '}
          <Link
            href={adminRegisterPath(locale)}
            className="text-primary hover:underline"
          >
            {t.createAccount}
          </Link>
        </p>
      }
    >
      <form className="space-y-4" onSubmit={onSubmit} noValidate>
        <AuthInput
          id="admin-email"
          name="email"
          type="email"
          label={t.emailLabel}
          placeholder={t.emailPlaceholder}
          value={email}
          onChange={setEmail}
          icon={Mail}
          disabled={pending}
          autoComplete="username"
        />
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm font-medium leading-none">
              {t.passwordLabel}
            </span>
            <Link
              href={adminForgotPasswordPath(locale)}
              className="text-sm text-primary hover:underline"
            >
              {t.forgotPassword}
            </Link>
          </div>
          <AuthInput
            id="admin-password"
            name="password"
            type="password"
            label=""
            placeholder={t.passwordPlaceholder}
            value={password}
            onChange={setPassword}
            icon={Lock}
            disabled={pending}
            autoComplete="current-password"
          />
        </div>
        {error ? (
          <p className="text-sm text-destructive" role="alert">
            {error}
          </p>
        ) : null}
        <Button type="submit" className="w-full" size="lg" disabled={pending}>
          {pending ? t.submitting : t.submit}
        </Button>
        <div className="relative py-2">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">
              {t.orDivider}
            </span>
          </div>
        </div>
      </form>
    </AuthCard>
  );
}
