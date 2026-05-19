'use client';

import type { MDXEditorMethods } from '@mdxeditor/editor';
import { Loader2Icon, SparklesIcon } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type ToolbarLabels = {
  continueWriting: string;
  seoOptimize: string;
  outline: string;
  rewrite: string;
  summarize: string;
  loading: string;
  missingTitle: string;
  missingSelection: string;
  missingContent: string;
  errorGeneric: string;
  summaryDialogTitle: string;
  summaryDialogDescription: string;
  summaryInsert: string;
  summaryClose: string;
  commandDialogTitle: string;
  commandDialogDescription: string;
  commandPlaceholder: string;
  commandSubmit: string;
  commandShortcutHint: string;
  fabAriaLabel: string;
  commandMenuLabel: string;
};

type AdminBlogAiToolbarProps = {
  title: string;
  content: string;
  editorRef: React.RefObject<MDXEditorMethods | null>;
  onContentChange: (next: string) => void;
  labels: ToolbarLabels;
  variant?: 'fab' | 'inline' | 'compact';
  onRegisterOutline?: (handler: () => void) => void;
};

type ActionKey =
  | 'outline'
  | 'rewrite'
  | 'summarize'
  | 'command'
  | 'continue'
  | 'seo';

async function callAi(
  path: string,
  body: Record<string, unknown>,
): Promise<string> {
  const res = await fetch(`/api/admin/blog-ai/${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    throw new Error(`AI request failed: ${res.status}`);
  }
  const data: unknown = await res.json();
  if (
    typeof data !== 'object' ||
    data === null ||
    typeof (data as { result?: unknown }).result !== 'string'
  ) {
    throw new Error('Malformed AI response');
  }
  return (data as { result: string }).result;
}

function replaceFirstMarkdownOccurrence(
  markdown: string,
  search: string,
  replacement: string,
): string | null {
  const idx = markdown.indexOf(search);
  if (idx === -1) return null;
  return (
    markdown.slice(0, idx) + replacement + markdown.slice(idx + search.length)
  );
}

function insertAtCursor(
  ed: MDXEditorMethods,
  content: string,
  aiResult: string,
  onContentChange: (next: string) => void,
) {
  const prefix = content.trim().length > 0 ? '\n\n' : '';
  const selectionMd = ed.getSelectionMarkdown().trim();
  ed.focus();
  if (selectionMd.length > 0) {
    const current = ed.getMarkdown();
    const replaced = replaceFirstMarkdownOccurrence(
      current,
      selectionMd,
      prefix + aiResult,
    );
    if (replaced !== null) {
      ed.setMarkdown(replaced);
    } else {
      ed.insertMarkdown(prefix + aiResult);
    }
  } else {
    ed.insertMarkdown(prefix + aiResult);
  }
  onContentChange(ed.getMarkdown());
}

export function AdminBlogAiToolbar({
  title,
  content,
  editorRef,
  onContentChange,
  labels,
  variant = 'inline',
  onRegisterOutline,
}: AdminBlogAiToolbarProps) {
  const [busy, setBusy] = useState<ActionKey | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [summary, setSummary] = useState<string | null>(null);
  const [commandOpen, setCommandOpen] = useState(false);
  const [commandPrompt, setCommandPrompt] = useState('');

  const flash = useCallback((text: string) => {
    setMessage(text);
    window.setTimeout(() => setMessage(null), 3000);
  }, []);

  const runOutline = useCallback(async () => {
    if (!title.trim()) {
      flash(labels.missingTitle);
      return;
    }
    setBusy('outline');
    try {
      const result = await callAi('outline', { title: title.trim() });
      const trimmedContent = content.trimEnd();
      const next =
        trimmedContent.length === 0 ? result : `${trimmedContent}\n\n${result}`;
      onContentChange(next);
    } catch {
      flash(labels.errorGeneric);
    } finally {
      setBusy(null);
    }
  }, [content, flash, labels, onContentChange, title]);

  const runRewrite = useCallback(async () => {
    const ed = editorRef.current;
    const selectionMd = ed?.getSelectionMarkdown().trim() ?? '';
    if (!ed || selectionMd.length === 0) {
      flash(labels.missingSelection);
      return;
    }
    setBusy('rewrite');
    try {
      const result = await callAi('rewrite', { selection: selectionMd });
      const current = ed.getMarkdown();
      const replaced = replaceFirstMarkdownOccurrence(
        current,
        selectionMd,
        result,
      );
      if (replaced !== null) {
        ed.setMarkdown(replaced);
        onContentChange(replaced);
      } else {
        ed.focus();
        ed.insertMarkdown(result);
        onContentChange(ed.getMarkdown());
      }
    } catch {
      flash(labels.errorGeneric);
    } finally {
      setBusy(null);
    }
  }, [editorRef, flash, labels, onContentChange]);

  const runSummarize = useCallback(async () => {
    if (!content.trim()) {
      flash(labels.missingContent);
      return;
    }
    setBusy('summarize');
    try {
      const result = await callAi('summarize', { content });
      setSummary(result);
    } catch {
      flash(labels.errorGeneric);
    } finally {
      setBusy(null);
    }
  }, [content, flash, labels]);

  const runCommand = useCallback(
    async (prompt: string) => {
      const trimmed = prompt.trim();
      if (!trimmed) return;
      const ed = editorRef.current;
      if (!ed) {
        flash(labels.errorGeneric);
        return;
      }
      setBusy('command');
      try {
        const aiResult = await callAi('command', {
          prompt: trimmed,
          context: title.trim(),
        });
        insertAtCursor(ed, content, aiResult, onContentChange);
        setCommandOpen(false);
        setCommandPrompt('');
      } catch {
        flash(labels.errorGeneric);
      } finally {
        setBusy(null);
      }
    },
    [content, editorRef, flash, labels, onContentChange, title],
  );

  const runContinueWriting = useCallback(async () => {
    if (!content.trim() && !title.trim()) {
      flash(labels.missingContent);
      return;
    }
    const ed = editorRef.current;
    if (!ed) {
      flash(labels.errorGeneric);
      return;
    }
    setBusy('continue');
    try {
      const aiResult = await callAi('command', {
        prompt:
          'Continue writing this blog article naturally from where it left off. Match tone and language.',
        context: `${title.trim()}\n\n${content.slice(-4000)}`,
      });
      insertAtCursor(ed, content, aiResult, onContentChange);
    } catch {
      flash(labels.errorGeneric);
    } finally {
      setBusy(null);
    }
  }, [content, editorRef, flash, labels, onContentChange, title]);

  const runSeoOptimize = useCallback(async () => {
    if (!content.trim()) {
      flash(labels.missingContent);
      return;
    }
    const ed = editorRef.current;
    if (!ed) {
      flash(labels.errorGeneric);
      return;
    }
    setBusy('seo');
    try {
      const aiResult = await callAi('command', {
        prompt:
          'Improve this article for SEO: strengthen headings, add keyword-friendly phrasing, and suggest a short meta description block at the top as a comment.',
        context: `${title.trim()}\n\n${content.slice(0, 8000)}`,
      });
      insertAtCursor(ed, content, aiResult, onContentChange);
    } catch {
      flash(labels.errorGeneric);
    } finally {
      setBusy(null);
    }
  }, [content, editorRef, flash, labels, onContentChange, title]);

  useEffect(() => {
    onRegisterOutline?.(() => {
      void runOutline();
    });
  }, [onRegisterOutline, runOutline]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCommandOpen(true);
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  function insertSummaryAtTop() {
    if (!summary) return;
    const next = `${summary}\n\n${content}`;
    onContentChange(next);
    setSummary(null);
  }

  const menuDisabled = busy !== null;

  const aiButtonClass =
    'h-8 gap-1.5 rounded-full border-violet-500/20 bg-violet-500/5 px-3 text-violet-700 hover:bg-violet-500/10 dark:text-violet-300';

  const compactButtons = (
    <div
      className="flex flex-wrap items-center gap-2 border-t border-violet-500/15 bg-violet-500/5 px-3 py-2.5 sm:px-4"
      role="group"
      aria-label={labels.fabAriaLabel}
    >
      {(
        [
          ['continue', labels.continueWriting, runContinueWriting, true],
          ['rewrite', labels.rewrite, runRewrite, false],
          ['seo', labels.seoOptimize, runSeoOptimize, false],
          ['summarize', labels.summarize, runSummarize, false],
          ['outline', labels.outline, runOutline, false],
        ] as const
      ).map(([key, label, fn, showIcon]) => (
        <Button
          key={key}
          type="button"
          variant="outline"
          size="sm"
          className={aiButtonClass}
          disabled={menuDisabled}
          onClick={() => void fn()}
          aria-busy={busy === key}
        >
          {busy === key ? (
            <Loader2Icon
              className="size-3.5 shrink-0 animate-spin"
              aria-hidden
            />
          ) : showIcon ? (
            <SparklesIcon className="size-3.5 shrink-0" aria-hidden />
          ) : null}
          <span className="truncate">{label}</span>
        </Button>
      ))}
      {message ? (
        <p className="w-full text-xs text-destructive" role="status">
          {message}
        </p>
      ) : null}
    </div>
  );

  return (
    <>
      {variant === 'compact' || variant === 'inline' ? (
        compactButtons
      ) : (
        <DropdownMenu>
          <DropdownMenuTrigger asChild disabled={menuDisabled}>
            <Button
              type="button"
              size="icon-lg"
              className="absolute right-4 bottom-4 z-30 size-12 rounded-full bg-primary text-primary-foreground shadow-md hover:bg-primary/90 sm:right-5 sm:bottom-5"
              aria-label={labels.fabAriaLabel}
              aria-busy={menuDisabled}
            >
              {busy !== null ? (
                <Loader2Icon className="size-5 animate-spin" aria-hidden />
              ) : (
                <SparklesIcon className="size-5" aria-hidden />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="left" align="end" className="w-56">
            <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
              {labels.commandShortcutHint}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              disabled={menuDisabled}
              onClick={() => void runContinueWriting()}
            >
              {labels.continueWriting}
            </DropdownMenuItem>
            <DropdownMenuItem
              disabled={menuDisabled}
              onClick={() => void runOutline()}
            >
              {labels.outline}
            </DropdownMenuItem>
            <DropdownMenuItem
              disabled={menuDisabled}
              onClick={() => void runRewrite()}
            >
              {labels.rewrite}
            </DropdownMenuItem>
            <DropdownMenuItem
              disabled={menuDisabled}
              onClick={() => void runSeoOptimize()}
            >
              {labels.seoOptimize}
            </DropdownMenuItem>
            <DropdownMenuItem
              disabled={menuDisabled}
              onClick={() => void runSummarize()}
            >
              {labels.summarize}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              disabled={menuDisabled}
              onClick={() => setCommandOpen(true)}
            >
              {labels.commandMenuLabel}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      {message && variant === 'fab' ? (
        <p
          className="pointer-events-none absolute right-4 bottom-16 z-30 max-w-[min(18rem,calc(100%-2rem))] rounded-md border border-destructive/30 bg-background/95 px-3 py-2 text-xs text-destructive shadow-md sm:right-5"
          role="status"
        >
          {message}
        </p>
      ) : null}

      <Dialog
        open={summary !== null}
        onOpenChange={(open) => {
          if (!open) setSummary(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{labels.summaryDialogTitle}</DialogTitle>
            <DialogDescription>
              {labels.summaryDialogDescription}
            </DialogDescription>
          </DialogHeader>
          <p className="whitespace-pre-wrap rounded-md border bg-muted/40 p-3 text-sm leading-relaxed">
            {summary}
          </p>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setSummary(null)}
            >
              {labels.summaryClose}
            </Button>
            <Button type="button" onClick={insertSummaryAtTop}>
              {labels.summaryInsert}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={commandOpen}
        onOpenChange={(open) => {
          setCommandOpen(open);
          if (!open) setCommandPrompt('');
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{labels.commandDialogTitle}</DialogTitle>
            <DialogDescription>
              {labels.commandDialogDescription}
            </DialogDescription>
          </DialogHeader>
          <textarea
            value={commandPrompt}
            onChange={(e) => setCommandPrompt(e.target.value)}
            placeholder={labels.commandPlaceholder}
            rows={4}
            autoFocus
            className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex w-full rounded-md border px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
            onKeyDown={(e) => {
              if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                e.preventDefault();
                void runCommand(commandPrompt);
              }
            }}
          />
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setCommandOpen(false)}
              disabled={busy === 'command'}
            >
              {labels.summaryClose}
            </Button>
            <Button
              type="button"
              onClick={() => void runCommand(commandPrompt)}
              disabled={busy === 'command' || commandPrompt.trim().length === 0}
              aria-busy={busy === 'command'}
            >
              {busy === 'command' ? (
                <Loader2Icon className="animate-spin" aria-hidden />
              ) : null}
              {busy === 'command' ? labels.loading : labels.commandSubmit}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
