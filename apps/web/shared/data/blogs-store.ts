import type { BlogPost } from '@/shared/types/blog';
import { slugify } from '@/shared/utils/slugify';

import { mockBlogs } from './mock-blogs';

const store = new Map<string, BlogPost>();
let seeded = false;

function seedStore(): void {
  if (seeded) {
    return;
  }
  for (const post of mockBlogs) {
    store.set(post.id, { ...post });
  }
  seeded = true;
}

function ensureUniqueSlug(candidate: string, excludeId?: string): string {
  seedStore();
  let slug = candidate;
  let n = 1;
  while (
    Array.from(store.values()).some(
      (p) => p.slug === slug && p.id !== excludeId,
    )
  ) {
    slug = `${candidate}-${n}`;
    n += 1;
  }
  return slug;
}

export function listAllBlogs(): BlogPost[] {
  seedStore();
  return Array.from(store.values()).sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  );
}

export function listPublishedBlogs(): BlogPost[] {
  return listAllBlogs().filter(
    (p) => p.status === 'PUBLISHED' && p.publishedAt !== null,
  );
}

export function getBlogById(id: string): BlogPost | undefined {
  seedStore();
  return store.get(id);
}

export function getBlogBySlug(slug: string): BlogPost | undefined {
  seedStore();
  return listAllBlogs().find((p) => p.slug === slug);
}

export type NewBlogPayload = Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>;

export function createBlogInStore(payload: NewBlogPayload): string {
  seedStore();
  const id = globalThis.crypto.randomUUID();
  const now = new Date().toISOString();
  const slug = ensureUniqueSlug(slugify(payload.slug));
  const post: BlogPost = {
    ...payload,
    id,
    slug,
    views: payload.views,
    createdAt: now,
    updatedAt: now,
  };
  store.set(id, post);
  return id;
}

export function updateBlogInStore(
  id: string,
  payload: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>,
): boolean {
  seedStore();
  const existing = store.get(id);
  if (!existing) {
    return false;
  }
  const now = new Date().toISOString();
  const updated: BlogPost = {
    ...existing,
    ...payload,
    id,
    slug: payload.slug,
    createdAt: existing.createdAt,
    updatedAt: now,
  };
  store.set(id, updated);
  return true;
}

export function deleteBlogInStore(id: string): boolean {
  seedStore();
  return store.delete(id);
}
