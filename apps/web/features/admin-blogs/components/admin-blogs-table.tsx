import Link from 'next/link';

import type { Locale, Messages } from '@/shared/i18n';

import { resolveCategoryNameKey } from '../lib/resolve-category-label';
import type { AdminBlogListItem } from '../types/admin-blog';

import { AdminBlogRowActions } from './admin-blog-row-actions';
import { AdminBlogStatusBadge } from './admin-blog-status-badge';

type AdminBlogsTableProps = {
  blogs: AdminBlogListItem[];
  messages: Messages;
  locale: Locale;
};

function formatDate(iso: string | null, locale: Locale): string {
  if (!iso) return '—';
  const loc = locale === 'ja' ? 'ja-JP' : locale === 'vi' ? 'vi-VN' : 'en-US';
  return new Intl.DateTimeFormat(loc, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(iso));
}

export function AdminBlogsTable({
  blogs,
  messages,
  locale,
}: AdminBlogsTableProps) {
  const t = messages.admin.blogs;

  if (blogs.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center rounded-lg border border-dashed bg-card px-6 py-16 text-center"
        role="status"
      >
        <p className="text-lg font-medium">{t.emptyTitle}</p>
        <p className="mt-2 max-w-md text-sm text-muted-foreground">
          {t.emptyDescription}
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border bg-card shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[960px] text-left text-sm">
          <thead className="border-b bg-muted/50">
            <tr>
              <th className="px-4 py-3 font-medium" scope="col">
                {t.columns.title}
              </th>
              <th className="px-4 py-3 font-medium" scope="col">
                {t.columns.slug}
              </th>
              <th className="px-4 py-3 font-medium" scope="col">
                {t.columns.author}
              </th>
              <th className="px-4 py-3 font-medium" scope="col">
                {t.columns.category}
              </th>
              <th className="px-4 py-3 font-medium" scope="col">
                {t.columns.status}
              </th>
              <th className="px-4 py-3 font-medium" scope="col">
                {t.columns.updated}
              </th>
              <th className="px-4 py-3 font-medium" scope="col">
                {t.columns.published}
              </th>
              <th className="px-4 py-3 font-medium text-right" scope="col">
                {t.columns.views}
              </th>
              <th className="px-4 py-3 font-medium text-right" scope="col">
                {t.columns.actions}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {blogs.map((post) => (
              <tr key={post.id} className="hover:bg-muted/30">
                <td className="max-w-[220px] px-4 py-3 font-medium">
                  <Link
                    href={`/${locale}/admin/blogs/${post.id}/edit`}
                    className="line-clamp-2 text-primary underline-offset-4 hover:underline"
                  >
                    {post.title}
                  </Link>
                </td>
                <td className="max-w-[140px] px-4 py-3 font-mono text-xs text-muted-foreground">
                  <span className="line-clamp-2">{post.slug}</span>
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">
                  {post.author}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">
                  {resolveCategoryNameKey(messages, post.category.nameKey)}
                </td>
                <td className="whitespace-nowrap px-4 py-3">
                  <AdminBlogStatusBadge
                    status={post.status}
                    messages={messages}
                  />
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">
                  <time dateTime={post.updatedAt}>
                    {formatDate(post.updatedAt, locale)}
                  </time>
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">
                  {post.publishedAt ? (
                    <time dateTime={post.publishedAt}>
                      {formatDate(post.publishedAt, locale)}
                    </time>
                  ) : (
                    '—'
                  )}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-right tabular-nums text-muted-foreground">
                  {post.views.toLocaleString(
                    locale === 'ja'
                      ? 'ja-JP'
                      : locale === 'vi'
                        ? 'vi-VN'
                        : 'en-US',
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  <AdminBlogRowActions
                    locale={locale}
                    blogId={post.id}
                    messages={messages}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
