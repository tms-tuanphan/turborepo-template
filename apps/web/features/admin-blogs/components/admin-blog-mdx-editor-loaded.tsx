'use client';

import '@mdxeditor/editor/style.css';

import type { MDXEditorMethods, MDXEditorProps } from '@mdxeditor/editor';
import {
  MDXEditor,
  codeBlockPlugin,
  codeMirrorPlugin,
  headingsPlugin,
  imagePlugin,
  linkDialogPlugin,
  linkPlugin,
  listsPlugin,
  markdownShortcutPlugin,
  quotePlugin,
  tablePlugin,
  thematicBreakPlugin,
  toolbarPlugin,
} from '@mdxeditor/editor';
import { useTheme } from 'next-themes';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { AdminBlogEditorToolbar } from './editor/admin-blog-editor-toolbar';

export type AdminBlogMdxEditorLoadedLabels = {
  contentAriaLabel: string;
  slashTip: string;
  toolbarBlockquote: string;
  toolbarAriaLabel: string;
  fullscreenEnter: string;
  fullscreenExit: string;
};

type AdminBlogMdxEditorLoadedProps = {
  editorRef: React.RefObject<MDXEditorMethods | null>;
  markdown: string;
  onChange: (markdown: string) => void;
  labels: AdminBlogMdxEditorLoadedLabels;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  placeholder: string;
  contentEditableClassName?: string;
  toolbarExtra?: React.ReactNode;
};

const CODE_LANGUAGES: Record<string, string> = {
  plaintext: 'Plain text',
  js: 'JavaScript',
  ts: 'TypeScript',
  tsx: 'TypeScript (React)',
  jsx: 'JavaScript (React)',
  css: 'CSS',
  json: 'JSON',
  md: 'Markdown',
};

export default function AdminBlogMdxEditorLoaded({
  editorRef,
  markdown,
  onChange,
  labels,
  isFullscreen,
  onToggleFullscreen,
  placeholder,
  contentEditableClassName,
  toolbarExtra,
}: AdminBlogMdxEditorLoadedProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const lastEmitted = useRef<string>(markdown);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (markdown !== lastEmitted.current) {
      editorRef.current?.setMarkdown(markdown);
      lastEmitted.current = markdown;
    }
  }, [markdown, editorRef]);

  const handleChange = useCallback(
    (next: string) => {
      lastEmitted.current = next;
      onChange(next);
    },
    [onChange],
  );

  const editorClassName = useMemo(
    () =>
      'prose prose-neutral max-w-none dark:prose-invert min-h-[min(20rem,55vh)] text-[17px] leading-[1.75] prose-pre:rounded-xl prose-pre:bg-muted/50',
    [],
  );

  const plugins = useMemo(
    () => [
      headingsPlugin(),
      listsPlugin(),
      quotePlugin(),
      thematicBreakPlugin(),
      markdownShortcutPlugin(),
      linkPlugin(),
      linkDialogPlugin(),
      imagePlugin(),
      tablePlugin(),
      codeBlockPlugin({ defaultCodeBlockLanguage: 'plaintext' }),
      codeMirrorPlugin({
        codeBlockLanguages: CODE_LANGUAGES,
      }),
      toolbarPlugin({
        toolbarClassName:
          'border-0 bg-transparent p-0 w-full items-stretch justify-start',
        toolbarContents: () => (
          <AdminBlogEditorToolbar
            editorRef={editorRef}
            blockquoteLabel={labels.toolbarBlockquote}
            toolbarAriaLabel={labels.toolbarAriaLabel}
            fullscreenEnterLabel={labels.fullscreenEnter}
            fullscreenExitLabel={labels.fullscreenExit}
            slashTip={labels.slashTip}
            isFullscreen={isFullscreen}
            onToggleFullscreen={onToggleFullscreen}
            toolbarExtra={toolbarExtra}
          />
        ),
      }),
    ],
    [editorRef, labels, isFullscreen, onToggleFullscreen, toolbarExtra],
  );

  const mdxProps: Omit<MDXEditorProps, 'ref'> = {
    markdown,
    onChange: handleChange,
    placeholder,
    plugins,
    contentEditableClassName: editorClassName,
    className: contentEditableClassName,
  };

  const themeWrapperClass =
    mounted && resolvedTheme === 'dark' ? 'dark-theme' : '';

  return (
    <div className={themeWrapperClass}>
      <MDXEditor ref={editorRef} {...mdxProps} />
    </div>
  );
}
