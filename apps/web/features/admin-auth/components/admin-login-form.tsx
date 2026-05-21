'use client';

import { Lock, Mail } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useActionState, useState } from 'react';

import { Button } from '@/components/ui/button';
import type { Messages } from '@/shared/i18n';

import { loginAdminAction } from '../actions/login-action';
import { initialLoginActionState } from '../actions/login-action-state';
import {
  adminForgotPasswordPath,
  adminRegisterPath,
} from '../lib/admin-auth-paths';
import { sanitizeAdminCallbackUrl } from '../lib/sanitize-callback-url';
import { AuthCard } from './auth-card';
import { AuthInput } from './auth-input';

type AdminLoginFormProps = {
  locale: string;
  messages: Messages;
};

export function AdminLoginForm({ locale, messages }: AdminLoginFormProps) {
  const searchParams = useSearchParams();
  const t = messages.admin.login;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [state, formAction, pending] = useActionState(
    loginAdminAction,
    initialLoginActionState,
  );

  const callbackUrl = sanitizeAdminCallbackUrl(
    searchParams.get('callbackUrl'),
    locale,
  );

  const formError = state.ok ? null : (state.error ?? t.errorGeneric);

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
      <form className="space-y-4" action={formAction} noValidate>
        <input type="hidden" name="locale" value={locale} />
        <input type="hidden" name="callbackUrl" value={callbackUrl} />
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
        {formError ? (
          <p className="text-sm text-destructive" role="alert">
            {formError}
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
