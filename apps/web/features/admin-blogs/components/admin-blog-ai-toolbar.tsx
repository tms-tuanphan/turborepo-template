'use client';

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

import type { AdminBlogEditorSelection } from './admin-blog-markdown-editor';

type ToolbarLabels = {
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
  selection: AdminBlogEditorSelection | null;
  onContentChange: (next: string) => void;
  labels: ToolbarLabels;
};

type ActionKey = 'outline' | 'rewrite' | 'summarize' | 'command';

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

function spliceContent(
  content: string,
  insertion: string,
  start: number,
  end: number,
): string {
  if (start < 0 || end < start || end > content.length) {
    return content + (content.endsWith('\n') ? '' : '\n\n') + insertion;
  }
  return content.slice(0, start) + insertion + content.slice(end);
}

export function AdminBlogAiToolbar({
  title,
  content,
  selection,
  onContentChange,
  labels,
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
    if (!selection || selection.text.trim().length === 0) {
      flash(labels.missingSelection);
      return;
    }
    setBusy('rewrite');
    try {
      const result = await callAi('rewrite', { selection: selection.text });
      onContentChange(
        spliceContent(content, result, selection.start, selection.end),
      );
    } catch {
      flash(labels.errorGeneric);
    } finally {
      setBusy(null);
    }
  }, [content, flash, labels, onContentChange, selection]);

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
      setBusy('command');
      try {
        const result = await callAi('command', {
          prompt: trimmed,
          context: title.trim(),
        });
        const start = selection?.start ?? content.length;
        const end = selection?.end ?? content.length;
        onContentChange(
          spliceContent(
            content,
            (content.length > 0 ? '\n\n' : '') + result,
            start,
            end,
          ),
        );
        setCommandOpen(false);
        setCommandPrompt('');
      } catch {
        flash(labels.errorGeneric);
      } finally {
        setBusy(null);
      }
    },
    [content, flash, labels, onContentChange, selection, title],
  );

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

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild disabled={menuDisabled}>
          <Button
            type="button"
            size="icon-lg"
            className="absolute right-4 bottom-4 z-20 size-12 rounded-full shadow-lg"
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

      {message ? (
        <p
          className="pointer-events-none absolute right-4 bottom-[4.5rem] z-20 max-w-[min(18rem,calc(100%-2rem))] rounded-md border border-destructive/30 bg-background/95 px-3 py-2 text-xs text-destructive shadow-md"
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
