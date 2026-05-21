'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useActionState, useEffect, useMemo, useTransition } from 'react';
import { useForm } from 'react-hook-form';

import type { Messages } from '@/shared/i18n';

import { loginAdminAction } from '../actions/login-action';
import { initialLoginActionState } from '../actions/login-action-state';
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

export function useAdminLogin({
  locale,
  messages,
  callbackUrl,
}: UseAdminLoginOptions) {
  const t = messages.admin.login;
  const schema = useMemo(() => createAdminLoginSchema(t), [t]);
  const resolver = useMemo(
    () => zodResolver(schema, undefined, { mode: 'sync' }),
    [schema],
  );

  const [state, formAction] = useActionState(
    loginAdminAction,
    initialLoginActionState,
  );
  const [isPending, startTransition] = useTransition();

  const form = useForm<AdminLoginInput>({
    resolver,
    defaultValues: { email: '', password: '' },
    mode: 'onBlur',
  });

  const { setError, clearErrors } = form;

  useEffect(() => {
    if (state.ok) {
      return;
    }

    if (state.fieldErrors) {
      for (const field of Object.keys(state.fieldErrors) as AdminLoginField[]) {
        const message = state.fieldErrors[field];
        if (message) {
          setError(field, { type: 'server', message });
        }
      }
    }
  }, [state, setError]);

  const hasFieldErrors =
    !state.ok &&
    state.fieldErrors !== undefined &&
    Object.keys(state.fieldErrors).length > 0;

  const globalError =
    !state.ok && state.error && !hasFieldErrors ? state.error : null;

  const onSubmit = form.handleSubmit(
    (data) => {
      clearErrors();
      const formData = new FormData();
      formData.set('locale', locale);
      formData.set('callbackUrl', callbackUrl);
      formData.set('email', data.email);
      formData.set('password', data.password);

      startTransition(() => {
        formAction(formData);
      });
    },
    () => {
      /* Client validation failed — field errors are already set by RHF */
    },
  );

  const isSubmitting = isPending || form.formState.isSubmitting;

  return {
    form,
    onSubmit,
    isSubmitting,
    globalError,
    t,
  };
}
