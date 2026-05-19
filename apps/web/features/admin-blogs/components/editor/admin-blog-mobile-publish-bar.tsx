'use client';

import { SendHorizontalIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type AdminBlogMobilePublishBarProps = {
  saveDraftLabel: string;
  publishLabel: string;
  savingLabel: string;
  pending: boolean;
  onSaveDraft: () => void;
  onPublish: () => void;
  className?: string;
};

export function AdminBlogMobilePublishBar({
  saveDraftLabel,
  publishLabel,
  savingLabel,
  pending,
  onSaveDraft,
  onPublish,
  className,
}: AdminBlogMobilePublishBarProps) {
  return (
    <div
      className={cn(
        'fixed inset-x-0 bottom-0 z-40 flex gap-2 border-t border-border/60 bg-background/95 p-3 backdrop-blur-md supports-backdrop-filter:bg-background/80 xl:hidden',
        className,
      )}
    >
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={pending}
        className="shrink-0"
        onClick={onSaveDraft}
      >
        {pending ? savingLabel : saveDraftLabel}
      </Button>
      <Button
        type="button"
        size="sm"
        disabled={pending}
        className="min-w-0 flex-1 gap-1.5"
        onClick={onPublish}
      >
        {pending ? (
          savingLabel
        ) : (
          <>
            <SendHorizontalIcon className="size-4" aria-hidden />
            {publishLabel}
          </>
        )}
      </Button>
    </div>
  );
}
