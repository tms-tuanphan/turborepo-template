'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';

import type { Messages } from '@/shared/i18n';

import { forgotPasswordAdmin } from '../lib/auth-api';
import { adminForgotPasswordSentPath } from '../lib/admin-auth-paths';
import { getAuthErrorMessage } from '../lib/map-auth-error';
import {
  createAdminForgotPasswordSchema,
  toForgotPasswordRequestBody,
  type AdminForgotPasswordInput,
} from '../validations/forgot-password.schema';

export type UseAdminForgotPasswordOptions = {
  locale: string;
  messages: Messages;
};

export function useAdminForgotPassword({
  locale,
  messages,
}: UseAdminForgotPasswordOptions) {
  const router = useRouter();
  const t = messages.admin.forgotPassword;

  const schema = useMemo(() => createAdminForgotPasswordSchema(t), [t]);
  const resolver = useMemo(
    () => zodResolver(schema, undefined, { mode: 'sync' }),
    [schema],
  );

  const [globalError, setGlobalError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<AdminForgotPasswordInput>({
    resolver,
    defaultValues: { email: '' },
    mode: 'onBlur',
  });

  const onSubmit = form.handleSubmit(
    async (data) => {
      setGlobalError(null);

      setIsSubmitting(true);
      try {
        const body = toForgotPasswordRequestBody(data);
        const result = await forgotPasswordAdmin(body);

        if (!result.ok) {
          setGlobalError(
            getAuthErrorMessage(result.error, messages, 'forgotPassword'),
          );
          return;
        }

        const sentUrl = new URL(
          adminForgotPasswordSentPath(locale),
          window.location.origin,
        );
        sentUrl.searchParams.set('email', body.email);
        router.push(`${sentUrl.pathname}${sentUrl.search}`);
      } catch {
        setGlobalError(
          getAuthErrorMessage('network', messages, 'forgotPassword'),
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
