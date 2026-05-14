'use client';

import dynamic from 'next/dynamic';
import { ChevronDownIcon } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useMemo, useState, type SyntheticEvent } from 'react';

import '@uiw/react-md-editor/markdown-editor.css';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { AdminBlogStats } from './admin-blog-stats';

type PreviewMode = 'edit' | 'preview' | 'live';

export type AdminBlogEditorSelection = {
  start: number;
  end: number;
  text: string;
};

type EditorModeLabels = { write: string; preview: string; split: string };

type AdminBlogMarkdownEditorProps = {
  value: string;
  onChange: (value: string) => void;
  labels: EditorModeLabels;
  loadingLabel: string;
  chromeTitle: string;
  viewModeTriggerAria: string;
  stats: {
    wordsLabel: string;
    charactersLabel: string;
    readingTimeLabel: string;
    headingsLabel: string;
    minutesLabel: string;
  };
  onSelectionChange?: (selection: AdminBlogEditorSelection | null) => void;
  'aria-label'?: string;
};

const EDITOR_HEIGHT = 480;

export function AdminBlogMarkdownEditor({
  value,
  onChange,
  labels,
  loadingLabel,
  chromeTitle,
  viewModeTriggerAria,
  stats,
  onSelectionChange,
  'aria-label': ariaLabel,
}: AdminBlogMarkdownEditorProps) {
  const [preview, setPreview] = useState<PreviewMode>('edit');
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const colorMode =
    mounted && resolvedTheme === 'dark'
      ? ('dark' as const)
      : ('light' as const);

  const MDEditor = useMemo(
    () =>
      dynamic(() => import('@uiw/react-md-editor'), {
        ssr: false,
        loading: () => (
          <div className="flex min-h-[480px] items-center justify-center rounded-md border bg-muted/30 text-sm text-muted-foreground">
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

  const modeLabel =
    preview === 'edit'
      ? labels.write
      : preview === 'preview'
        ? labels.preview
        : labels.split;

  return (
    <Card className="gap-0 overflow-hidden py-0 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between gap-3 border-b px-4 py-3 sm:px-6">
        <CardTitle className="text-base font-semibold">{chromeTitle}</CardTitle>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="gap-1.5 font-normal"
              aria-label={viewModeTriggerAria}
            >
              {modeLabel}
              <ChevronDownIcon className="size-4 opacity-70" aria-hidden />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-[10rem]">
            <DropdownMenuItem onClick={() => setPreview('edit')}>
              {labels.write}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setPreview('preview')}>
              {labels.preview}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setPreview('live')}>
              {labels.split}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="space-y-0 px-0 pb-0">
        <div data-color-mode={colorMode} className="flex flex-col">
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
      </CardContent>
      <CardFooter className="flex flex-wrap items-center justify-between gap-3 border-t bg-muted/20 px-4 py-3 sm:px-6">
        <AdminBlogStats content={value} {...stats} />
      </CardFooter>
    </Card>
  );
}
