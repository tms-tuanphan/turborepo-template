'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';
import type { Messages } from '@/shared/i18n';
import type { BlogCategory } from '@repo/api/client';

type CategoryDeleteDialogProps = {
  open: boolean;
  messages: Messages;
  category: BlogCategory | null;
  pending?: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
};

export function CategoryDeleteDialog({
  open,
  messages,
  category,
  pending,
  onOpenChange,
  onConfirm,
}: CategoryDeleteDialogProps) {
  const t = messages.admin.blogCategories;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t.actions.delete}</DialogTitle>
          <DialogDescription>{t.confirmDelete}</DialogDescription>
        </DialogHeader>

        <div className="grid gap-2 py-2">
          {category ? (
            <div className="rounded-md border bg-muted/30 px-3 py-2 font-mono text-xs">
              {category.slug}
            </div>
          ) : null}
        </div>

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
