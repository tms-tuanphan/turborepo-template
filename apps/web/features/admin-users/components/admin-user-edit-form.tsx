'use client';

import { Loader2, Lock, Mail } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AuthInput } from '@/features/admin-auth';
import type { AdminUser } from '@repo/api/client';
import type { Locale, Messages } from '@/shared/i18n';

import { patchAdminUser } from '../lib/admin-users-client-api';
import {
  createAdminUserUpdateSchema,
  type AdminUserUpdateInput,
} from '../validations/user.schema';

type AdminUserEditFormProps = {
  locale: Locale;
  messages: Messages;
  user: AdminUser;
};

export function AdminUserEditForm({
  locale,
  messages,
  user,
}: AdminUserEditFormProps) {
  const t = messages.admin.users;
  const router = useRouter();
  const [globalError, setGlobalError] = useState<string | null>(null);

  const schema = useMemo(() => createAdminUserUpdateSchema(t), [t]);
  const form = useForm<AdminUserUpdateInput>({
    defaultValues: {
      email: user.email,
      status: user.status,
      password: '',
      confirmPassword: '',
    },
    mode: 'onSubmit',
  });

  const isSubmitting = form.formState.isSubmitting;

  async function onSubmit(data: AdminUserUpdateInput) {
    setGlobalError(null);
    const parsed = schema.safeParse(data);
    if (!parsed.success) {
      for (const issue of parsed.error.issues) {
        const field = issue.path[0];
        if (typeof field === 'string') {
          form.setError(field as keyof AdminUserUpdateInput, {
            message: issue.message,
          });
        }
      }
      return;
    }

    const body: {
      email: string;
      status: 'active' | 'disabled';
      password?: string;
    } = {
      email: parsed.data.email,
      status: parsed.data.status,
    };
    if (parsed.data.password) {
      body.password = parsed.data.password;
    }

    try {
      const result = await patchAdminUser(user.id, body);
      if (!result.ok) {
        setGlobalError(t.errors[result.code] ?? t.errors.invalid);
        return;
      }
      toast.success(t.toast.updated);
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
              id="admin-user-edit-email"
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
          name="status"
          control={form.control}
          render={({ field }) => (
            <div className="grid gap-2">
              <label
                className="text-sm font-medium"
                htmlFor="admin-user-status"
              >
                {t.fields.status}
              </label>
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id="admin-user-status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">{t.status.active}</SelectItem>
                  <SelectItem value="disabled">{t.status.disabled}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        />

        <Controller
          name="password"
          control={form.control}
          render={({ field, fieldState }) => (
            <AuthInput
              id="admin-user-edit-password"
              name={field.name}
              label={t.fields.newPasswordOptional}
              type="password"
              placeholder={t.fields.newPasswordOptional}
              icon={Lock}
              value={field.value ?? ''}
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
              id="admin-user-edit-confirm"
              name={field.name}
              label={t.fields.confirmPassword}
              type="password"
              placeholder={t.fields.confirmPassword}
              icon={Lock}
              value={field.value ?? ''}
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
