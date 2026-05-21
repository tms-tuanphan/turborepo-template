import { BadRequestException, Injectable } from '@nestjs/common';
import { BlogCategory, BlogStatus, Prisma } from '@repo/database';

import {
  BLOG_CATEGORIES,
  BLOG_FILTER_CATEGORY_ALL,
  BLOG_FILTER_STATUS_ALL,
  BLOG_LIST_DEFAULT_PAGE_SIZE,
  BLOG_STATUSES,
  I18nKey,
  PaginationQueryDto,
  type AdminBlogListQueryDto,
  type AdminBlogListResponseDto,
  type BlogListItemDto,
} from '@repo/api';

import {
  buildPaginatedListResult,
  parsePaginationQuery,
  resolvePaginationSlice,
} from '../common/pagination/parse-pagination';
import { PrismaService } from '../prisma/prisma.service';

const listSelect = {
  id: true,
  slug: true,
  title: true,
  description: true,
  category: true,
  tags: true,
  status: true,
  coverImage: true,
  author: true,
  views: true,
  publishedAt: true,
  scheduledAt: true,
  createdAt: true,
  updatedAt: true,
  seoMetaTitle: true,
  seoMetaDescription: true,
  seoPrimaryKeyword: true,
} satisfies Prisma.BlogSelect;

type BlogListRow = Prisma.BlogGetPayload<{ select: typeof listSelect }>;

export type ParsedAdminBlogListQuery = {
  search: string;
  category: typeof BLOG_FILTER_CATEGORY_ALL | BlogCategory;
  status: typeof BLOG_FILTER_STATUS_ALL | BlogStatus;
  page: number;
  pageSize: number;
};

@Injectable()
export class BlogsService {
  constructor(private readonly prisma: PrismaService) {}

  parseAdminBlogListQuery(
    raw: AdminBlogListQueryDto,
  ): ParsedAdminBlogListQuery {
    const search =
      typeof raw.search === 'string' ? raw.search.trim().slice(0, 120) : '';

    const categoryRaw = raw.category ?? BLOG_FILTER_CATEGORY_ALL;
    if (
      categoryRaw !== BLOG_FILTER_CATEGORY_ALL &&
      !(BLOG_CATEGORIES as readonly string[]).includes(categoryRaw as string)
    ) {
      throw new BadRequestException(I18nKey.Errors.Common.BadRequest);
    }

    const statusRaw = raw.status ?? BLOG_FILTER_STATUS_ALL;
    if (
      statusRaw !== BLOG_FILTER_STATUS_ALL &&
      !(BLOG_STATUSES as readonly string[]).includes(statusRaw as string)
    ) {
      throw new BadRequestException(I18nKey.Errors.Common.BadRequest);
    }

    const { page, pageSize } = parsePaginationQuery(
      raw as Pick<PaginationQueryDto, 'page' | 'pageSize'>,
      {
        defaultPageSize: BLOG_LIST_DEFAULT_PAGE_SIZE,
      },
    );

    return {
      search,
      category: categoryRaw,
      status: statusRaw,
      page,
      pageSize,
    };
  }

  async findAdminList(
    rawQuery: AdminBlogListQueryDto,
  ): Promise<AdminBlogListResponseDto> {
    const query = this.parseAdminBlogListQuery(rawQuery);
    const where = this.buildAdminListWhere(query);
    const orderBy: Prisma.BlogOrderByWithRelationInput = {
      updatedAt: 'desc',
    };

    const totalItems = await this.prisma.blog.count({ where });
    const slice = resolvePaginationSlice(
      { page: query.page, pageSize: query.pageSize },
      totalItems as number,
    );

    const rows = await this.prisma.blog.findMany({
      where,
      orderBy,
      skip: slice.skip,
      take: slice.take,
      select: listSelect,
    });

    return buildPaginatedListResult(
      rows.map((row) => this.toListItemDto(row)) as BlogListItemDto[],
      slice,
      totalItems as number,
    );
  }

  private buildAdminListWhere(
    query: ParsedAdminBlogListQuery,
  ): Prisma.BlogWhereInput {
    const and: Prisma.BlogWhereInput[] = [{ deletedAt: null }];

    if (query.category !== BLOG_FILTER_CATEGORY_ALL) {
      and.push({ category: query.category });
    }

    if (query.status !== BLOG_FILTER_STATUS_ALL) {
      and.push({ status: query.status });
    }

    if (query.search.length > 0) {
      const search = query.search;
      const tagTokens = search.split(/\s+/).filter(Boolean);
      const or: Prisma.BlogWhereInput[] = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { slug: { contains: search, mode: 'insensitive' } },
        { author: { contains: search, mode: 'insensitive' } },
      ];

      for (const token of tagTokens) {
        or.push({ tags: { has: token } });
      }

      and.push({ OR: or });
    }

    return { AND: and };
  }

  private toListItemDto(row: BlogListRow): BlogListItemDto {
    const seo: BlogListItemDto['seo'] = {
      metaTitle: row.seoMetaTitle,
      metaDescription: row.seoMetaDescription,
    };
    if (row.seoPrimaryKeyword) {
      seo.primaryKeyword = row.seoPrimaryKeyword;
    }

    return {
      id: row.id,
      slug: row.slug,
      title: row.title,
      description: row.description,
      category: row.category,
      tags: row.tags,
      status: row.status,
      coverImage: row.coverImage,
      author: row.author,
      views: row.views,
      publishedAt: row.publishedAt?.toISOString() ?? null,
      scheduledAt: row.scheduledAt?.toISOString() ?? null,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
      seo,
    };
  }
}
