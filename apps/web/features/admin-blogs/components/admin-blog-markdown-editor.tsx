'use client';

import type { MDXEditorMethods } from '@mdxeditor/editor';
import {
  ChevronDownIcon,
  Code2Icon,
  FilePenLineIcon,
  ImageIcon,
  LightbulbIcon,
  MessageSquareQuoteIcon,
  SparklesIcon,
  TableIcon,
} from 'lucide-react';
import dynamic from 'next/dynamic';
import { useCallback, useMemo, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import type { AdminBlogMdxEditorLoadedLabels } from './admin-blog-mdx-editor-loaded';
import { AdminBlogStats } from './admin-blog-stats';

function isEditorSurfaceEmpty(markdown: string): boolean {
  const lines = markdown
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);
  if (lines.length === 0) return true;
  return lines.every((l) => /^#{1,6}\s*$/.test(l));
}

type StatsLabels = {
  wordsLabel: string;
  charactersLabel: string;
  readingTimeLabel: string;
  headingsLabel: string;
  minutesLabel: string;
};

type AdminBlogMarkdownEditorProps = {
  children?: React.ReactNode;
  editorRef: React.RefObject<MDXEditorMethods | null>;
  title: string;
  onTitleChange: (value: string) => void;
  onTitleBlur: () => void;
  titleLabel: string;
  titlePlaceholder: string;
  titleInputId: string;
  titleError?: string;
  titleErrorId?: string;
  value: string;
  onChange: (value: string) => void;
  loadingLabel: string;
  stats: StatsLabels;
  editorLabels: AdminBlogMdxEditorLoadedLabels;
  contentPlaceholder: string;
  'aria-label'?: string;
};

export function AdminBlogMarkdownEditor({
  children,
  editorRef,
  title,
  onTitleChange,
  onTitleBlur,
  titleLabel,
  titlePlaceholder,
  titleInputId,
  titleError,
  titleErrorId,
  value,
  onChange,
  loadingLabel,
  stats,
  editorLabels,
  contentPlaceholder,
  'aria-label': ariaLabel,
}: AdminBlogMarkdownEditorProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const MdxLazy = useMemo(
    () =>
      dynamic(() => import('./admin-blog-mdx-editor-loaded'), {
        ssr: false,
        loading: () => (
          <div className="flex min-h-[min(28rem,50vh)] items-center justify-center text-sm text-muted-foreground">
            {loadingLabel}
          </div>
        ),
      }),
    [loadingLabel],
  );

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen((prev) => !prev);
  }, []);

  const showEmptyOverlay = isEditorSurfaceEmpty(value);

  const insertFromEmpty = useCallback(
    (snippet: string) => {
      const ed = editorRef.current;
      if (!ed) return;
      ed.focus();
      ed.insertMarkdown(snippet);
    },
    [editorRef],
  );

  const loadedLabels = useMemo(
    (): AdminBlogMdxEditorLoadedLabels => ({
      ...editorLabels,
      titleLabel,
      titlePlaceholder,
      contentAriaLabel: ariaLabel ?? editorLabels.contentAriaLabel,
    }),
    [editorLabels, titleLabel, titlePlaceholder, ariaLabel],
  );

  const cardClass = isFullscreen
    ? 'fixed inset-0 z-50 flex flex-col overflow-hidden rounded-none border shadow-lg'
    : 'gap-0 overflow-hidden border border-border/80 py-0 shadow-sm';

  return (
    <Card className={cardClass}>
      <CardContent className="relative flex min-h-0 flex-1 flex-col px-0 pb-0">
        <div className="relative min-h-[min(28rem,50vh)] flex-1">
          <MdxLazy
            editorRef={editorRef}
            markdown={value}
            onChange={onChange}
            title={title}
            onTitleChange={onTitleChange}
            onTitleBlur={onTitleBlur}
            titleInputId={titleInputId}
            titleInvalid={Boolean(titleError)}
            titleError={titleError}
            titleErrorId={titleErrorId}
            labels={loadedLabels}
            isFullscreen={isFullscreen}
            onToggleFullscreen={toggleFullscreen}
            placeholder={contentPlaceholder}
            contentEditableClassName="border-0 bg-transparent px-4 pb-4 pt-2 sm:px-6"
          />
          {showEmptyOverlay ? (
            <div
              className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center gap-5 bg-background/75 px-6 text-center backdrop-blur-[2px]"
              aria-hidden
            >
              <div className="relative">
                <SparklesIcon
                  className="absolute -left-8 -top-3 size-4 text-primary/50"
                  aria-hidden
                />
                <SparklesIcon
                  className="absolute -right-6 top-1 size-3 text-primary/40"
                  aria-hidden
                />
                <SparklesIcon
                  className="absolute -bottom-2 -left-5 size-3 text-primary/35"
                  aria-hidden
                />
                <div className="rounded-2xl bg-primary/15 p-4 text-primary shadow-sm ring-1 ring-primary/20">
                  <FilePenLineIcon className="size-10" strokeWidth={1.35} />
                </div>
              </div>
              <div className="max-w-lg space-y-1.5">
                <p className="text-base font-semibold tracking-tight text-foreground">
                  {editorLabels.emptyTitle}
                </p>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {editorLabels.emptyHint}
                </p>
              </div>
              <div className="pointer-events-auto flex flex-wrap items-center justify-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="gap-2 rounded-md border-border bg-background shadow-sm"
                  onClick={() => insertFromEmpty('\n\n## ')}
                >
                  <span
                    className="flex h-6 min-w-6 items-center justify-center rounded border border-current px-1 font-mono text-xs font-semibold leading-none"
                    aria-hidden
                  >
                    H
                  </span>
                  {editorLabels.quickHeading}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="gap-2 rounded-md border-border bg-background font-mono text-xs shadow-sm"
                  onClick={() => insertFromEmpty('\n\n```plaintext\n\n```\n')}
                >
                  <Code2Icon className="size-4" aria-hidden />
                  {editorLabels.quickCode}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="gap-2 rounded-md border-border bg-background shadow-sm"
                  onClick={() => insertFromEmpty('\n\n![]()\n')}
                >
                  <ImageIcon className="size-4" aria-hidden />
                  {editorLabels.quickImage}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="gap-2 rounded-md border-border bg-background shadow-sm"
                  onClick={() => insertFromEmpty('\n\n> \n')}
                >
                  <MessageSquareQuoteIcon className="size-4" aria-hidden />
                  {editorLabels.quickQuote}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="gap-2 rounded-md border-border bg-background shadow-sm"
                  onClick={() =>
                    insertFromEmpty(
                      '\n\n| Col1 | Col2 |\n| --- | --- |\n|  |  |\n',
                    )
                  }
                >
                  <TableIcon className="size-4" aria-hidden />
                  {editorLabels.quickTable}
                </Button>
              </div>
              <p className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                <LightbulbIcon className="size-3.5 shrink-0" aria-hidden />
                {editorLabels.slashTip}
              </p>
            </div>
          ) : null}
          {children}
        </div>
      </CardContent>
      <CardFooter className="flex flex-wrap items-center justify-between gap-3 border-t border-border/80 bg-muted/15 px-4 py-2.5 sm:px-6">
        <AdminBlogStats content={value} {...stats} />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="min-w-30 justify-between gap-1.5 font-normal"
            >
              {editorLabels.formatMarkdown}
              <ChevronDownIcon className="size-4 opacity-70" aria-hidden />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-40">
            <DropdownMenuItem disabled>
              {editorLabels.formatMarkdown}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardFooter>
    </Card>
  );
}
