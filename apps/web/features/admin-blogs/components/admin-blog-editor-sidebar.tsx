'use client';

import Image from 'next/image';
import { ImagePlusIcon, PencilIcon, Trash2Icon } from 'lucide-react';
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
import type { Messages } from '@/shared/i18n';

import { AdminBlogSeoPreview } from './admin-blog-seo-preview';

const COVER_MAX_FILE_BYTES = 2 * 1024 * 1024;
const ACCEPT_INPUT = 'image/jpeg,image/png,image/webp,image/gif';
const ACCEPT_MIME = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
]);

type BlogFormMessages = Messages['admin']['blogs']['form'];
type CategoryMessages = Messages['blogs']['categories'];

type AdminBlogEditorSidebarProps = {
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
  statusLabel: string;
  statusDisplayKey: BlogStatus;
  slugError?: string;
  coverError?: string;
};

export function AdminBlogEditorSidebar({
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
  statusLabel,
  statusDisplayKey,
  slugError,
  coverError,
}: AdminBlogEditorSidebarProps) {
  const statusText = messages.sidebar.statusLabels[statusDisplayKey];
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [clientCoverError, setClientCoverError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const coverMessage = coverError ?? clientCoverError;

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
    if (file) {
      processFile(file);
    }
    e.target.value = '';
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  }

  function onDragOver(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
  }

  function onRemoveCover() {
    setClientCoverError(null);
    onCoverImageChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
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
        <Tabs defaultValue="publish" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="publish">{messages.tabs.publish}</TabsTrigger>
            <TabsTrigger value="seo">{messages.tabs.seo}</TabsTrigger>
          </TabsList>
          <TabsContent value="publish" className="mt-3 space-y-4">
            <div className="space-y-2">
              <span className="text-sm font-medium">{statusLabel}</span>
              <div className="flex items-center gap-2">
                <span
                  className="size-2 shrink-0 rounded-full bg-amber-500"
                  aria-hidden
                />
                <Badge variant="secondary" className="font-normal">
                  {statusText}
                </Badge>
              </div>
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
              <span className="text-sm font-medium" id="cover-label-sidebar">
                {messages.featuredImageLabel}
              </span>
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
                <input
                  ref={fileInputRef}
                  id={coverUploadId}
                  type="file"
                  accept={ACCEPT_INPUT}
                  className="sr-only"
                  onChange={onFileInputChange}
                  aria-labelledby="cover-label-sidebar"
                  aria-describedby={[
                    'cover-hint-sidebar',
                    coverMessage ? 'cover-error-sidebar' : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                />
                <div className="flex flex-col items-center gap-3 text-center sm:flex-row sm:text-left">
                  <div
                    className="flex size-10 shrink-0 items-center justify-center rounded-md border bg-background text-muted-foreground"
                    aria-hidden
                  >
                    <ImagePlusIcon className="size-5" />
                  </div>
                  <div className="min-w-0 flex-1 space-y-1">
                    <p className="text-sm text-foreground">
                      {messages.featuredImageUploadPrompt}
                    </p>
                    <p
                      id="cover-hint-sidebar"
                      className="text-xs text-muted-foreground"
                    >
                      {messages.featuredImageHint}
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    className="shrink-0"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {coverImage
                      ? messages.featuredImageReplace
                      : messages.featuredImageChooseFile}
                  </Button>
                </div>
              </div>
              {coverMessage ? (
                <p
                  id="cover-error-sidebar"
                  className="text-sm text-destructive"
                  role="alert"
                >
                  {coverMessage}
                </p>
              ) : null}
              {coverImage ? (
                <div className="space-y-2">
                  <div className="relative aspect-video w-full max-h-40 overflow-hidden rounded-md border">
                    <Image
                      src={coverImage}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="320px"
                      unoptimized
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="w-full gap-2 sm:w-auto"
                    onClick={onRemoveCover}
                  >
                    <Trash2Icon className="size-4" aria-hidden />
                    {messages.featuredImageRemove}
                  </Button>
                </div>
              ) : null}
            </div>

            <div className="space-y-2">
              <span className="text-sm font-medium">{messages.slugLabel}</span>
              <div className="relative">
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
          </TabsContent>
          <TabsContent value="seo" className="mt-3">
            <AdminBlogSeoPreview
              title={title}
              content={content}
              labels={messages.seoPreview}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
