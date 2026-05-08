import type { Locale, Messages } from '@/shared/i18n';

import type { BlogPost } from '../_types';

import { BlogCard } from './blog-card';
import { BlogsEmptyState } from './blogs-empty-state';

type Props = {
  posts: BlogPost[];
  locale: Locale;
  messages: Messages;
};

export function BlogList({ posts, locale, messages }: Props) {
  if (posts.length === 0) {
    return <BlogsEmptyState messages={messages} />;
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <BlogCard
          key={post.id}
          post={post}
          locale={locale}
          messages={messages}
        />
      ))}
    </div>
  );
}
