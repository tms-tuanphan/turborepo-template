'use client';

import { Search } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState, type ReactNode } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Messages } from '@/shared/i18n';

import { useAdminBlogFilters } from '../hooks/use-admin-blog-filters';
import { resolveCategoryLabel } from '../lib/resolve-category-label';
import type { AdminBlogCategoryOption } from '../types/admin-blog';
import { ADMIN_FILTER_STATUSES } from '../types/admin-blog';

const SEARCH_DEBOUNCE_MS = 300;
const CONTROL_CLASS = 'h-12 rounded-md text-sm';
const SELECT_TRIGGER_CLASS = `${CONTROL_CLASS} h-12! w-full`;

type AdminBlogsFilterBarProps = {
  messages: Messages;
  categories: AdminBlogCategoryOption[];
  createHref?: string;
  createLabel?: string;
};

function FilterField({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label
        htmlFor={htmlFor}
        className="text-xs font-medium text-muted-foreground"
      >
        {label}
      </Label>
      {children}
    </div>
  );
}

export function AdminBlogsFilterBar({
  messages,
  categories,
  createHref,
  createLabel,
}: AdminBlogsFilterBarProps) {
  const { search, category, status, setSearch, setCategory, setStatus } =
    useAdminBlogFilters();
  const [draft, setDraft] = useState(search);
  const safeCategories = Array.isArray(categories) ? categories : [];

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
  const searchLabel = messages.admin.shell.searchPlaceholder;

  return (
    <div className="py-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="grid flex-1 gap-4 sm:grid-cols-2 lg:grid-cols-[1fr_200px_200px] lg:items-end">
          <FilterField label={searchLabel} htmlFor="admin-blogs-search">
            <div className="relative">
              <Search
                aria-hidden
                className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              />
              <Input
                id="admin-blogs-search"
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                placeholder={t.searchPlaceholder}
                className={`${CONTROL_CLASS} pl-10`}
              />
            </div>
          </FilterField>

          <FilterField label={t.categoryLabel}>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger
                aria-label={t.categoryLabel}
                className={SELECT_TRIGGER_CLASS}
              >
                <SelectValue placeholder={tc.ALL} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">{tc.ALL}</SelectItem>
                {safeCategories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {resolveCategoryLabel(cat.displayName)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FilterField>

          <FilterField label={t.statusLabel}>
            <Select
              value={status}
              onValueChange={(value) =>
                setStatus(value as (typeof ADMIN_FILTER_STATUSES)[number])
              }
            >
              <SelectTrigger
                aria-label={t.statusLabel}
                className={SELECT_TRIGGER_CLASS}
              >
                <SelectValue placeholder={ts.allStatuses} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">{ts.allStatuses}</SelectItem>
                {ADMIN_FILTER_STATUSES.filter((s) => s !== 'ALL').map((s) => (
                  <SelectItem key={s} value={s}>
                    {s === 'PUBLISHED' ? ts.published : ts.unpublished}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FilterField>
        </div>
        {createHref && createLabel ? (
          <Button type="button" asChild className="h-12 shrink-0 px-6">
            <Link href={createHref}>{createLabel}</Link>
          </Button>
        ) : null}
      </div>
    </div>
  );
}
