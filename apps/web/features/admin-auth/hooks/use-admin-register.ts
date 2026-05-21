'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { I18nKey } from '@repo/api/client';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';

import type { Messages } from '@/shared/i18n';

import { registerAdmin } from '../lib/auth-api';
import { adminLoginPath } from '../lib/admin-auth-paths';
import { getAuthErrorMessage } from '../lib/map-auth-error';
import {
  createAdminRegisterSchema,
  type AdminRegisterInput,
} from '../validations/register.schema';

export type UseAdminRegisterOptions = {
  locale: string;
  messages: Messages;
};

export function useAdminRegister({
  locale,
  messages,
}: UseAdminRegisterOptions) {
  const router = useRouter();
  const t = messages.admin.register;
  const loginPath = adminLoginPath(locale);

  const schema = useMemo(() => createAdminRegisterSchema(t), [t]);
  const resolver = useMemo(
    () => zodResolver(schema, undefined, { mode: 'sync' }),
    [schema],
  );

  const [globalError, setGlobalError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<AdminRegisterInput>({
    resolver,
    defaultValues: { email: '', password: '', confirmPassword: '' },
    mode: 'onBlur',
  });

  const onSubmit = form.handleSubmit(
    async (data) => {
      setGlobalError(null);

      setIsSubmitting(true);
      try {
        const result = await registerAdmin({
          email: data.email,
          password: data.password,
        });

        if (!result.ok) {
          const code = result.error.code;

          if (code === I18nKey.Errors.Auth.EmailAlreadyExists) {
            form.setError('email', {
              type: 'server',
              message: t.errorEmailExists,
            });
            return;
          }

          if (code === I18nKey.Errors.Auth.WeakPassword) {
            form.setError('password', {
              type: 'server',
              message: t.errorWeakPassword,
            });
            return;
          }

          setGlobalError(
            getAuthErrorMessage(result.error, messages, 'register'),
          );
          return;
        }

        router.push(loginPath);
        router.refresh();
      } catch {
        setGlobalError(getAuthErrorMessage('network', messages, 'register'));
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
