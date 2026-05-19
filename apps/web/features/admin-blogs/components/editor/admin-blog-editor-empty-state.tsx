'use client';

import type { MDXEditorMethods } from '@mdxeditor/editor';
import { Code2Icon, LightbulbIcon, ListTreeIcon, TypeIcon } from 'lucide-react';
import { useCallback } from 'react';

import { cn } from '@/lib/utils';

type AdminBlogEditorEmptyStateProps = {
  editorRef: React.RefObject<MDXEditorMethods | null>;
  onOutline?: () => void;
  labels: {
    quickTitle: string;
    quickSlash: string;
    quickOutline: string;
    quickCode: string;
    slashTip: string;
  };
  className?: string;
};

export function AdminBlogEditorEmptyState({
  editorRef,
  onOutline,
  labels,
  className,
}: AdminBlogEditorEmptyStateProps) {
  const insert = useCallback(
    (snippet: string) => {
      const ed = editorRef.current;
      if (!ed) return;
      ed.focus();
      ed.insertMarkdown(snippet);
    },
    [editorRef],
  );

  const chips = [
    {
      key: 'title',
      label: labels.quickTitle,
      icon: TypeIcon,
      action: () => document.getElementById('blog-title')?.focus(),
    },
    {
      key: 'slash',
      label: labels.quickSlash,
      icon: LightbulbIcon,
      action: () => insert('\n\n'),
    },
    {
      key: 'outline',
      label: labels.quickOutline,
      icon: ListTreeIcon,
      action: () => onOutline?.(),
    },
    {
      key: 'code',
      label: labels.quickCode,
      icon: Code2Icon,
      action: () => insert('\n\n```plaintext\n\n```\n'),
    },
  ];

  return (
    <div
      className={cn('border-t border-border/40 px-4 py-4 sm:px-6', className)}
    >
      <div className="flex flex-wrap gap-2">
        {chips.map(({ key, label, icon: Icon, action }) => (
          <button
            key={key}
            type="button"
            onClick={action}
            className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-border/60 bg-background/80 px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-border hover:bg-muted/40 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <Icon className="size-3.5 shrink-0 opacity-70" aria-hidden />
            {label}
          </button>
        ))}
      </div>
      <p className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground/80">
        <LightbulbIcon className="size-3.5 shrink-0" aria-hidden />
        {labels.slashTip}
      </p>
    </div>
  );
}
