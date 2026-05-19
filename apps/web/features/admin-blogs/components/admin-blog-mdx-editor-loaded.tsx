'use client';

import '@mdxeditor/editor/style.css';

import type { MDXEditorMethods, MDXEditorProps } from '@mdxeditor/editor';
import {
  BlockTypeSelect,
  BoldItalicUnderlineToggles,
  ChangeCodeMirrorLanguage,
  CodeToggle,
  ConditionalContents,
  CreateLink,
  InsertImage,
  InsertTable,
  ListsToggle,
  MDXEditor,
  StrikeThroughSupSubToggles,
  UndoRedo,
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
import * as Toolbar from '@radix-ui/react-toolbar';
import {
  Maximize2Icon,
  MessageSquareQuoteIcon,
  Minimize2Icon,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export type AdminBlogMdxEditorLoadedLabels = {
  titleLabel: string;
  titlePlaceholder: string;
  excerptLabel: string;
  excerptPlaceholder: string;
  contentAriaLabel: string;
  emptyTitle: string;
  emptyHint: string;
  quickHeading: string;
  quickCode: string;
  quickImage: string;
  quickQuote: string;
  quickTable: string;
  slashTip: string;
  toolbarBlockquote: string;
  formatMarkdown: string;
  fullscreenEnter: string;
  fullscreenExit: string;
};

type AdminBlogMdxEditorLoadedProps = {
  editorRef: React.RefObject<MDXEditorMethods | null>;
  markdown: string;
  onChange: (markdown: string) => void;
  title: string;
  onTitleChange: (value: string) => void;
  onTitleBlur: () => void;
  titleInputId: string;
  titleInvalid: boolean;
  titleError?: string;
  titleErrorId?: string;
  labels: AdminBlogMdxEditorLoadedLabels;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  placeholder: string;
  contentEditableClassName?: string;
  excerpt: string;
  onExcerptChange: (value: string) => void;
  excerptMax: number;
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

function ToolbarContents({
  editorRef,
  labels,
  isFullscreen,
  onToggleFullscreen,
  title,
  onTitleChange,
  onTitleBlur,
  titleInputId,
  titleInvalid,
  titleError,
  titleErrorId,
  excerpt,
  onExcerptChange,
  excerptMax,
  toolbarExtra,
}: Pick<
  AdminBlogMdxEditorLoadedProps,
  | 'editorRef'
  | 'labels'
  | 'isFullscreen'
  | 'onToggleFullscreen'
  | 'title'
  | 'onTitleChange'
  | 'onTitleBlur'
  | 'titleInputId'
  | 'titleInvalid'
  | 'titleError'
  | 'titleErrorId'
  | 'excerpt'
  | 'onExcerptChange'
  | 'excerptMax'
  | 'toolbarExtra'
>) {
  function insertBlockquote() {
    const ed = editorRef.current;
    if (!ed) return;
    ed.focus();
    ed.insertMarkdown('\n\n> \n');
  }

  return (
    <div className="flex w-full flex-col bg-background">
      <div className="border-b border-border px-4 py-3 sm:px-6">
        <label htmlFor={titleInputId} className="sr-only">
          {labels.titleLabel}
        </label>
        <div className="rounded-lg border border-input bg-background shadow-sm">
          <Input
            id={titleInputId}
            name="title"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            onBlur={onTitleBlur}
            placeholder={labels.titlePlaceholder}
            aria-invalid={titleInvalid}
            aria-describedby={titleError ? titleErrorId : undefined}
            className="h-12 border-0 bg-transparent px-3 text-lg font-semibold shadow-none placeholder:text-muted-foreground/70 focus-visible:ring-0 sm:text-xl"
          />
        </div>
        {titleError ? (
          <p
            id={titleErrorId}
            className="mt-2 text-sm text-destructive"
            role="alert"
          >
            {titleError}
          </p>
        ) : null}
        <div className="mt-3 space-y-1">
          <label htmlFor="blog-excerpt" className="sr-only">
            {labels.excerptLabel}
          </label>
          <textarea
            id="blog-excerpt"
            value={excerpt}
            onChange={(e) =>
              onExcerptChange(e.target.value.slice(0, excerptMax))
            }
            placeholder={labels.excerptPlaceholder}
            rows={3}
            className="border-input bg-background placeholder:text-muted-foreground focus-visible:ring-ring w-full resize-none rounded-lg border px-3 py-2 text-sm leading-relaxed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
          />
          <p className="text-end text-xs tabular-nums text-muted-foreground">
            {excerpt.length}/{excerptMax}
          </p>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-1 border-b border-border px-2 py-1.5 sm:px-4">
        <Toolbar.Root className="flex min-h-10 min-w-0 flex-1 flex-wrap items-center gap-0.5 border-0 bg-transparent p-0 text-muted-foreground [&_button]:text-muted-foreground [&_button:hover]:text-foreground">
          <ConditionalContents
            options={[
              {
                when: (editor) => editor?.editorType === 'codeblock',
                contents: () => <ChangeCodeMirrorLanguage />,
              },
              {
                fallback: () => (
                  <>
                    <BlockTypeSelect />
                    <Toolbar.Separator className="mx-0.5 h-6 w-px shrink-0 bg-border" />
                    <BoldItalicUnderlineToggles options={['Bold', 'Italic']} />
                    <StrikeThroughSupSubToggles options={['Strikethrough']} />
                    <CodeToggle />
                    <Toolbar.Separator className="mx-0.5 h-6 w-px shrink-0 bg-border" />
                    <CreateLink />
                    <InsertImage />
                    <Toolbar.Button
                      type="button"
                      className="inline-flex size-8 shrink-0 items-center justify-center rounded-md hover:bg-muted hover:text-foreground"
                      onClick={insertBlockquote}
                      aria-label={labels.toolbarBlockquote}
                    >
                      <MessageSquareQuoteIcon className="size-4" aria-hidden />
                    </Toolbar.Button>
                    <InsertTable />
                    <Toolbar.Separator className="mx-0.5 h-6 w-px shrink-0 bg-border" />
                    <ListsToggle options={['bullet', 'number', 'check']} />
                    <Toolbar.Separator className="mx-0.5 h-6 w-px shrink-0 bg-border" />
                    <UndoRedo />
                  </>
                ),
              },
            ]}
          />
        </Toolbar.Root>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="shrink-0 text-muted-foreground hover:text-foreground"
          onClick={onToggleFullscreen}
          aria-pressed={isFullscreen}
          aria-label={
            isFullscreen ? labels.fullscreenExit : labels.fullscreenEnter
          }
        >
          {isFullscreen ? (
            <Minimize2Icon className="size-4" aria-hidden />
          ) : (
            <Maximize2Icon className="size-4" aria-hidden />
          )}
        </Button>
      </div>
      {toolbarExtra}
    </div>
  );
}

export default function AdminBlogMdxEditorLoaded({
  editorRef,
  markdown,
  onChange,
  title,
  onTitleChange,
  onTitleBlur,
  titleInputId,
  titleInvalid,
  titleError,
  titleErrorId,
  labels,
  isFullscreen,
  onToggleFullscreen,
  placeholder,
  contentEditableClassName,
  excerpt,
  onExcerptChange,
  excerptMax,
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
    () => 'prose max-w-none dark:prose-invert min-h-[min(28rem,50vh)]',
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
          <ToolbarContents
            editorRef={editorRef}
            labels={labels}
            isFullscreen={isFullscreen}
            onToggleFullscreen={onToggleFullscreen}
            title={title}
            onTitleChange={onTitleChange}
            onTitleBlur={onTitleBlur}
            titleInputId={titleInputId}
            titleInvalid={titleInvalid}
            titleError={titleError}
            titleErrorId={titleErrorId}
            excerpt={excerpt}
            onExcerptChange={onExcerptChange}
            excerptMax={excerptMax}
            toolbarExtra={toolbarExtra}
          />
        ),
      }),
    ],
    [
      editorRef,
      labels,
      isFullscreen,
      onToggleFullscreen,
      title,
      onTitleChange,
      onTitleBlur,
      titleInputId,
      titleInvalid,
      titleError,
      titleErrorId,
      excerpt,
      onExcerptChange,
      excerptMax,
      toolbarExtra,
    ],
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
