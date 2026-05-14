'use client';

import {
  META_DESCRIPTION_MAX,
  META_TITLE_MAX,
  deriveStoredSeo,
} from '@/features/admin-blogs/lib/blog-meta';
import { cn } from '@/lib/utils';

type AdminBlogSeoPreviewLabels = {
  hint: string;
  metaTitleLabel: string;
  metaDescriptionLabel: string;
};

type AdminBlogSeoPreviewProps = {
  title: string;
  content: string;
  labels: AdminBlogSeoPreviewLabels;
};

function meterClass(length: number, max: number): string {
  const ratio = max > 0 ? length / max : 0;
  if (ratio >= 1) return 'bg-destructive';
  if (ratio >= 0.9) return 'bg-amber-500 dark:bg-amber-400';
  return 'bg-primary';
}

export function AdminBlogSeoPreview({
  title,
  content,
  labels,
}: AdminBlogSeoPreviewProps) {
  const { metaTitle, metaDescription } = deriveStoredSeo(title, content);

  return (
    <div className="space-y-4">
      <p className="text-xs text-muted-foreground">{labels.hint}</p>

      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm font-medium">{labels.metaTitleLabel}</span>
          <span className="text-xs tabular-nums text-muted-foreground">
            {metaTitle.length}/{META_TITLE_MAX}
          </span>
        </div>
        <div className="h-1 overflow-hidden rounded-full bg-muted" aria-hidden>
          <div
            className={cn(
              'h-full rounded-full transition-all',
              meterClass(metaTitle.length, META_TITLE_MAX),
            )}
            style={{
              width: `${Math.min(100, (metaTitle.length / META_TITLE_MAX) * 100)}%`,
            }}
          />
        </div>
        <p className="rounded-md border bg-muted/30 px-3 py-2 text-sm leading-snug">
          {metaTitle || '—'}
        </p>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm font-medium">
            {labels.metaDescriptionLabel}
          </span>
          <span className="text-xs tabular-nums text-muted-foreground">
            {metaDescription.length}/{META_DESCRIPTION_MAX}
          </span>
        </div>
        <div className="h-1 overflow-hidden rounded-full bg-muted" aria-hidden>
          <div
            className={cn(
              'h-full rounded-full transition-all',
              meterClass(metaDescription.length, META_DESCRIPTION_MAX),
            )}
            style={{
              width: `${Math.min(100, (metaDescription.length / META_DESCRIPTION_MAX) * 100)}%`,
            }}
          />
        </div>
        <p className="min-h-[4.5rem] rounded-md border bg-muted/30 px-3 py-2 text-sm leading-relaxed whitespace-pre-wrap">
          {metaDescription || '—'}
        </p>
      </div>
    </div>
  );
}
