'use client';

import { Loader2, Lock } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { Controller } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import type { Messages } from '@/shared/i18n';

import { useAdminResetPassword } from '../hooks/use-admin-reset-password';
import { adminLoginPath } from '../lib/admin-auth-paths';
import { AuthBackLink } from './auth-back-link';
import { AuthCard } from './auth-card';
import { AuthErrorAlert } from './auth-error-alert';
import { AuthInput } from './auth-input';

type AdminResetPasswordFormProps = {
  locale: string;
  messages: Messages;
};

export function AdminResetPasswordForm({
  locale,
  messages,
}: AdminResetPasswordFormProps) {
  const searchParams = useSearchParams();
  const loginPath = adminLoginPath(locale);
  const token = searchParams.get('token') ?? '';

  const { form, onSubmit, isSubmitting, globalError, t } =
    useAdminResetPassword({
      locale,
      messages,
      token,
    });

  if (!token) {
    return (
      <AuthCard
        title={t.title}
        description={t.missingToken}
        footer={<AuthBackLink href={loginPath} label={t.backToLogin} />}
      />
    );
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
      <Form {...form}>
        <form className="space-y-4" onSubmit={onSubmit} noValidate>
          <div className="space-y-2">
            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <AuthInput
                  id="admin-reset-password"
                  name={field.name}
                  type="password"
                  label={t.passwordLabel}
                  placeholder={t.passwordPlaceholder}
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  icon={Lock}
                  disabled={isSubmitting}
                  autoComplete="new-password"
                  error={fieldState.error?.message}
                />
              )}
            />
            <p className="whitespace-pre-line text-xs text-muted-foreground">
              {t.passwordHint}
            </p>
          </div>
          <Controller
            name="confirmPassword"
            control={form.control}
            render={({ field, fieldState }) => (
              <AuthInput
                id="admin-reset-confirm"
                name={field.name}
                type="password"
                label={t.confirmPasswordLabel}
                placeholder={t.confirmPasswordPlaceholder}
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                icon={Lock}
                disabled={isSubmitting}
                autoComplete="new-password"
                error={fieldState.error?.message}
              />
            )}
          />
          <AuthErrorAlert message={globalError} />
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
        </form>
      </Form>
    </AuthCard>
  );
}
