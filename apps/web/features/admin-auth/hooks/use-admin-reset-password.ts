'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { I18nKey } from '@repo/api/client';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';

import type { Messages } from '@/shared/i18n';

import { resetPasswordAdmin } from '../lib/auth-api';
import { adminResetPasswordSuccessPath } from '../lib/admin-auth-paths';
import { getAuthErrorMessage } from '../lib/map-auth-error';
import {
  createAdminResetPasswordSchema,
  toResetPasswordRequestBody,
  type AdminResetPasswordInput,
} from '../validations/reset-password.schema';

export type UseAdminResetPasswordOptions = {
  locale: string;
  messages: Messages;
  token: string;
};

export function useAdminResetPassword({
  locale,
  messages,
  token,
}: UseAdminResetPasswordOptions) {
  const router = useRouter();
  const t = messages.admin.resetPassword;

  const schema = useMemo(() => createAdminResetPasswordSchema(t), [t]);
  const resolver = useMemo(
    () => zodResolver(schema, undefined, { mode: 'sync' }),
    [schema],
  );

  const [globalError, setGlobalError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<AdminResetPasswordInput>({
    resolver,
    defaultValues: { password: '', confirmPassword: '' },
    mode: 'onBlur',
  });

  const onSubmit = form.handleSubmit(
    async (data) => {
      setGlobalError(null);

      setIsSubmitting(true);
      try {
        const body = toResetPasswordRequestBody(token, data);
        const result = await resetPasswordAdmin(body);

        if (!result.ok) {
          const code = result.error.code;

          if (code === I18nKey.Errors.Auth.WeakPassword) {
            form.setError('password', {
              type: 'server',
              message: t.errorWeakPassword,
            });
            return;
          }

          if (
            code === I18nKey.Errors.Auth.InvalidResetToken ||
            code === I18nKey.Errors.Common.Unauthorized
          ) {
            setGlobalError(t.errorInvalidToken);
            return;
          }

          setGlobalError(
            getAuthErrorMessage(result.error, messages, 'resetPassword'),
          );
          return;
        }

        router.push(adminResetPasswordSuccessPath(locale));
      } catch {
        setGlobalError(
          getAuthErrorMessage('network', messages, 'resetPassword'),
        );
      } finally {
        setIsSubmitting(false);
      }
    },
    () => {
      /* Client validation failed — field errors are already set by RHF */
    },
  );

  const submitting = isSubmitting || form.formState.isSubmitting;

  return {
    form,
    onSubmit,
    isSubmitting: submitting,
    globalError,
    t,
  };
}
