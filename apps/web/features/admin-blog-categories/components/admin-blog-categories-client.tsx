'use client';

import { PencilIcon, PlusIcon, Trash2Icon } from 'lucide-react';
import {
  useActionState,
  useCallback,
  useEffect,
  useState,
  useTransition,
} from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { BlogCategory } from '@repo/api/client';
import type { AuthUserRole } from '@repo/api/client';
import type { Locale, Messages } from '@/shared/i18n';

import { resolveNameKey } from '@/shared/utils/resolve-name-key';

import {
  createCategoryAction,
  deleteCategoryAction,
  updateCategoryAction,
} from '../actions/category-actions';
import { initialCategoryFormActionState } from '../actions/category-form-action-state';
import type { CategoryFormError } from '../actions/category-form-action-state';

type AdminBlogCategoriesClientProps = {
  locale: Locale;
  messages: Messages;
  categories: BlogCategory[];
  userRole: AuthUserRole;
};

type DialogMode = 'create' | 'edit' | null;

function formErrorText(
  code: CategoryFormError | undefined,
  t: Messages['admin']['blogCategories']['errors'],
): string | undefined {
  if (!code) return undefined;
  return t[code];
}

export function AdminBlogCategoriesClient({
  locale,
  messages,
  categories,
  userRole,
}: AdminBlogCategoriesClientProps) {
  const t = messages.admin.blogCategories;
  const canMutate = userRole === 'admin';

  const [dialogMode, setDialogMode] = useState<DialogMode>(null);
  const [editing, setEditing] = useState<BlogCategory | null>(null);
  const [slug, setSlug] = useState('');
  const [nameKey, setNameKey] = useState('');
  const [sortOrder, setSortOrder] = useState('0');

  const [createState, createAction, createPending] = useActionState(
    createCategoryAction,
    initialCategoryFormActionState,
  );
  const [updateState, updateAction, updatePending] = useActionState(
    updateCategoryAction,
    initialCategoryFormActionState,
  );
  const [, startDeleteTransition] = useTransition();

  const pending = createPending || updatePending;
  const actionState = dialogMode === 'edit' ? updateState : createState;

  const openCreate = useCallback(() => {
    setEditing(null);
    setSlug('');
    setNameKey('blogs.categories.');
    setSortOrder(String(categories.length + 1));
    setDialogMode('create');
  }, [categories.length]);

  const openEdit = useCallback((category: BlogCategory) => {
    setEditing(category);
    setSlug(category.slug);
    setNameKey(category.nameKey);
    setSortOrder(String(category.sortOrder));
    setDialogMode('edit');
  }, []);

  const closeDialog = useCallback(() => {
    setDialogMode(null);
    setEditing(null);
  }, []);

  useEffect(() => {
    if (!actionState.ok && actionState.formError) {
      toast.error(formErrorText(actionState.formError, t.errors));
      return;
    }
    if (actionState.ok && dialogMode) {
      toast.success(
        dialogMode === 'create' ? t.toast.created : t.toast.updated,
      );
      closeDialog();
    }
  }, [actionState, closeDialog, dialogMode, t.errors, t.toast]);

  const submitForm = () => {
    const fd = new FormData();
    fd.set('locale', locale);
    fd.set('slug', slug);
    fd.set('nameKey', nameKey);
    fd.set('sortOrder', sortOrder);
    if (dialogMode === 'edit' && editing) {
      fd.set('id', editing.id);
      updateAction(fd);
    } else {
      createAction(fd);
    }
  };

  const onDelete = (category: BlogCategory) => {
    if (!window.confirm(t.confirmDelete)) return;
    const fd = new FormData();
    fd.set('locale', locale);
    fd.set('id', category.id);
    startDeleteTransition(async () => {
      const result = await deleteCategoryAction(fd);
      if (!result.ok) {
        toast.error(
          formErrorText(result.formError, t.errors) ?? t.errors.invalid,
        );
        return;
      }
      toast.success(t.toast.deleted);
    });
  };

  return (
    <div className="flex flex-col gap-6">
      {canMutate ? (
        <div className="flex justify-end">
          <Button type="button" onClick={openCreate}>
            <PlusIcon className="size-4" aria-hidden />
            {t.actions.create}
          </Button>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground" role="status">
          {t.readOnlyHint}
        </p>
      )}

      <div className="overflow-hidden rounded-lg border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b bg-muted/50">
              <tr>
                <th className="px-4 py-3 font-medium">{t.columns.slug}</th>
                <th className="px-4 py-3 font-medium">{t.columns.nameKey}</th>
                <th className="px-4 py-3 font-medium">{t.columns.label}</th>
                <th className="px-4 py-3 font-medium">{t.columns.sortOrder}</th>
                <th className="px-4 py-3 font-medium">{t.columns.updated}</th>
                {canMutate ? (
                  <th className="px-4 py-3 text-right font-medium">
                    {t.columns.actions}
                  </th>
                ) : null}
              </tr>
            </thead>
            <tbody className="divide-y">
              {categories.length === 0 ? (
                <tr>
                  <td
                    colSpan={canMutate ? 6 : 5}
                    className="px-4 py-12 text-center text-muted-foreground"
                  >
                    {t.empty}
                  </td>
                </tr>
              ) : (
                categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-muted/30">
                    <td className="px-4 py-3 font-mono text-xs">{cat.slug}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {cat.nameKey}
                    </td>
                    <td className="px-4 py-3">
                      {resolveNameKey(messages, cat.nameKey)}
                    </td>
                    <td className="px-4 py-3 tabular-nums">{cat.sortOrder}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      <time dateTime={cat.updatedAt}>
                        {new Date(cat.updatedAt).toLocaleDateString(locale)}
                      </time>
                    </td>
                    {canMutate ? (
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            aria-label={t.actions.edit}
                            onClick={() => openEdit(cat)}
                          >
                            <PencilIcon className="size-4" />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            aria-label={t.actions.delete}
                            onClick={() => onDelete(cat)}
                          >
                            <Trash2Icon className="size-4" />
                          </Button>
                        </div>
                      </td>
                    ) : null}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog
        open={dialogMode !== null}
        onOpenChange={(open) => {
          if (!open) closeDialog();
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {dialogMode === 'edit'
                ? t.dialog.editTitle
                : t.dialog.createTitle}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid gap-2">
              <Label htmlFor="cat-slug">{t.fields.slug}</Label>
              <Input
                id="cat-slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="it-partnership"
              />
              <p className="text-xs text-muted-foreground">
                {t.fields.slugHint}
              </p>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="cat-nameKey">{t.fields.nameKey}</Label>
              <Input
                id="cat-nameKey"
                value={nameKey}
                onChange={(e) => setNameKey(e.target.value)}
                placeholder="blogs.categories.it_partnership"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="cat-sort">{t.fields.sortOrder}</Label>
              <Input
                id="cat-sort"
                type="number"
                min={0}
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={closeDialog}>
              {t.actions.cancel}
            </Button>
            <Button type="button" onClick={submitForm} disabled={pending}>
              {pending ? t.actions.saving : t.actions.save}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
