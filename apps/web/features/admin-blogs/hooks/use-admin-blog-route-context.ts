'use client';

import { notFound, useParams } from 'next/navigation';

import {
  getMessages,
  isLocale,
  type Locale,
  type Messages,
} from '@/shared/i18n';

type AdminBlogRouteContext = {
  locale: Locale;
  messages: Messages;
  postId?: string;
};

function pickParam(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}

export function useAdminBlogRouteContext(options?: {
  requirePostId?: boolean;
}): AdminBlogRouteContext {
  const params = useParams();
  const rawLocale = pickParam(params.locale);
  const rawPostId = pickParam(params.id);

  if (!rawLocale || !isLocale(rawLocale)) {
    notFound();
  }

  const locale: Locale = rawLocale;

  if (options?.requirePostId && !rawPostId) {
    notFound();
  }

  return {
    locale,
    messages: getMessages(locale),
    postId: rawPostId,
  };
}
