'use client';

import { PencilIcon, Trash2Icon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import type { Locale, Messages } from '@/shared/i18n';
import type { BlogCategory } from '@repo/api/client';

type BlogCategoriesTableProps = {
  locale: Locale;
  messages: Messages;
  categories: BlogCategory[];
  canMutate: boolean;
  onEdit: (category: BlogCategory) => void;
  onDelete: (category: BlogCategory) => void;
};

export function BlogCategoriesTable({
  locale,
  messages,
  categories,
  canMutate,
  onEdit,
  onDelete,
}: BlogCategoriesTableProps) {
  const t = messages.admin.blogCategories;

  return (
    <div className="overflow-hidden rounded-lg border bg-card shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead className="border-b bg-muted/50">
            <tr>
              <th className="px-4 py-3 font-medium">{t.columns.displayName}</th>
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
                  colSpan={canMutate ? 3 : 2}
                  className="px-4 py-12 text-center text-muted-foreground"
                >
                  {t.empty}
                </td>
              </tr>
            ) : (
              categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-muted/30">
                  <td className="px-4 py-3 font-medium">{cat.displayName}</td>
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
                          onClick={() => onEdit(cat)}
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
  );
}
