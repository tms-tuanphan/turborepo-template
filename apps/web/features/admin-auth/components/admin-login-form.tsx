'use client';

import { Loader2, Lock, Mail } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Controller } from 'react-hook-form';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import type { Messages } from '@/shared/i18n';

import { useAdminLogin } from '../hooks/use-admin-login';
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

  const callbackUrl = sanitizeAdminCallbackUrl(
    searchParams.get('callbackUrl'),
    locale,
  );

  const { form, onSubmit, isSubmitting, globalError, t } = useAdminLogin({
    locale,
    messages,
    callbackUrl,
  });

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
      <Form {...form}>
        <form className="space-y-4" onSubmit={onSubmit} noValidate>
          <Controller
            name="email"
            control={form.control}
            render={({ field, fieldState }) => (
              <AuthInput
                id="admin-email"
                name={field.name}
                type="email"
                label={t.emailLabel}
                placeholder={t.emailPlaceholder}
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                icon={Mail}
                disabled={isSubmitting}
                autoComplete="username"
                error={fieldState.error?.message}
              />
            )}
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
            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <AuthInput
                  id="admin-password"
                  name={field.name}
                  type="password"
                  label=""
                  placeholder={t.passwordPlaceholder}
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  icon={Lock}
                  disabled={isSubmitting}
                  autoComplete="current-password"
                  error={fieldState.error?.message}
                />
              )}
            />
          </div>
          {globalError ? (
            <Alert variant="destructive">
              <AlertDescription>{globalError}</AlertDescription>
            </Alert>
          ) : null}
          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="size-4 animate-spin" aria-hidden />
                {t.submitting}
              </>
            ) : (
              t.submit
            )}
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
      </Form>
    </AuthCard>
  );
}
