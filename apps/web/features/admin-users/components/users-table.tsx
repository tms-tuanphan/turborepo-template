'use client';

import { PencilIcon, RotateCcwIcon, Trash2Icon } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import type { AdminUser } from '@repo/api/client';
import type { Locale, Messages } from '@/shared/i18n';

type UsersTableProps = {
  locale: Locale;
  messages: Messages;
  users: AdminUser[];
  mode: 'active' | 'deleted';
  onDelete?: (user: AdminUser) => void;
  onRestore?: (user: AdminUser) => void;
};

export function UsersTable({
  locale,
  messages,
  users,
  mode,
  onDelete,
  onRestore,
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
              <th className="px-4 py-3 text-right font-medium">
                {t.columns.actions}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {users.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-12 text-center text-muted-foreground"
                >
                  {mode === 'deleted' ? t.emptyDeleted : t.empty}
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
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-1">
                      {mode === 'active' ? (
                        <>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            aria-label={t.actions.edit}
                            asChild
                          >
                            <Link
                              href={`/${locale}/admin/users/${user.id}/edit`}
                            >
                              <PencilIcon className="size-4" />
                            </Link>
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            aria-label={t.actions.delete}
                            onClick={() => onDelete?.(user)}
                          >
                            <Trash2Icon className="size-4" />
                          </Button>
                        </>
                      ) : (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          aria-label={t.actions.restore}
                          onClick={() => onRestore?.(user)}
                        >
                          <RotateCcwIcon className="size-4" />
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
