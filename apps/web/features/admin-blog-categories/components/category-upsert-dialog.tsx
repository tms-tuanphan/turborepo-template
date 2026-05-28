'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useMemo } from 'react';
import { useForm, type Resolver } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import type { Messages } from '@/shared/i18n';
import type { BlogCategory } from '@repo/api/client';

import {
  blogCategoryFormSchema,
  type BlogCategoryFormInput,
} from '../validations/category.schema';

type DialogMode = 'create' | 'edit';

type CategoryUpsertDialogProps = {
  open: boolean;
  mode: DialogMode;
  messages: Messages;
  initialSortOrder: number;
  category: BlogCategory | null;
  pending?: boolean;
  serverFieldErrors?: Record<string, string[] | undefined>;
  serverErrorText?: string;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: BlogCategoryFormInput) => void | Promise<void>;
};

export function CategoryUpsertDialog({
  open,
  mode,
  messages,
  initialSortOrder,
  category,
  pending,
  serverFieldErrors,
  serverErrorText,
  onOpenChange,
  onSubmit,
}: CategoryUpsertDialogProps) {
  const t = messages.admin.blogCategories;

  const defaultValues = useMemo<BlogCategoryFormInput>(() => {
    if (mode === 'edit' && category) {
      return {
        slug: category.slug,
        nameKey: category.nameKey,
        sortOrder: category.sortOrder,
      };
    }

    return {
      slug: '',
      nameKey: 'blogs.categories.',
      sortOrder: initialSortOrder,
    };
  }, [category, initialSortOrder, mode]);

  const form = useForm<BlogCategoryFormInput>({
    resolver: zodResolver(
      blogCategoryFormSchema,
    ) as unknown as Resolver<BlogCategoryFormInput>,
    defaultValues,
  });

  useEffect(() => {
    if (!open) return;
    form.reset(defaultValues);
  }, [defaultValues, form, open]);

  useEffect(() => {
    if (!open) return;
    if (!serverFieldErrors) return;
    for (const [field, messages] of Object.entries(serverFieldErrors)) {
      const message = messages?.[0];
      if (!message) continue;
      if (field === 'slug' || field === 'nameKey' || field === 'sortOrder') {
        form.setError(field, { type: 'server', message });
      }
    }
  }, [form, open, serverFieldErrors]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {mode === 'edit' ? t.dialog.editTitle : t.dialog.createTitle}
          </DialogTitle>
          <DialogDescription>{t.pageDescription}</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            className="grid gap-4 py-2"
            onSubmit={(e) => {
              e.preventDefault();
              void form.handleSubmit(onSubmit)();
            }}
          >
            {serverErrorText ? (
              <div className="rounded-md border border-destructive/40 bg-destructive/5 px-3 py-2 text-sm text-destructive">
                {serverErrorText}
              </div>
            ) : null}

            <FormField<BlogCategoryFormInput, 'slug'>
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t.fields.slug}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>{t.fields.slugHint}</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField<BlogCategoryFormInput, 'nameKey'>
              control={form.control}
              name="nameKey"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t.fields.nameKey}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField<BlogCategoryFormInput, 'sortOrder'>
              control={form.control}
              name="sortOrder"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t.fields.sortOrder}</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      max={9999}
                      value={String(field.value ?? 0)}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
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
      </DialogContent>
    </Dialog>
  );
}
