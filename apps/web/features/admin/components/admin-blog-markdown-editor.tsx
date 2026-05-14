'use client';

import dynamic from 'next/dynamic';
import { useMemo, useState, type SyntheticEvent } from 'react';

import { cn } from '@/lib/utils';

import '@uiw/react-md-editor/markdown-editor.css';

type PreviewMode = 'edit' | 'preview' | 'live';

export type AdminBlogEditorSelection = {
  start: number;
  end: number;
  text: string;
};

type AdminBlogMarkdownEditorProps = {
  value: string;
  onChange: (value: string) => void;
  labels: { write: string; preview: string; split: string };
  loadingLabel: string;
  onSelectionChange?: (selection: AdminBlogEditorSelection) => void;
  'aria-label'?: string;
};

const EDITOR_HEIGHT = 500;

export function AdminBlogMarkdownEditor({
  value,
  onChange,
  labels,
  loadingLabel,
  onSelectionChange,
  'aria-label': ariaLabel,
}: AdminBlogMarkdownEditorProps) {
  const [preview, setPreview] = useState<PreviewMode>('edit');

  const MDEditor = useMemo(
    () =>
      dynamic(() => import('@uiw/react-md-editor'), {
        ssr: false,
        loading: () => (
          <div className="flex min-h-[500px] items-center justify-center rounded-md border bg-muted/30 text-sm text-muted-foreground">
            {loadingLabel}
          </div>
        ),
      }),
    [loadingLabel],
  );

  function handleSelect(event: SyntheticEvent<HTMLTextAreaElement>) {
    if (!onSelectionChange) return;
    const target = event.currentTarget;
    const start = target.selectionStart ?? 0;
    const end = target.selectionEnd ?? 0;
    onSelectionChange({
      start,
      end,
      text: target.value.slice(start, end),
    });
  }

  return (
    <div
      data-color-mode="light"
      className="flex flex-col gap-2"
      aria-label={ariaLabel}
    >
      <div
        role="tablist"
        aria-label={ariaLabel}
        className="inline-flex w-fit gap-0.5 rounded-md border bg-muted/40 p-0.5"
      >
        {(
          [
            ['edit', labels.write] as const,
            ['preview', labels.preview] as const,
            ['live', labels.split] as const,
          ] as const
        ).map(([mode, label]) => (
          <button
            key={mode}
            type="button"
            role="tab"
            aria-selected={preview === mode}
            className={cn(
              'rounded px-3 py-1.5 text-xs font-medium transition-colors',
              preview === mode
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground',
            )}
            onClick={() => setPreview(mode)}
          >
            {label}
          </button>
        ))}
      </div>
      <MDEditor
        value={value}
        onChange={(v) => onChange(v ?? '')}
        preview={preview}
        height={EDITOR_HEIGHT}
        visibleDragbar={false}
        textareaProps={{
          onSelect: handleSelect,
          'aria-label': ariaLabel,
        }}
      />
    </div>
  );
}
