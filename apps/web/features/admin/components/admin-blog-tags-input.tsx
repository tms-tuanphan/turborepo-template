'use client';

import { XIcon } from 'lucide-react';
import { useCallback, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const MAX_TAGS = 10;

type AdminBlogTagsInputProps = {
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder: string;
  label: string;
  maxTagsMessage: string;
};

export function AdminBlogTagsInput({
  value,
  onChange,
  placeholder,
  label,
  maxTagsMessage,
}: AdminBlogTagsInputProps) {
  const [draft, setDraft] = useState('');

  const addTag = useCallback(
    (raw: string) => {
      const t = raw.trim();
      if (!t) return;
      if (value.includes(t)) {
        setDraft('');
        return;
      }
      if (value.length >= MAX_TAGS) return;
      onChange([...value, t]);
      setDraft('');
    },
    [onChange, value],
  );

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag(draft);
      return;
    }
    if (e.key === 'Backspace' && draft === '' && value.length > 0) {
      onChange(value.slice(0, -1));
    }
  }

  return (
    <div className="space-y-2">
      <span className="text-sm font-medium leading-none">{label}</span>
      <div className="flex min-h-10 flex-wrap gap-2 rounded-md border border-input bg-transparent px-2 py-1.5">
        {value.map((tag) => (
          <Badge
            key={tag}
            variant="secondary"
            className="gap-1 pr-1 font-normal"
          >
            {tag}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-5 shrink-0"
              aria-label={`Remove ${tag}`}
              onClick={() => onChange(value.filter((x) => x !== tag))}
            >
              <XIcon className="size-3" aria-hidden />
            </Button>
          </Badge>
        ))}
        <Input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={onKeyDown}
          onBlur={() => {
            if (draft.trim()) addTag(draft);
          }}
          placeholder={value.length >= MAX_TAGS ? maxTagsMessage : placeholder}
          disabled={value.length >= MAX_TAGS}
          className="min-w-[120px] flex-1 border-0 bg-transparent shadow-none focus-visible:ring-0"
          aria-label={placeholder}
        />
      </div>
      <p className="text-xs text-muted-foreground">{maxTagsMessage}</p>
    </div>
  );
}
