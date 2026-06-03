'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { AdminUser } from '@repo/api/client';
import type { Messages } from '@/shared/i18n';

type UserDeleteDialogProps = {
  user: AdminUser | null;
  open: boolean;
  messages: Messages;
  pending?: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
};

export function UserDeleteDialog({
  user,
  open,
  messages,
  pending,
  onOpenChange,
  onConfirm,
}: UserDeleteDialogProps) {
  const t = messages.admin.users;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t.dialog.deleteTitle}</DialogTitle>
          <DialogDescription>{t.confirmDelete}</DialogDescription>
        </DialogHeader>
        {user ? (
          <div className="rounded-md border bg-muted/30 px-3 py-2 text-sm">
            {user.email}
          </div>
        ) : null}
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            {t.actions.cancel}
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={onConfirm}
            disabled={pending}
          >
            {pending ? t.actions.saving : t.actions.delete}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
