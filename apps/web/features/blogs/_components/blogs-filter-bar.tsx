'use client';

import { Search } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Messages } from '@/shared/i18n';

import { useBlogFilters } from '../_hooks/use-blog-filters';
import type { BlogCategory } from '../_types';
import { categoryOptions } from '../_data/categories';

type Props = {
  messages: Messages;
};

const SEARCH_DEBOUNCE_MS = 300;

export function BlogsFilterBar({ messages }: Props) {
  const { search, category, setSearch, setCategory } = useBlogFilters();
  const [draft, setDraft] = useState(search);

  useEffect(() => {
    setDraft(search);
  }, [search]);

  useEffect(() => {
    if (draft === search) return;
    const timer = setTimeout(() => setSearch(draft), SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [draft, search, setSearch]);

  return (
    <div className="grid gap-3 sm:grid-cols-[1fr_minmax(160px,220px)]">
      <div className="relative">
        <Search
          aria-hidden
          className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder={messages.blogs.searchPlaceholder}
          aria-label={messages.blogs.searchPlaceholder}
          className="h-12 rounded-md pl-10 text-sm"
        />
      </div>

      <Select
        value={category}
        onValueChange={(value) => setCategory(value as BlogCategory | 'ALL')}
      >
        <SelectTrigger
          aria-label={messages.blogs.categoryLabel}
          className="h-12! w-full text-sm"
        >
          <SelectValue placeholder={messages.blogs.filterAll} />
        </SelectTrigger>
        <SelectContent>
          {categoryOptions.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {messages.blogs.categories[opt.value]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
