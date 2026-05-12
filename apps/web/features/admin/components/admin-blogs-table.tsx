import type { BlogPost } from '@/shared/types/blog';
import type { Messages } from '@/shared/i18n';

type AdminBlogsTableProps = {
  blogs: BlogPost[];
  messages: Messages;
};

export function AdminBlogsTable({ blogs, messages }: AdminBlogsTableProps) {
  const t = messages.admin.blogs;
  const categories = messages.blogs.categories;

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
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b bg-muted/50">
            <tr>
              <th className="px-4 py-3 font-medium" scope="col">
                {t.columnTitle}
              </th>
              <th className="px-4 py-3 font-medium" scope="col">
                {t.columnCategory}
              </th>
              <th className="px-4 py-3 font-medium" scope="col">
                {t.columnPublished}
              </th>
              <th className="px-4 py-3 font-medium" scope="col">
                {t.columnSlug}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {blogs.map((post) => (
              <tr key={post.id} className="hover:bg-muted/30">
                <td className="max-w-[280px] px-4 py-3 font-medium">
                  <span className="line-clamp-2">{post.title}</span>
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">
                  {categories[post.category]}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">
                  {post.publishedAt}
                </td>
                <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                  {post.slug}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
