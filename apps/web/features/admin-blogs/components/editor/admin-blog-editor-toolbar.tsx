'use client';

import type { MDXEditorMethods } from '@mdxeditor/editor';
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
  StrikeThroughSupSubToggles,
  UndoRedo,
} from '@mdxeditor/editor';
import * as Toolbar from '@radix-ui/react-toolbar';
import {
  Maximize2Icon,
  MessageSquareQuoteIcon,
  Minimize2Icon,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type AdminBlogEditorToolbarProps = {
  editorRef: React.RefObject<MDXEditorMethods | null>;
  blockquoteLabel: string;
  toolbarAriaLabel: string;
  fullscreenEnterLabel: string;
  fullscreenExitLabel: string;
  slashTip: string;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  toolbarExtra?: React.ReactNode;
  className?: string;
};

export function AdminBlogEditorToolbar({
  editorRef,
  blockquoteLabel,
  toolbarAriaLabel,
  fullscreenEnterLabel,
  fullscreenExitLabel,
  slashTip,
  isFullscreen,
  onToggleFullscreen,
  toolbarExtra,
  className,
}: AdminBlogEditorToolbarProps) {
  function insertBlockquote() {
    const ed = editorRef.current;
    if (!ed) return;
    ed.focus();
    ed.insertMarkdown('\n\n> \n');
  }

  return (
    <div
      className={cn(
        'sticky top-12 z-20 w-full border-b border-primary/15 bg-background/90 backdrop-blur supports-backdrop-filter:bg-background/75',
        className,
      )}
    >
      <div
        className="-mx-1 w-full overflow-x-auto px-3 py-2 sm:px-4 [&::-webkit-scrollbar]:hidden"
        style={{ scrollbarWidth: 'none' }}
      >
        <Toolbar.Root
          role="toolbar"
          aria-label={toolbarAriaLabel}
          className="flex min-h-10 min-w-max flex-nowrap items-center gap-1.5 text-muted-foreground [&_button]:size-8 [&_button]:rounded-lg [&_button]:text-muted-foreground [&_button:hover]:bg-muted/80 [&_button:hover]:text-foreground"
        >
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
                    <Toolbar.Separator className="mx-1 h-5 w-px shrink-0 bg-primary/15" />
                    <BoldItalicUnderlineToggles options={['Bold', 'Italic']} />
                    <StrikeThroughSupSubToggles options={['Strikethrough']} />
                    <CodeToggle />
                    <Toolbar.Separator className="mx-1 h-5 w-px shrink-0 bg-primary/15" />
                    <CreateLink />
                    <InsertImage />
                    <Toolbar.Button
                      type="button"
                      className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg hover:bg-muted/80 hover:text-foreground"
                      onClick={insertBlockquote}
                      aria-label={blockquoteLabel}
                    >
                      <MessageSquareQuoteIcon className="size-4" aria-hidden />
                    </Toolbar.Button>
                    <InsertTable />
                    <Toolbar.Separator className="mx-1 h-5 w-px shrink-0 bg-primary/15" />
                    <ListsToggle options={['bullet', 'number', 'check']} />
                    <Toolbar.Separator className="mx-1 h-5 w-px shrink-0 bg-primary/15" />
                    <UndoRedo />
                  </>
                ),
              },
            ]}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="ml-1 shrink-0 text-muted-foreground hover:text-foreground"
            onClick={onToggleFullscreen}
            aria-pressed={isFullscreen}
            aria-label={
              isFullscreen ? fullscreenExitLabel : fullscreenEnterLabel
            }
          >
            {isFullscreen ? (
              <Minimize2Icon className="size-4" aria-hidden />
            ) : (
              <Maximize2Icon className="size-4" aria-hidden />
            )}
          </Button>
        </Toolbar.Root>
      </div>
      <p className="px-4 pb-2 text-xs text-muted-foreground/80">{slashTip}</p>
      {toolbarExtra}
    </div>
  );
}
