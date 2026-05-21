'use client';

import { Loader2, Lock, Mail } from 'lucide-react';
import Link from 'next/link';
import { Controller } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import type { Messages } from '@/shared/i18n';

import { useAdminRegister } from '../hooks/use-admin-register';
import { adminLoginPath } from '../lib/admin-auth-paths';
import { AuthCard } from './auth-card';
import { AuthErrorAlert } from './auth-error-alert';
import { AuthInput } from './auth-input';

type AdminRegisterFormProps = {
  locale: string;
  messages: Messages;
};

export function AdminRegisterForm({
  locale,
  messages,
}: AdminRegisterFormProps) {
  const loginPath = adminLoginPath(locale);
  const { form, onSubmit, isSubmitting, globalError, t } = useAdminRegister({
    locale,
    messages,
  });

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
      <Form {...form}>
        <form className="space-y-4" onSubmit={onSubmit} noValidate>
          <Controller
            name="email"
            control={form.control}
            render={({ field, fieldState }) => (
              <AuthInput
                id="admin-register-email"
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
          <div className="space-y-2">
            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <AuthInput
                  id="admin-register-password"
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
                id="admin-register-confirm"
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
