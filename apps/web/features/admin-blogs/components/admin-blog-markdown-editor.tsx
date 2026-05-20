'use client';

import type { MDXEditorMethods } from '@mdxeditor/editor';
import dynamic from 'next/dynamic';
import { useCallback, useMemo, useState } from 'react';

import { cn } from '@/lib/utils';

import { editorPanelClass } from './editor/editor-panel-styles';
import type { AdminBlogMdxEditorLoadedLabels } from './admin-blog-mdx-editor-loaded';
import { AdminBlogEditorEmptyState } from './editor/admin-blog-editor-empty-state';
import { AdminBlogEditorTitleBlock } from './editor/admin-blog-editor-title-block';
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

type EmptyStateLabels = {
  quickTitle: string;
  quickSlash: string;
  quickOutline: string;
  quickCode: string;
  slashTip: string;
};

type AdminBlogMarkdownEditorProps = {
  toolbarExtra?: React.ReactNode;
  editorRef: React.RefObject<MDXEditorMethods | null>;
  title: string;
  onTitleChange: (value: string) => void;
  onTitleBlur: () => void;
  titleLabel: string;
  titlePlaceholder: string;
  excerptLabel: string;
  excerptPlaceholder: string;
  titleInputId: string;
  titleError?: string;
  titleErrorId?: string;
  excerpt: string;
  onExcerptChange: (value: string) => void;
  value: string;
  onChange: (value: string) => void;
  loadingLabel: string;
  stats: StatsLabels;
  editorLabels: AdminBlogMdxEditorLoadedLabels & EmptyStateLabels;
  contentPlaceholder: string;
  onOutlineRequest?: () => void;
  'aria-label'?: string;
};

export function AdminBlogMarkdownEditor({
  toolbarExtra,
  editorRef,
  title,
  onTitleChange,
  onTitleBlur,
  titleLabel,
  titlePlaceholder,
  excerptLabel,
  excerptPlaceholder,
  titleInputId,
  titleError,
  titleErrorId,
  excerpt,
  onExcerptChange,
  value,
  onChange,
  loadingLabel,
  stats,
  editorLabels,
  contentPlaceholder,
  onOutlineRequest,
}: AdminBlogMarkdownEditorProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const MdxLazy = useMemo(
    () =>
      dynamic(() => import('./admin-blog-mdx-editor-loaded'), {
        ssr: false,
        loading: () => (
          <div className="flex min-h-[min(20rem,55vh)] items-center justify-center text-sm text-muted-foreground">
            {loadingLabel}
          </div>
        ),
      }),
    [loadingLabel],
  );

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen((prev) => !prev);
  }, []);

  const showEmptyState = isEditorSurfaceEmpty(value);

  const surfaceClass = isFullscreen
    ? 'fixed inset-0 z-50 flex flex-col overflow-hidden rounded-none bg-background'
    : cn(editorPanelClass, 'flex flex-col overflow-hidden');

  return (
    <section
      className={surfaceClass}
      aria-label={editorLabels.contentAriaLabel}
    >
      <AdminBlogEditorTitleBlock
        title={title}
        onTitleChange={onTitleChange}
        onTitleBlur={onTitleBlur}
        titleInputId={titleInputId}
        titleLabel={titleLabel}
        titlePlaceholder={titlePlaceholder}
        titleError={titleError}
        titleErrorId={titleErrorId}
        excerpt={excerpt}
        onExcerptChange={onExcerptChange}
        excerptLabel={excerptLabel}
        excerptPlaceholder={excerptPlaceholder}
      />
      <div className="relative min-h-[min(20rem,55vh)] w-full min-w-0 flex-1">
        <MdxLazy
          editorRef={editorRef}
          markdown={value}
          onChange={onChange}
          labels={editorLabels}
          isFullscreen={isFullscreen}
          onToggleFullscreen={toggleFullscreen}
          placeholder={contentPlaceholder}
          contentEditableClassName="border-0 bg-transparent px-5 sm:px-6"
          toolbarExtra={toolbarExtra}
        />
      </div>
      {showEmptyState ? (
        <AdminBlogEditorEmptyState
          editorRef={editorRef}
          onOutline={onOutlineRequest}
          labels={{
            quickTitle: editorLabels.quickTitle,
            quickSlash: editorLabels.quickSlash,
            quickOutline: editorLabels.quickOutline,
            quickCode: editorLabels.quickCode,
            slashTip: editorLabels.slashTip,
          }}
        />
      ) : null}
      <footer
        className={cn(
          'flex flex-wrap items-center justify-between gap-2 border-t border-primary/15 px-5 py-2.5 text-xs text-muted-foreground sm:px-6',
          isFullscreen && 'bg-background',
        )}
      >
        <AdminBlogStats content={value} {...stats} />
      </footer>
    </section>
  );
}
