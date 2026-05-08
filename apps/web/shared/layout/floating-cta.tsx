'use client';

import { MessageCircle, Phone, X } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Messages } from '@/shared/i18n';

type Props = {
  messages: Messages;
};

export function FloatingCTA({ messages }: Props) {
  const [open, setOpen] = useState(true);

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          'fixed bottom-6 right-6 z-30 flex size-12 items-center justify-center rounded-full bg-brand text-brand-foreground shadow-lg transition hover:scale-105',
        )}
        aria-label={messages.floating.title}
      >
        <MessageCircle className="size-5" />
      </button>
    );
  }

  return (
    <div
      role="region"
      aria-label={messages.floating.title}
      className="fixed bottom-6 right-6 z-30 flex items-center gap-3"
    >
      <div className="relative flex items-center gap-2 rounded-full bg-background px-4 py-2 pr-10 text-sm font-medium text-emerald-600 shadow-md ring-1 ring-border">
        <span className="size-2 animate-pulse rounded-full bg-emerald-500" />
        {messages.floating.title}
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Close"
          className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <X className="size-3.5" />
        </button>
      </div>

      <div className="flex items-center gap-2">
        <Button
          size="icon"
          variant="outline"
          className="size-10 rounded-full bg-background shadow-md"
          aria-label={messages.floating.phoneAria}
        >
          <Phone className="size-4" />
        </Button>
        <Button
          size="icon"
          className="size-10 rounded-full bg-yellow-400 text-black shadow-md hover:bg-yellow-500"
          aria-label={messages.floating.chatAria}
        >
          <MessageCircle className="size-4" />
        </Button>
      </div>
    </div>
  );
}
