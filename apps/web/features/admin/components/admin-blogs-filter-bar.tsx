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
import { BLOG_CATEGORIES, BLOG_STATUSES } from '@/shared/types/blog';
import type { Messages } from '@/shared/i18n';

import { useAdminBlogFilters } from '../_hooks/use-admin-blog-filters';

const SEARCH_DEBOUNCE_MS = 300;

type AdminBlogsFilterBarProps = {
  messages: Messages;
};

export function AdminBlogsFilterBar({ messages }: AdminBlogsFilterBarProps) {
  const { search, category, status, setSearch, setCategory, setStatus } =
    useAdminBlogFilters();
  const [draft, setDraft] = useState(search);

  useEffect(() => {
    setDraft(search);
  }, [search]);

  useEffect(() => {
    if (draft === search) return;
    const timer = setTimeout(() => setSearch(draft), SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [draft, search, setSearch]);

  const t = messages.admin.blogs.filters;
  const tc = messages.blogs.categories;
  const ts = messages.admin.blogs.status;

  return (
    <div className="grid gap-3 md:grid-cols-3">
      <div className="relative md:col-span-1">
        <Search
          aria-hidden
          className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder={t.searchPlaceholder}
          aria-label={t.searchPlaceholder}
          className="h-10 rounded-md pl-10 text-sm"
        />
      </div>

      <Select
        value={category}
        onValueChange={(value) =>
          setCategory(value as (typeof BLOG_CATEGORIES)[number] | 'ALL')
        }
      >
        <SelectTrigger
          aria-label={t.categoryLabel}
          className="h-10 w-full text-sm"
        >
          <SelectValue placeholder={tc.ALL} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">{tc.ALL}</SelectItem>
          {BLOG_CATEGORIES.map((cat) => (
            <SelectItem key={cat} value={cat}>
              {tc[cat]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={status}
        onValueChange={(value) =>
          setStatus(value as (typeof BLOG_STATUSES)[number] | 'ALL')
        }
      >
        <SelectTrigger
          aria-label={t.statusLabel}
          className="h-10 w-full text-sm"
        >
          <SelectValue placeholder={ts.allStatuses} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">{ts.allStatuses}</SelectItem>
          {BLOG_STATUSES.map((s) => (
            <SelectItem key={s} value={s}>
              {s === 'DRAFT'
                ? ts.draft
                : s === 'REVIEWING'
                  ? ts.reviewing
                  : s === 'SCHEDULED'
                    ? ts.scheduled
                    : s === 'PUBLISHED'
                      ? ts.published
                      : ts.archived}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
