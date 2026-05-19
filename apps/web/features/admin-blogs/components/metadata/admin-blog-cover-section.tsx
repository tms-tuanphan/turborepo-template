'use client';

import Image from 'next/image';
import { ImagePlusIcon, Trash2Icon } from 'lucide-react';
import { useCallback, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const COVER_MAX_FILE_BYTES = 5 * 1024 * 1024;
const ACCEPT_INPUT = 'image/jpeg,image/png,image/webp';
const ACCEPT_MIME = new Set(['image/jpeg', 'image/png', 'image/webp']);

type AdminBlogCoverSectionProps = {
  coverImage: string;
  onCoverImageChange: (value: string) => void;
  featuredImageLabel: string;
  featuredImageUploadPrompt: string;
  featuredImageChooseFile: string;
  featuredImageReplace: string;
  featuredImageRemove: string;
  featuredImageInvalidType: string;
  featuredImageTooLarge: string;
  coverError?: string;
};

export function AdminBlogCoverSection({
  coverImage,
  onCoverImageChange,
  featuredImageLabel,
  featuredImageUploadPrompt,
  featuredImageChooseFile,
  featuredImageReplace,
  featuredImageRemove,
  featuredImageInvalidType,
  featuredImageTooLarge,
  coverError,
}: AdminBlogCoverSectionProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [clientCoverError, setClientCoverError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const coverMessage = coverError ?? clientCoverError;

  const processFile = useCallback(
    (file: File) => {
      if (!ACCEPT_MIME.has(file.type)) {
        setClientCoverError(featuredImageInvalidType);
        return;
      }
      if (file.size > COVER_MAX_FILE_BYTES) {
        setClientCoverError(featuredImageTooLarge);
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
    [featuredImageInvalidType, featuredImageTooLarge, onCoverImageChange],
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

  return (
    <section className="space-y-2">
      <span className="text-sm font-medium" id="cover-label-sidebar">
        {featuredImageLabel}
      </span>
      {coverImage ? (
        <div className="space-y-2">
          <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-border/40 bg-muted">
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
              {featuredImageReplace}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon-sm"
              onClick={onRemoveCover}
              aria-label={featuredImageRemove}
            >
              <Trash2Icon className="size-4" aria-hidden />
            </Button>
          </div>
        </div>
      ) : (
        <div
          className={cn(
            'rounded-2xl border border-dashed border-border/60 bg-muted/20 p-6 transition-colors',
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
              className="size-10 text-muted-foreground"
              aria-hidden
            />
            <p className="text-sm text-foreground">
              {featuredImageUploadPrompt}
            </p>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
            >
              {featuredImageChooseFile}
            </Button>
          </div>
        </div>
      )}
      <input
        ref={fileInputRef}
        id="blog-cover-upload"
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
    </section>
  );
}
