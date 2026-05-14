import Image from 'next/image';
import Link from 'next/link';

import { Card, CardContent } from '@/components/ui/card';
import type { Locale, Messages } from '@/shared/i18n';

import type { BlogPost } from '../_types';

type Props = {
  post: BlogPost;
  locale: Locale;
  messages: Messages;
};

function formatDate(date: string, locale: Locale): string {
  const loc = locale === 'ja' ? 'ja-JP' : locale === 'vi' ? 'vi-VN' : 'en-US';
  const formatter = new Intl.DateTimeFormat(loc, {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  });
  return formatter.format(new Date(date));
}

export function BlogCard({ post, locale, messages }: Props) {
  return (
    <Card className="group overflow-hidden border-border/60 bg-background py-0 transition-all hover:-translate-y-0.5 hover:shadow-md">
      <Link
        href={`/${locale}/resources/blogs/${post.slug}`}
        className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        <div className="relative aspect-video w-full overflow-hidden bg-muted">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
            unoptimized={post.coverImage.startsWith('data:')}
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <CardContent className="space-y-3 px-5 py-5">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            {post.publishedAt ? (
              <span>{formatDate(post.publishedAt, locale)}</span>
            ) : null}
            {post.publishedAt ? (
              <span
                aria-hidden
                className="size-1 rounded-full bg-muted-foreground/40"
              />
            ) : null}
            <span>{messages.blogs.categories[post.category]}</span>
          </div>
          <h3 className="line-clamp-2 text-base font-semibold leading-snug text-foreground transition-colors group-hover:text-brand">
            {post.title}
          </h3>
          <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
            {post.description}
          </p>
        </CardContent>
      </Link>
    </Card>
  );
}
