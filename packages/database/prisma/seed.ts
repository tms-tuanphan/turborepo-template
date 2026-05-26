import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcrypt';

import {
  BlogStatus,
  PrismaClient,
  UserRole,
  UserStatus,
} from '../src/generated/prisma/client';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL is required for seed');
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});

const DEFAULT_CATEGORIES = [
  {
    id: 'cat_it_partnership',
    slug: 'it-partnership',
    nameKey: 'blogs.categories.it_partnership',
    sortOrder: 1,
  },
  {
    id: 'cat_daas',
    slug: 'daas',
    nameKey: 'blogs.categories.daas',
    sortOrder: 2,
  },
  {
    id: 'cat_ai',
    slug: 'ai',
    nameKey: 'blogs.categories.ai',
    sortOrder: 3,
  },
] as const;

async function main(): Promise<void> {
  const email = process.env.ADMIN_SEED_EMAIL;
  const password = process.env.ADMIN_SEED_PASSWORD;

  if (!email || !password) {
    console.warn(
      '[seed] Skip: set ADMIN_SEED_EMAIL and ADMIN_SEED_PASSWORD to create admin user.',
    );
    return;
  }

  const hashed = await bcrypt.hash(password, 12);

  await prisma.user.upsert({
    where: { email },
    update: {
      password: hashed,
      role: UserRole.admin,
      status: UserStatus.active,
    },
    create: {
      email,
      password: hashed,
      role: UserRole.admin,
      status: UserStatus.active,
    },
  });

  console.log(`[seed] Admin user ready: ${email}`);

  for (const cat of DEFAULT_CATEGORIES) {
    await prisma.blogCategory.upsert({
      where: { slug: cat.slug },
      update: {
        nameKey: cat.nameKey,
        sortOrder: cat.sortOrder,
      },
      create: {
        id: cat.id,
        slug: cat.slug,
        nameKey: cat.nameKey,
        sortOrder: cat.sortOrder,
      },
    });
  }

  const demoPosts = [
    {
      slug: 'optimise-roi-software-development',
      title:
        'Optimise ROI in software development: Why is quality the most economical investment?',
      description:
        'Choosing a technology partner is a strategic decision focused on long-term TCO.',
      categoryId: 'cat_it_partnership',
      status: BlogStatus.PUBLISHED,
      coverImage: 'https://picsum.photos/seed/dxodx-1/1200/630',
      author: 'Demo Author',
      publishedAt: new Date('2026-02-26T12:00:00.000Z'),
    },
    {
      slug: 'event-driven-architecture-ecommerce',
      title: 'Event-Driven Architecture for high-load e-commerce',
      description: 'How EDA helps systems survive peak sale seasons.',
      categoryId: 'cat_it_partnership',
      status: BlogStatus.PUBLISHED,
      coverImage: 'https://picsum.photos/seed/dxodx-2/1200/630',
      author: 'Demo Author',
      publishedAt: new Date('2026-02-24T12:00:00.000Z'),
    },
    {
      slug: 'draft-ai-roadmap',
      title: 'AI roadmap draft',
      description: 'Work in progress on AI strategy.',
      categoryId: 'cat_ai',
      status: BlogStatus.UNPUBLISHED,
      coverImage: '',
      author: 'Demo Author',
      publishedAt: null,
    },
  ] as const;

  for (const post of demoPosts) {
    await prisma.blog.upsert({
      where: { slug: post.slug },
      update: {
        title: post.title,
        description: post.description,
        categoryId: post.categoryId,
        status: post.status,
        coverImage: post.coverImage,
        author: post.author,
        publishedAt: post.publishedAt,
        seoMetaTitle: post.title.slice(0, 70),
        seoMetaDescription: post.description.slice(0, 160),
      },
      create: {
        slug: post.slug,
        title: post.title,
        description: post.description,
        content: '# Demo content\n\nSeeded for local development.',
        categoryId: post.categoryId,
        status: post.status,
        coverImage: post.coverImage,
        author: post.author,
        publishedAt: post.publishedAt,
        seoMetaTitle: post.title.slice(0, 70),
        seoMetaDescription: post.description.slice(0, 160),
      },
    });
  }

  console.log(`[seed] ${demoPosts.length} demo blog posts ready`);
}

main()
  .catch((error: unknown) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
