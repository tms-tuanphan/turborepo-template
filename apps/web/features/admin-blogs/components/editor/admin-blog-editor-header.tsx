'use client';

import { ArrowLeftIcon, SendHorizontalIcon } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { BlogStatus } from '@/shared/types/blog';

import { AdminBlogDocumentStatus } from './admin-blog-document-status';

type AdminBlogEditorHeaderProps = {
  listHref: string;
  backLabel: string;
  status: BlogStatus;
  statusLabel: string;
  saved?: boolean;
  savedLabel?: string;
  saveDraftLabel: string;
  savingLabel: string;
  publishLabel: string;
  pending: boolean;
  onSaveDraft: () => void;
  onPublish: () => void;
  className?: string;
};

export function AdminBlogEditorHeader({
  listHref,
  backLabel,
  status,
  statusLabel,
  saved,
  savedLabel,
  saveDraftLabel,
  savingLabel,
  publishLabel,
  pending,
  onSaveDraft,
  onPublish,
  className,
}: AdminBlogEditorHeaderProps) {
  return (
    <div
      className={cn(
        'flex h-12 shrink-0 items-center gap-3 px-4 sm:px-6',
        className,
      )}
    >
      <Button variant="ghost" size="icon-sm" className="shrink-0" asChild>
        <Link href={listHref} aria-label={backLabel}>
          <ArrowLeftIcon className="size-4" aria-hidden />
        </Link>
      </Button>

      <div className="ml-auto flex items-center gap-3">
        <AdminBlogDocumentStatus
          status={status}
          statusLabel={statusLabel}
          saved={saved}
          savedLabel={savedLabel}
          className="hidden sm:flex"
        />

        <div className="flex shrink-0 items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={pending}
            className="hidden sm:inline-flex"
            onClick={onSaveDraft}
          >
            {pending ? savingLabel : saveDraftLabel}
          </Button>
          <Button
            type="button"
            size="sm"
            disabled={pending}
            className="min-w-28 gap-1.5"
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
      </div>
    </div>
  );
}
