'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Lock, Mail } from 'lucide-react';
import { useEffect, useMemo } from 'react';
import { Controller, useForm, type Resolver } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
import type { Messages } from '@/shared/i18n';

import {
  createAdminUserCreateSchema,
  createAdminUserUpdateSchema,
  type AdminUserCreateInput,
  type AdminUserUpdateInput,
} from '../validations/user.schema';

type DialogMode = 'create' | 'edit';

type UserUpsertDialogProps = {
  open: boolean;
  mode: DialogMode;
  messages: Messages;
  user: AdminUser | null;
  pending?: boolean;
  serverFieldErrors?: Record<string, string[] | undefined>;
  serverErrorText?: string;
  onOpenChange: (open: boolean) => void;
  onSubmitCreate: (values: AdminUserCreateInput) => void | Promise<void>;
  onSubmitEdit: (values: AdminUserUpdateInput) => void | Promise<void>;
};

export function UserUpsertDialog({
  open,
  mode,
  messages,
  user,
  pending,
  serverFieldErrors,
  serverErrorText,
  onOpenChange,
  onSubmitCreate,
  onSubmitEdit,
}: UserUpsertDialogProps) {
  const t = messages.admin.users;

  const createSchema = useMemo(() => createAdminUserCreateSchema(t), [t]);
  const updateSchema = useMemo(() => createAdminUserUpdateSchema(t), [t]);

  const createDefaults = useMemo<AdminUserCreateInput>(
    () => ({
      email: '',
      password: '',
      confirmPassword: '',
    }),
    [],
  );

  const editDefaults = useMemo<AdminUserUpdateInput>(() => {
    if (mode === 'edit' && user) {
      return {
        email: user.email,
        status: user.status,
        password: '',
        confirmPassword: '',
      };
    }
    return {
      email: '',
      status: 'active',
      password: '',
      confirmPassword: '',
    };
  }, [mode, user]);

  const createForm = useForm<AdminUserCreateInput>({
    resolver: zodResolver(
      createSchema,
    ) as unknown as Resolver<AdminUserCreateInput>,
    defaultValues: createDefaults,
  });

  const editForm = useForm<AdminUserUpdateInput>({
    resolver: zodResolver(
      updateSchema,
    ) as unknown as Resolver<AdminUserUpdateInput>,
    defaultValues: editDefaults,
  });

  useEffect(() => {
    if (!open) return;
    if (mode === 'create') {
      createForm.reset(createDefaults);
    } else {
      editForm.reset(editDefaults);
    }
  }, [createDefaults, createForm, editDefaults, editForm, mode, open]);

  useEffect(() => {
    if (!open) return;
    if (!serverFieldErrors) return;
    const form = mode === 'create' ? createForm : editForm;
    for (const [field, fieldMessages] of Object.entries(serverFieldErrors)) {
      const message = fieldMessages?.[0];
      if (!message) continue;
      if (
        field === 'email' ||
        field === 'password' ||
        field === 'confirmPassword' ||
        field === 'status'
      ) {
        form.setError(field as 'email', { type: 'server', message });
      }
    }
  }, [createForm, editForm, mode, open, serverFieldErrors]);

  const isCreate = mode === 'create';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isCreate ? t.dialog.createTitle : t.dialog.editTitle}
          </DialogTitle>
          <DialogDescription>
            {isCreate ? t.newPageDescription : t.editPageDescription}
          </DialogDescription>
        </DialogHeader>

        {isCreate ? (
          <Form {...createForm}>
            <form
              className="grid gap-4 py-2"
              onSubmit={(e) => {
                e.preventDefault();
                void createForm.handleSubmit(onSubmitCreate)();
              }}
              noValidate
            >
              {serverErrorText ? (
                <div className="rounded-md border border-destructive/40 bg-destructive/5 px-3 py-2 text-sm text-destructive">
                  {serverErrorText}
                </div>
              ) : null}

              <Controller
                name="email"
                control={createForm.control}
                render={({ field, fieldState }) => (
                  <AuthInput
                    id="admin-user-upsert-email"
                    name={field.name}
                    label={t.fields.email}
                    type="email"
                    placeholder={t.fields.email}
                    icon={Mail}
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    autoComplete="email"
                    disabled={pending}
                    error={fieldState.error?.message}
                  />
                )}
              />

              <Controller
                name="password"
                control={createForm.control}
                render={({ field, fieldState }) => (
                  <AuthInput
                    id="admin-user-upsert-password"
                    name={field.name}
                    label={t.fields.password}
                    type="password"
                    placeholder={t.fields.password}
                    icon={Lock}
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    autoComplete="new-password"
                    disabled={pending}
                    error={fieldState.error?.message}
                  />
                )}
              />

              <Controller
                name="confirmPassword"
                control={createForm.control}
                render={({ field, fieldState }) => (
                  <AuthInput
                    id="admin-user-upsert-confirm"
                    name={field.name}
                    label={t.fields.confirmPassword}
                    type="password"
                    placeholder={t.fields.confirmPassword}
                    icon={Lock}
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    autoComplete="new-password"
                    disabled={pending}
                    error={fieldState.error?.message}
                  />
                )}
              />

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                >
                  {t.actions.cancel}
                </Button>
                <Button type="submit" disabled={pending}>
                  {pending ? t.actions.saving : t.actions.save}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        ) : (
          <Form {...editForm}>
            <form
              className="grid gap-4 py-2"
              onSubmit={(e) => {
                e.preventDefault();
                void editForm.handleSubmit(onSubmitEdit)();
              }}
              noValidate
            >
              {serverErrorText ? (
                <div className="rounded-md border border-destructive/40 bg-destructive/5 px-3 py-2 text-sm text-destructive">
                  {serverErrorText}
                </div>
              ) : null}

              <Controller
                name="email"
                control={editForm.control}
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
                    disabled={pending}
                    error={fieldState.error?.message}
                  />
                )}
              />

              <Controller
                name="status"
                control={editForm.control}
                render={({ field }) => (
                  <div className="grid gap-2">
                    <label
                      className="text-sm font-medium"
                      htmlFor="admin-user-upsert-status"
                    >
                      {t.fields.status}
                    </label>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={pending}
                    >
                      <SelectTrigger id="admin-user-upsert-status">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">
                          {t.status.active}
                        </SelectItem>
                        <SelectItem value="disabled">
                          {t.status.disabled}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              />

              <Controller
                name="password"
                control={editForm.control}
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
                    disabled={pending}
                    error={fieldState.error?.message}
                  />
                )}
              />

              <Controller
                name="confirmPassword"
                control={editForm.control}
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
                    disabled={pending}
                    error={fieldState.error?.message}
                  />
                )}
              />

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                >
                  {t.actions.cancel}
                </Button>
                <Button type="submit" disabled={pending}>
                  {pending ? t.actions.saving : t.actions.save}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
