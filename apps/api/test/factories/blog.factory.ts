import { BlogStatus } from '@repo/database';

import type { BlogDetailRow } from '../../src/blogs/blogs.mapper';

/**
 * Factory for Blog Prisma rows used in blogs service tests.
 */
export class BlogFactory {
  static createDetailRow(overrides?: Partial<BlogDetailRow>): BlogDetailRow {
    const now = new Date('2026-01-15T10:00:00.000Z');
    const defaultRow: BlogDetailRow = {
      id: 'blog-1',
      slug: 'sample-post',
      title: 'Sample Post',
      description: 'Short excerpt',
      content: 'Full markdown body',
      categoryId: 'cat_it_partnership',
      category: {
        id: 'cat_it_partnership',
        slug: 'it-partnership',
        nameKey: 'blogs.categories.it_partnership',
      },
      status: BlogStatus.UNPUBLISHED,
      coverImage: 'https://example.com/cover.jpg',
      author: 'admin@example.com',
      views: 0,
      publishedAt: null,
      createdAt: now,
      updatedAt: now,
      seoMetaTitle: 'Sample Post',
      seoMetaDescription: 'Short excerpt',
      seoPrimaryKeyword: null,
    };

    return { ...defaultRow, ...overrides };
  }

  static createPublished(overrides?: Partial<BlogDetailRow>): BlogDetailRow {
    return this.createDetailRow({
      status: BlogStatus.PUBLISHED,
      publishedAt: new Date('2026-01-10T12:00:00.000Z'),
      ...overrides,
    });
  }
}
