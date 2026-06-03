'use client';

import { PencilIcon, Trash2Icon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import type { AdminUser } from '@repo/api/client';
import type { Locale, Messages } from '@/shared/i18n';

type UsersTableProps = {
  locale: Locale;
  messages: Messages;
  users: AdminUser[];
  canMutate: boolean;
  onEdit: (user: AdminUser) => void;
  onDelete: (user: AdminUser) => void;
};

export function UsersTable({
  locale,
  messages,
  users,
  canMutate,
  onEdit,
  onDelete,
}: UsersTableProps) {
  const t = messages.admin.users;

  return (
    <div className="overflow-hidden rounded-lg border bg-card shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b bg-muted/50">
            <tr>
              <th className="px-4 py-3 font-medium">{t.columns.email}</th>
              <th className="px-4 py-3 font-medium">{t.columns.status}</th>
              <th className="px-4 py-3 font-medium">{t.columns.updated}</th>
              {canMutate ? (
                <th className="px-4 py-3 text-right font-medium">
                  {t.columns.actions}
                </th>
              ) : null}
            </tr>
          </thead>
          <tbody className="divide-y">
            {users.length === 0 ? (
              <tr>
                <td
                  colSpan={canMutate ? 4 : 3}
                  className="px-4 py-12 text-center text-muted-foreground"
                >
                  {t.empty}
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id} className="hover:bg-muted/30">
                  <td className="px-4 py-3 font-medium">{user.email}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {user.status === 'active'
                      ? t.status.active
                      : t.status.disabled}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    <time dateTime={user.updatedAt}>
                      {new Date(user.updatedAt).toLocaleDateString(locale)}
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
                          onClick={() => onEdit(user)}
                        >
                          <PencilIcon className="size-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          aria-label={t.actions.delete}
                          onClick={() => onDelete(user)}
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
