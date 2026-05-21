'use client';

import { Loader2, Mail } from 'lucide-react';
import { Controller } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import type { Messages } from '@/shared/i18n';

import { useAdminForgotPassword } from '../hooks/use-admin-forgot-password';
import { adminLoginPath } from '../lib/admin-auth-paths';
import { AuthBackLink } from './auth-back-link';
import { AuthCard } from './auth-card';
import { AuthErrorAlert } from './auth-error-alert';
import { AuthInput } from './auth-input';

type AdminForgotPasswordFormProps = {
  locale: string;
  messages: Messages;
};

export function AdminForgotPasswordForm({
  locale,
  messages,
}: AdminForgotPasswordFormProps) {
  const loginPath = adminLoginPath(locale);
  const { form, onSubmit, isSubmitting, globalError, t } =
    useAdminForgotPassword({
      locale,
      messages,
    });

  return (
    <AuthCard
      title={t.title}
      description={t.description}
      backHref={loginPath}
      backLabel={t.backToLogin}
      footer={<AuthBackLink href={loginPath} label={t.backToLogin} />}
    >
      <Form {...form}>
        <form className="space-y-4" onSubmit={onSubmit} noValidate>
          <Controller
            name="email"
            control={form.control}
            render={({ field, fieldState }) => (
              <AuthInput
                id="admin-forgot-email"
                name={field.name}
                type="email"
                label={t.emailLabel}
                placeholder={t.emailPlaceholder}
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                icon={Mail}
                disabled={isSubmitting}
                autoComplete="email"
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
