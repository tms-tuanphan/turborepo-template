import { FileSearch } from 'lucide-react';

import type { Messages } from '@/shared/i18n';

type Props = {
  messages: Messages;
};

export function BlogsEmptyState({ messages }: Props) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-16 text-center">
      <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-muted">
        <FileSearch className="size-6 text-muted-foreground" aria-hidden />
      </div>
      <h3 className="text-base font-semibold text-foreground">
        {messages.blogs.empty.title}
      </h3>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        {messages.blogs.empty.description}
      </p>
    </div>
  );
}
