'use client';

import { ChevronRightIcon, SendHorizontalIcon } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { BlogStatus } from '@/shared/types/blog';

import { AdminBlogDocumentStatus } from './admin-blog-document-status';

type AdminBlogEditorHeaderProps = {
  listHref: string;
  breadcrumbRoot: string;
  breadcrumbCurrent: string;
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
  breadcrumbRoot,
  breadcrumbCurrent,
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
    <header
      className={cn(
        'sticky top-0 z-30 flex h-12 shrink-0 items-center gap-3 border-b border-border/60 bg-background/80 px-4 backdrop-blur-md supports-backdrop-filter:bg-background/60 sm:px-6',
        className,
      )}
    >
      <nav
        className="flex min-w-0 flex-1 items-center gap-1.5 text-sm"
        aria-label={breadcrumbRoot}
      >
        <Link
          href={listHref}
          className="shrink-0 text-muted-foreground transition-colors hover:text-foreground"
        >
          {breadcrumbRoot}
        </Link>
        <ChevronRightIcon
          className="size-3.5 shrink-0 text-muted-foreground/70"
          aria-hidden
        />
        <span className="truncate font-medium text-foreground">
          {breadcrumbCurrent}
        </span>
      </nav>

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
    </header>
  );
}
