'use client';

import { Loader2, Lock, Mail } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { AuthInput } from '@/features/admin-auth';
import type { Locale, Messages } from '@/shared/i18n';

import { postAdminUser } from '../lib/admin-users-client-api';
import {
  createAdminUserCreateSchema,
  toCreateAdminUserBody,
  type AdminUserCreateInput,
} from '../validations/user.schema';

type AdminUserCreateFormProps = {
  locale: Locale;
  messages: Messages;
};

export function AdminUserCreateForm({
  locale,
  messages,
}: AdminUserCreateFormProps) {
  const t = messages.admin.users;
  const router = useRouter();
  const [globalError, setGlobalError] = useState<string | null>(null);

  const schema = useMemo(() => createAdminUserCreateSchema(t), [t]);
  const form = useForm<AdminUserCreateInput>({
    resolver: undefined,
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
    mode: 'onSubmit',
  });

  const isSubmitting = form.formState.isSubmitting;

  async function onSubmit(data: AdminUserCreateInput) {
    setGlobalError(null);
    const parsed = schema.safeParse(data);
    if (!parsed.success) {
      for (const issue of parsed.error.issues) {
        const field = issue.path[0];
        if (typeof field === 'string') {
          form.setError(field as keyof AdminUserCreateInput, {
            message: issue.message,
          });
        }
      }
      return;
    }

    try {
      const body = toCreateAdminUserBody(parsed.data);
      const result = await postAdminUser(body);
      if (!result.ok) {
        if ('fieldErrors' in result && result.fieldErrors) {
          for (const [field, errors] of Object.entries(result.fieldErrors)) {
            if (errors?.[0]) {
              form.setError(field as keyof AdminUserCreateInput, {
                message: errors[0],
              });
            }
          }
        }
        setGlobalError(t.errors[result.code] ?? t.errors.invalid);
        return;
      }
      toast.success(t.toast.created);
      router.push(`/${locale}/admin/users`);
      router.refresh();
    } catch {
      setGlobalError(t.errors.invalid);
    }
  }

  return (
    <Form {...form}>
      <form
        className="mx-auto flex max-w-md flex-col gap-4"
        onSubmit={form.handleSubmit(onSubmit)}
        noValidate
      >
        {globalError ? (
          <Alert variant="destructive">
            <AlertDescription>{globalError}</AlertDescription>
          </Alert>
        ) : null}

        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <AuthInput
              id="admin-user-create-email"
              name={field.name}
              label={t.fields.email}
              type="email"
              placeholder={t.fields.email}
              icon={Mail}
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              autoComplete="email"
              disabled={isSubmitting}
              error={fieldState.error?.message}
            />
          )}
        />

        <Controller
          name="password"
          control={form.control}
          render={({ field, fieldState }) => (
            <AuthInput
              id="admin-user-create-password"
              name={field.name}
              label={t.fields.password}
              type="password"
              placeholder={t.fields.password}
              icon={Lock}
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              autoComplete="new-password"
              disabled={isSubmitting}
              error={fieldState.error?.message}
            />
          )}
        />

        <Controller
          name="confirmPassword"
          control={form.control}
          render={({ field, fieldState }) => (
            <AuthInput
              id="admin-user-create-confirm"
              name={field.name}
              label={t.fields.confirmPassword}
              type="password"
              placeholder={t.fields.confirmPassword}
              icon={Lock}
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              autoComplete="new-password"
              disabled={isSubmitting}
              error={fieldState.error?.message}
            />
          )}
        />

        <div className="flex gap-2 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push(`/${locale}/admin/users`)}
          >
            {t.actions.cancel}
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="size-4 animate-spin" aria-hidden />
                {t.actions.saving}
              </>
            ) : (
              t.actions.save
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
