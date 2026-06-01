'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';

import type { Messages } from '@/shared/i18n';

import { getAuthErrorMessage } from '../utils/auth-error';
import {
  createAdminLoginSchema,
  type AdminLoginField,
  type AdminLoginInput,
} from '../validations/login.schema';

export type UseAdminLoginOptions = {
  locale: string;
  messages: Messages;
  callbackUrl: string;
};

export function useAdminLogin({ messages, callbackUrl }: UseAdminLoginOptions) {
  const router = useRouter();
  const t = messages.admin.login;
  const schema = useMemo(() => createAdminLoginSchema(t), [t]);
  const resolver = useMemo(
    () => zodResolver(schema, undefined, { mode: 'sync' }),
    [schema],
  );

  const [globalError, setGlobalError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<AdminLoginInput>({
    resolver,
    defaultValues: { email: '', password: '' },
    mode: 'onBlur',
  });

  const { setError, clearErrors } = form;

  const onSubmit = form.handleSubmit(
    async (data) => {
      clearErrors();
      setGlobalError(null);
      setIsSubmitting(true);

      try {
        const result = await signIn('credentials', {
          email: data.email,
          password: data.password,
          redirect: false,
        });

        if (result?.error) {
          setGlobalError(t.errorGeneric);
          return;
        }

        if (result?.ok) {
          router.push(callbackUrl);
          router.refresh();
          return;
        }

        setGlobalError(t.errorGeneric);
      } catch {
        setGlobalError(getAuthErrorMessage('network', messages, 'login'));
      } finally {
        setIsSubmitting(false);
      }
    },
    () => {
      /* Client validation failed */
    },
  );

  const applyServerFieldErrors = (
    fieldErrors: Partial<Record<AdminLoginField, string>>,
  ) => {
    for (const field of Object.keys(fieldErrors) as AdminLoginField[]) {
      const message = fieldErrors[field];
      if (message) {
        setError(field, { type: 'server', message });
      }
    }
  };

  return {
    form,
    onSubmit,
    isSubmitting: isSubmitting || form.formState.isSubmitting,
    globalError,
    t,
    applyServerFieldErrors,
  };
}
