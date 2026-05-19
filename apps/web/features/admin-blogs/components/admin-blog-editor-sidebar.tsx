'use client';

import Image from 'next/image';
import {
  CopyIcon,
  ExternalLinkIcon,
  ImagePlusIcon,
  PencilIcon,
  PlusIcon,
  Trash2Icon,
  XIcon,
} from 'lucide-react';
import Link from 'next/link';
import { useCallback, useRef, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import {
  BLOG_CATEGORIES,
  type BlogCategory,
  type BlogStatus,
} from '@/shared/types/blog';
import type { Locale, Messages } from '@/shared/i18n';

import { AdminBlogSeoPreview } from './admin-blog-seo-preview';

const COVER_MAX_FILE_BYTES = 2 * 1024 * 1024;
const ACCEPT_INPUT = 'image/jpeg,image/png,image/webp,image/gif';
const ACCEPT_MIME = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
]);

const SIDEBAR_STATUSES: BlogStatus[] = [
  'DRAFT',
  'REVIEWING',
  'SCHEDULED',
  'PUBLISHED',
  'ARCHIVED',
];

type BlogFormMessages = Messages['admin']['blogs']['form'];
type CategoryMessages = Messages['blogs']['categories'];
type PublishMode = 'now' | 'scheduled';

type AdminBlogEditorSidebarProps = {
  locale: Locale;
  messages: BlogFormMessages;
  categoryMessages: CategoryMessages;
  category: BlogCategory;
  onCategoryChange: (value: BlogCategory) => void;
  coverImage: string;
  onCoverImageChange: (value: string) => void;
  slug: string;
  onSlugChange: (value: string) => void;
  title: string;
  content: string;
  excerpt: string;
  tags: string[];
  onTagsChange: (tags: string[]) => void;
  status: BlogStatus;
  onStatusChange: (status: BlogStatus) => void;
  publishMode: PublishMode;
  onPublishModeChange: (mode: PublishMode) => void;
  scheduleDate: string;
  onScheduleDateChange: (value: string) => void;
  keyword: string;
  onKeywordChange: (value: string) => void;
  slugError?: string;
  coverError?: string;
};

function TagInput({
  tags,
  onTagsChange,
  placeholder,
  hint,
}: {
  tags: string[];
  onTagsChange: (tags: string[]) => void;
  placeholder: string;
  hint: string;
}) {
  const [draft, setDraft] = useState('');

  function addTag(raw: string) {
    const next = raw
      .split(/[,;]/)
      .map((t) => t.trim())
      .filter(Boolean);
    if (next.length === 0) return;
    const merged = [...tags];
    for (const t of next) {
      if (!merged.includes(t) && merged.length < 20) merged.push(t);
    }
    onTagsChange(merged);
    setDraft('');
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(draft);
    }
    if (e.key === 'Backspace' && draft === '' && tags.length > 0) {
      onTagsChange(tags.slice(0, -1));
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1.5">
        {tags.map((tag) => (
          <Badge
            key={tag}
            variant="secondary"
            className="gap-1 bg-primary/10 text-primary hover:bg-primary/15"
          >
            {tag}
            <button
              type="button"
              className="rounded-sm hover:bg-primary/20"
              onClick={() => onTagsChange(tags.filter((t) => t !== tag))}
              aria-label={`Remove ${tag}`}
            >
              <XIcon className="size-3" aria-hidden />
            </button>
          </Badge>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-7 gap-1 border-dashed px-2 text-xs"
          onClick={() => {
            const el = document.getElementById('blog-tag-input');
            el?.focus();
          }}
        >
          <PlusIcon className="size-3" aria-hidden />
          {placeholder}
        </Button>
      </div>
      <Input
        id="blog-tag-input"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={onKeyDown}
        onBlur={() => {
          if (draft.trim()) addTag(draft);
        }}
        placeholder={placeholder}
        className="text-sm"
        aria-describedby="tags-hint-sidebar"
      />
      <p id="tags-hint-sidebar" className="text-xs text-muted-foreground">
        {hint}
      </p>
    </div>
  );
}

export function AdminBlogEditorSidebar({
  locale,
  messages,
  categoryMessages,
  category,
  onCategoryChange,
  coverImage,
  onCoverImageChange,
  slug,
  onSlugChange,
  title,
  content,
  excerpt,
  tags,
  onTagsChange,
  status,
  onStatusChange,
  publishMode,
  onPublishModeChange,
  scheduleDate,
  onScheduleDateChange,
  keyword,
  onKeywordChange,
  slugError,
  coverError,
}: AdminBlogEditorSidebarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [clientCoverError, setClientCoverError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [slugCopied, setSlugCopied] = useState(false);

  const coverMessage = coverError ?? clientCoverError;
  const previewHref =
    slug.trim().length > 0
      ? `/${locale}/resources/blogs/${slug.trim()}`
      : undefined;

  const processFile = useCallback(
    (file: File) => {
      if (!ACCEPT_MIME.has(file.type)) {
        setClientCoverError(messages.featuredImageInvalidType);
        return;
      }
      if (file.size > COVER_MAX_FILE_BYTES) {
        setClientCoverError(messages.featuredImageTooLarge);
        return;
      }
      setClientCoverError(null);
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result;
        if (typeof result === 'string') {
          onCoverImageChange(result);
        }
      };
      reader.readAsDataURL(file);
    },
    [
      messages.featuredImageInvalidType,
      messages.featuredImageTooLarge,
      onCoverImageChange,
    ],
  );

  function onFileInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) processFile(file);
    e.target.value = '';
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  }

  function onDragOver(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
  }

  function onRemoveCover() {
    setClientCoverError(null);
    onCoverImageChange('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  async function copySlug() {
    if (!slug.trim()) return;
    try {
      await navigator.clipboard.writeText(slug.trim());
      setSlugCopied(true);
      window.setTimeout(() => setSlugCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  }

  const coverUploadId = 'blog-cover-upload';

  return (
    <Card className="h-fit gap-3 py-4 lg:sticky lg:top-24">
      <CardHeader className="pb-1 pt-0">
        <CardTitle className="text-base">
          {messages.sidebar.cardTitle}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <input type="hidden" name="coverImage" value={coverImage} />
        <input type="hidden" name="tags" value={tags.join(', ')} />
        <input type="hidden" name="scheduledAt" value={scheduleDate} />
        <input type="hidden" name="primaryKeyword" value={keyword} />

        <Tabs defaultValue="publish" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="publish">{messages.tabs.publish}</TabsTrigger>
            <TabsTrigger value="seo">{messages.tabs.seo}</TabsTrigger>
          </TabsList>

          <TabsContent value="publish" className="mt-3 space-y-4">
            <div className="space-y-2">
              <span className="text-sm font-medium">
                {messages.sidebar.statusLabel}
              </span>
              <Select
                value={status}
                onValueChange={(v) => onStatusChange(v as BlogStatus)}
              >
                <SelectTrigger aria-label={messages.sidebar.statusChangeLabel}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SIDEBAR_STATUSES.map((s) => (
                    <SelectItem key={s} value={s}>
                      <span className="flex items-center gap-2">
                        <span
                          className={cn(
                            'size-2 shrink-0 rounded-full',
                            s === 'PUBLISHED' && 'bg-emerald-500',
                            s === 'DRAFT' && 'bg-amber-500',
                            s === 'REVIEWING' && 'bg-sky-500',
                            s === 'SCHEDULED' && 'bg-violet-500',
                            s === 'ARCHIVED' && 'bg-zinc-400',
                          )}
                          aria-hidden
                        />
                        {messages.sidebar.statusLabels[s]}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <span className="text-sm font-medium">
                {messages.categoryLabel}
              </span>
              <Select
                value={category}
                onValueChange={(v) => onCategoryChange(v as BlogCategory)}
              >
                <SelectTrigger aria-label={messages.categoryLabel}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {BLOG_CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {categoryMessages[c]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <span className="text-sm font-medium">{messages.tagsLabel}</span>
              <TagInput
                tags={tags}
                onTagsChange={onTagsChange}
                placeholder={messages.tagsPlaceholder}
                hint={messages.tagsHint}
              />
            </div>

            <div className="space-y-2">
              <span className="text-sm font-medium" id="cover-label-sidebar">
                {messages.featuredImageLabel}
              </span>
              {coverImage ? (
                <div className="space-y-2">
                  <div className="relative aspect-video w-full overflow-hidden rounded-md border">
                    <Image
                      src={coverImage}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="320px"
                      unoptimized
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      {messages.featuredImageReplace}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon-sm"
                      onClick={onRemoveCover}
                      aria-label={messages.featuredImageRemove}
                    >
                      <Trash2Icon className="size-4" aria-hidden />
                    </Button>
                  </div>
                </div>
              ) : (
                <div
                  className={cn(
                    'rounded-lg border border-dashed border-border bg-muted/20 p-4 transition-colors',
                    isDragging && 'border-primary bg-muted/40',
                    !isDragging && 'hover:bg-muted/30',
                  )}
                  onDragEnter={(e) => {
                    onDragOver(e);
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDragOver={onDragOver}
                  onDrop={onDrop}
                >
                  <div className="flex flex-col items-center gap-3 text-center">
                    <ImagePlusIcon
                      className="size-8 text-muted-foreground"
                      aria-hidden
                    />
                    <p className="text-sm text-foreground">
                      {messages.featuredImageUploadPrompt}
                    </p>
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      {messages.featuredImageChooseFile}
                    </Button>
                  </div>
                </div>
              )}
              <input
                ref={fileInputRef}
                id={coverUploadId}
                type="file"
                accept={ACCEPT_INPUT}
                className="sr-only"
                onChange={onFileInputChange}
                aria-labelledby="cover-label-sidebar"
              />
              {coverMessage ? (
                <p className="text-sm text-destructive" role="alert">
                  {coverMessage}
                </p>
              ) : null}
            </div>

            <div className="space-y-2">
              <span className="text-sm font-medium">{messages.slugLabel}</span>
              <div className="relative flex gap-2">
                <div className="relative min-w-0 flex-1">
                  <Input
                    id="blog-slug-sidebar"
                    name="slug"
                    value={slug}
                    onChange={(e) => onSlugChange(e.target.value)}
                    className="font-mono text-sm pr-10"
                    aria-invalid={Boolean(slugError)}
                    aria-describedby={
                      slugError ? 'err-slug-sidebar' : 'slug-hint-sidebar'
                    }
                  />
                  <PencilIcon
                    className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground"
                    aria-hidden
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => void copySlug()}
                  aria-label={messages.slugCopy}
                  title={slugCopied ? messages.slugCopied : messages.slugCopy}
                >
                  <CopyIcon className="size-4" aria-hidden />
                </Button>
              </div>
              {slugCopied ? (
                <p className="text-xs text-emerald-600" role="status">
                  {messages.slugCopied}
                </p>
              ) : null}
              <p
                id="slug-hint-sidebar"
                className="text-xs text-muted-foreground"
              >
                {messages.slugHint}
              </p>
              {slugError ? (
                <p
                  id="err-slug-sidebar"
                  className="text-sm text-destructive"
                  role="alert"
                >
                  {slugError}
                </p>
              ) : null}
            </div>

            <fieldset className="space-y-3">
              <legend className="text-sm font-medium">
                {messages.scheduleLabel}
              </legend>
              <label className="flex cursor-pointer items-center gap-2 text-sm">
                <input
                  type="radio"
                  name="publishModeUi"
                  className="size-4 accent-primary"
                  checked={publishMode === 'now'}
                  onChange={() => onPublishModeChange('now')}
                />
                {messages.scheduleNow}
              </label>
              <label className="flex cursor-pointer items-center gap-2 text-sm">
                <input
                  type="radio"
                  name="publishModeUi"
                  className="size-4 accent-primary"
                  checked={publishMode === 'scheduled'}
                  onChange={() => {
                    onPublishModeChange('scheduled');
                    onStatusChange('SCHEDULED');
                  }}
                />
                {messages.scheduleLater}
              </label>
              {publishMode === 'scheduled' ? (
                <div className="space-y-1.5 ps-6">
                  <span className="text-xs text-muted-foreground">
                    {messages.scheduleDateLabel}
                  </span>
                  <Input
                    type="datetime-local"
                    value={scheduleDate}
                    onChange={(e) => onScheduleDateChange(e.target.value)}
                    className="text-sm"
                    aria-label={messages.scheduleDateLabel}
                  />
                </div>
              ) : null}
            </fieldset>

            {previewHref ? (
              <Button
                type="button"
                variant="outline"
                className="w-full gap-2"
                asChild
              >
                <Link
                  href={previewHref}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {messages.previewButton}
                  <ExternalLinkIcon className="size-4" aria-hidden />
                </Link>
              </Button>
            ) : (
              <Button
                type="button"
                variant="outline"
                className="w-full gap-2"
                disabled
              >
                {messages.previewButton}
                <ExternalLinkIcon className="size-4" aria-hidden />
              </Button>
            )}
          </TabsContent>

          <TabsContent value="seo" className="mt-3">
            <AdminBlogSeoPreview
              title={title}
              content={content}
              excerpt={excerpt}
              slug={slug}
              coverImage={coverImage}
              keyword={keyword}
              onKeywordChange={onKeywordChange}
              labels={messages.seoPreview}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
