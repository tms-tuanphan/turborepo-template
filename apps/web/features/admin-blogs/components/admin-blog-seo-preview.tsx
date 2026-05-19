'use client';

import Image from 'next/image';

import { Input } from '@/components/ui/input';
import { KEYWORD_MAX_LENGTH } from '../lib/blog-seo-score';
import {
  META_DESCRIPTION_MAX,
  META_TITLE_MAX,
  deriveStoredSeo,
} from '../lib/blog-meta';
import { cn } from '@/lib/utils';

type AdminBlogSeoPreviewLabels = {
  hint: string;
  metaTitleLabel: string;
  metaDescriptionLabel: string;
  keywordLabel: string;
  keywordHint: string;
  googlePreviewTitle: string;
  socialPreviewTitle: string;
};

type AdminBlogSeoPreviewProps = {
  title: string;
  content: string;
  excerpt: string;
  slug: string;
  coverImage: string;
  keyword: string;
  onKeywordChange: (value: string) => void;
  siteHost?: string;
  labels: AdminBlogSeoPreviewLabels;
};

function meterClass(length: number, max: number): string {
  const ratio = max > 0 ? length / max : 0;
  if (ratio >= 1) return 'bg-destructive';
  if (ratio >= 0.9) return 'bg-amber-500 dark:bg-amber-400';
  return 'bg-primary';
}

function CharMeter({
  label,
  value,
  max,
  multiline = false,
}: {
  label: string;
  value: string;
  max: number;
  multiline?: boolean;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-medium">{label}</span>
        <span className="text-xs tabular-nums text-muted-foreground">
          {value.length}/{max}
        </span>
      </div>
      <div className="h-1 overflow-hidden rounded-full bg-muted" aria-hidden>
        <div
          className={cn(
            'h-full rounded-full transition-all',
            meterClass(value.length, max),
          )}
          style={{
            width: `${Math.min(100, (value.length / max) * 100)}%`,
          }}
        />
      </div>
      <p
        className={cn(
          'rounded-md border bg-muted/30 px-3 py-2 text-sm leading-snug',
          multiline && 'min-h-18 whitespace-pre-wrap leading-relaxed',
        )}
      >
        {value || '—'}
      </p>
    </div>
  );
}

export function AdminBlogSeoPreview({
  title,
  content,
  excerpt,
  slug,
  coverImage,
  keyword,
  onKeywordChange,
  siteHost = 'example.com',
  labels,
}: AdminBlogSeoPreviewProps) {
  const { metaTitle, metaDescription } = deriveStoredSeo(title, content);
  const displayDescription =
    excerpt.trim().length > 0 ? excerpt.trim() : metaDescription;
  const displayUrl = slug.trim()
    ? `${siteHost}/resources/blogs/${slug.trim()}`
    : `${siteHost}/resources/blogs/…`;

  return (
    <div className="space-y-5">
      <p className="text-xs text-muted-foreground">{labels.hint}</p>

      <CharMeter
        label={labels.metaTitleLabel}
        value={metaTitle}
        max={META_TITLE_MAX}
      />

      <CharMeter
        label={labels.metaDescriptionLabel}
        value={displayDescription}
        max={META_DESCRIPTION_MAX}
        multiline
      />

      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm font-medium">{labels.keywordLabel}</span>
          <span className="text-xs tabular-nums text-muted-foreground">
            {keyword.length}/{KEYWORD_MAX_LENGTH}
          </span>
        </div>
        <Input
          value={keyword}
          onChange={(e) =>
            onKeywordChange(e.target.value.slice(0, KEYWORD_MAX_LENGTH))
          }
          placeholder={labels.keywordHint}
          aria-label={labels.keywordLabel}
          className="text-sm"
        />
        <p className="text-xs text-muted-foreground">{labels.keywordHint}</p>
      </div>

      <div className="space-y-2">
        <span className="text-sm font-medium">{labels.googlePreviewTitle}</span>
        <div className="rounded-lg border bg-background p-4 shadow-sm">
          <p className="truncate text-xs text-muted-foreground">{displayUrl}</p>
          <p className="mt-1 line-clamp-1 text-base font-medium text-[#1a0dab] dark:text-[#8ab4f8]">
            {metaTitle || title || '—'}
          </p>
          <p className="mt-0.5 line-clamp-2 text-sm leading-snug text-muted-foreground">
            {displayDescription || '—'}
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <span className="text-sm font-medium">{labels.socialPreviewTitle}</span>
        <div className="overflow-hidden rounded-lg border bg-muted/20 shadow-sm">
          {coverImage ? (
            <div className="relative aspect-[1.91/1] w-full bg-muted">
              <Image
                src={coverImage}
                alt=""
                fill
                className="object-cover"
                sizes="320px"
                unoptimized
              />
            </div>
          ) : (
            <div className="flex aspect-[1.91/1] items-center justify-center bg-muted text-xs text-muted-foreground">
              {labels.socialPreviewTitle}
            </div>
          )}
          <div className="space-y-0.5 border-t bg-background px-3 py-2.5">
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
              {siteHost}
            </p>
            <p className="line-clamp-2 text-sm font-semibold leading-snug">
              {metaTitle || title || '—'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
