import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { BlogStatus, Prisma } from '@repo/database';

import {
  BLOG_FILTER_CATEGORY_ALL,
  BLOG_FILTER_STATUS_ALL,
  BLOG_LIST_DEFAULT_PAGE_SIZE,
  BLOG_STATUSES,
  I18nKey,
  PaginationQueryDto,
  type AdminBlogCheckSlugQueryDto,
  type AdminBlogCheckSlugResponseDto,
  type AdminBlogListQueryDto,
  type AdminBlogListResponseDto,
  type BlogDetailDto,
  type BlogListItemDto,
  type CreateAdminBlogDto,
  type UpdateAdminBlogDto,
} from '@repo/api';

import {
  buildPaginatedListResult,
  parsePaginationQuery,
  resolvePaginationSlice,
} from '../../common/pagination/parse-pagination';
import { PrismaService } from '../../prisma/prisma.service';
import type { AuthenticatedUser } from '../../auth/interfaces/authenticated-user.interface';

import {
  detailSelect,
  listSelect,
  toBlogDetailDto,
  toBlogListItemDto,
} from '../mappers/blogs.mapper';
import { isValidBlogSlug, normalizeBlogSlug } from '../utils/blogs-slug.util';

export type ParsedAdminBlogListQuery = {
  search: string;
  categoryId: typeof BLOG_FILTER_CATEGORY_ALL | string;
  status: typeof BLOG_FILTER_STATUS_ALL | BlogStatus;
  page: number;
  pageSize: number;
};

type BlogWriteInput = {
  title: string;
  slug: string;
  content: string;
  description: string;
  categoryId: string;
  status: BlogStatus;
  coverImage: string;
  primaryKeyword: string | null;
};

@Injectable()
export class BlogsService {
  constructor(private readonly prisma: PrismaService) {}

  parseAdminBlogListQuery(
    raw: AdminBlogListQueryDto,
  ): ParsedAdminBlogListQuery {
    const search =
      typeof raw.search === 'string' ? raw.search.trim().slice(0, 120) : '';

    const categoryId =
      typeof raw.category === 'string' && raw.category.trim().length > 0
        ? raw.category.trim()
        : BLOG_FILTER_CATEGORY_ALL;

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
      categoryId,
      status: statusRaw,
      page,
      pageSize,
    };
  }

  async findAdminList(
    rawQuery: AdminBlogListQueryDto,
  ): Promise<AdminBlogListResponseDto> {
    const query = this.parseAdminBlogListQuery(rawQuery);
    const where = await this.buildAdminListWhere(query);
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
      rows.map((row) => toBlogListItemDto(row)) as BlogListItemDto[],
      slice,
      totalItems as number,
    );
  }

  async findAdminById(id: string): Promise<BlogDetailDto> {
    const row = await this.prisma.blog.findFirst({
      where: { id, deletedAt: null },
      select: detailSelect,
    });
    if (!row) {
      throw new NotFoundException(I18nKey.Errors.Common.NotFound);
    }
    return toBlogDetailDto(row);
  }

  async checkSlug(
    query: AdminBlogCheckSlugQueryDto,
  ): Promise<AdminBlogCheckSlugResponseDto> {
    const slug = this.resolveSlug(query.slug);
    const excludeId =
      typeof query.excludeId === 'string' ? query.excludeId.trim() : '';
    const taken = await this.isSlugTaken(slug, excludeId || undefined);
    return { available: !taken };
  }

  async createAdmin(
    dto: CreateAdminBlogDto,
    user: AuthenticatedUser,
  ): Promise<BlogDetailDto> {
    const input = await this.parseCreateDto(dto);
    if (await this.isSlugTaken(input.slug)) {
      throw new ConflictException(I18nKey.Errors.Common.Conflict);
    }

    const author = user.email.trim() || 'Admin';
    const publishedAt = this.resolvePublishedAt(null, input.status);

    const row = await this.prisma.blog.create({
      data: {
        slug: input.slug,
        title: input.title,
        description: input.description,
        content: input.content,
        categoryId: input.categoryId,
        status: input.status,
        coverImage: input.coverImage,
        author,
        publishedAt,
        seoMetaTitle: input.title.slice(0, 60),
        seoMetaDescription: input.description.slice(0, 160),
        seoPrimaryKeyword: input.primaryKeyword,
      },
      select: detailSelect,
    });

    return toBlogDetailDto(row);
  }

  async updateAdmin(
    id: string,
    dto: UpdateAdminBlogDto,
  ): Promise<BlogDetailDto> {
    const existing = await this.prisma.blog.findFirst({
      where: { id, deletedAt: null },
    });
    if (!existing) {
      throw new NotFoundException(I18nKey.Errors.Common.NotFound);
    }

    const merged = await this.mergeUpdate(existing, dto);
    if (await this.isSlugTaken(merged.slug, id)) {
      throw new ConflictException(I18nKey.Errors.Common.Conflict);
    }

    const publishedAt = this.resolvePublishedAt(
      existing.publishedAt,
      merged.status,
      existing.status,
    );

    const row = await this.prisma.blog.update({
      where: { id },
      data: {
        slug: merged.slug,
        title: merged.title,
        description: merged.description,
        content: merged.content,
        categoryId: merged.categoryId,
        status: merged.status,
        coverImage: merged.coverImage,
        publishedAt,
        seoMetaTitle: merged.title.slice(0, 60),
        seoMetaDescription: merged.description.slice(0, 160),
        seoPrimaryKeyword: merged.primaryKeyword,
      },
      select: detailSelect,
    });

    return toBlogDetailDto(row);
  }

  async softDeleteAdmin(id: string): Promise<void> {
    const existing = await this.prisma.blog.findFirst({
      where: { id, deletedAt: null },
      select: { id: true },
    });
    if (!existing) {
      throw new NotFoundException(I18nKey.Errors.Common.NotFound);
    }

    await this.prisma.blog.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  private async buildAdminListWhere(
    query: ParsedAdminBlogListQuery,
  ): Promise<Prisma.BlogWhereInput> {
    const and: Prisma.BlogWhereInput[] = [{ deletedAt: null }];

    if (query.categoryId !== BLOG_FILTER_CATEGORY_ALL) {
      const categoryId = query.categoryId.trim();
      if (categoryId.length === 0) {
        throw new BadRequestException(I18nKey.Errors.Common.BadRequest);
      }
      and.push({ categoryId });
    }

    if (query.status !== BLOG_FILTER_STATUS_ALL) {
      and.push({ status: query.status });
    }

    if (query.search.length > 0) {
      const search = query.search;
      and.push({
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
          { slug: { contains: search, mode: 'insensitive' } },
          { author: { contains: search, mode: 'insensitive' } },
        ],
      });
    }

    return { AND: and };
  }

  private async parseCreateDto(
    dto: CreateAdminBlogDto,
  ): Promise<BlogWriteInput> {
    const title = this.requireTrimmedString(dto.title, 'title', 200);
    const slug = this.resolveSlug(dto.slug);
    const content = typeof dto.content === 'string' ? dto.content : '';
    const description = this.trimOptional(dto.description, 200);
    const categoryId = await this.resolveCategoryId(dto.categoryId);
    const status = this.parseStatus(dto.status);
    const coverImage = typeof dto.coverImage === 'string' ? dto.coverImage : '';
    const primaryKeyword =
      this.trimOptional(dto.primaryKeyword ?? '', 60) || null;

    this.assertWriteRules({ content, status });

    return {
      title,
      slug,
      content,
      description,
      categoryId,
      status,
      coverImage,
      primaryKeyword,
    };
  }

  private async mergeUpdate(
    existing: {
      title: string;
      slug: string;
      content: string;
      description: string;
      categoryId: string;
      status: BlogStatus;
      coverImage: string;
      seoPrimaryKeyword: string | null;
    },
    dto: UpdateAdminBlogDto,
  ): Promise<BlogWriteInput> {
    const title =
      dto.title !== undefined
        ? this.requireTrimmedString(dto.title, 'title', 200)
        : existing.title;
    const slug =
      dto.slug !== undefined ? this.resolveSlug(dto.slug) : existing.slug;
    const content = dto.content !== undefined ? dto.content : existing.content;
    const description =
      dto.description !== undefined
        ? this.trimOptional(dto.description, 200)
        : existing.description;
    const categoryId =
      dto.categoryId !== undefined
        ? await this.resolveCategoryId(dto.categoryId)
        : existing.categoryId;
    const status =
      dto.status !== undefined ? this.parseStatus(dto.status) : existing.status;
    const coverImage =
      dto.coverImage !== undefined ? dto.coverImage : existing.coverImage;
    const primaryKeyword =
      dto.primaryKeyword !== undefined
        ? this.trimOptional(dto.primaryKeyword ?? '', 60) || null
        : existing.seoPrimaryKeyword;

    this.assertWriteRules({ content, status });

    return {
      title,
      slug,
      content,
      description,
      categoryId,
      status,
      coverImage,
      primaryKeyword,
    };
  }

  private assertWriteRules(input: {
    content: string;
    status: BlogStatus;
  }): void {
    if (
      input.status === BlogStatus.PUBLISHED &&
      input.content.trim().length === 0
    ) {
      throw new BadRequestException(I18nKey.Errors.Common.BadRequest);
    }
  }

  private resolvePublishedAt(
    existingPublishedAt: Date | null,
    nextStatus: BlogStatus,
    previousStatus?: BlogStatus,
  ): Date | null {
    if (nextStatus === BlogStatus.PUBLISHED) {
      if (
        previousStatus !== undefined &&
        previousStatus !== BlogStatus.PUBLISHED
      ) {
        return existingPublishedAt ?? new Date();
      }
      return existingPublishedAt ?? new Date();
    }
    return existingPublishedAt;
  }

  private resolveSlug(raw: string): string {
    const slug = normalizeBlogSlug(raw);
    if (!isValidBlogSlug(slug)) {
      throw new BadRequestException(I18nKey.Errors.Common.BadRequest);
    }
    return slug;
  }

  private async isSlugTaken(
    slug: string,
    excludeId?: string,
  ): Promise<boolean> {
    const row = await this.prisma.blog.findFirst({
      where: {
        slug,
        deletedAt: null,
        ...(excludeId ? { NOT: { id: excludeId } } : {}),
      },
      select: { id: true },
    });
    return row !== null;
  }

  private async resolveCategoryId(categoryId: unknown): Promise<string> {
    if (typeof categoryId !== 'string' || categoryId.trim().length === 0) {
      throw new BadRequestException(I18nKey.Errors.Common.BadRequest);
    }
    const row = await this.prisma.blogCategory.findUnique({
      where: { id: categoryId.trim() },
      select: { id: true },
    });
    if (!row) {
      throw new BadRequestException(I18nKey.Errors.Common.BadRequest);
    }
    return row.id;
  }

  private parseStatus(value: unknown): BlogStatus {
    if (
      typeof value === 'string' &&
      (BLOG_STATUSES as readonly string[]).includes(value)
    ) {
      return value as BlogStatus;
    }
    throw new BadRequestException(I18nKey.Errors.Common.BadRequest);
  }

  private requireTrimmedString(
    value: unknown,
    _field: string,
    maxLen: number,
  ): string {
    if (typeof value !== 'string') {
      throw new BadRequestException(I18nKey.Errors.Common.BadRequest);
    }
    const trimmed = value.trim();
    if (trimmed.length === 0 || trimmed.length > maxLen) {
      throw new BadRequestException(I18nKey.Errors.Common.BadRequest);
    }
    return trimmed;
  }

  private trimOptional(value: unknown, maxLen: number): string {
    if (typeof value !== 'string') {
      return '';
    }
    return value.trim().slice(0, maxLen);
  }
}
