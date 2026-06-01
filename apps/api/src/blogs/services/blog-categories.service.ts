import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import {
  I18nKey,
  type AdminBlogCategoryListQueryDto,
  type AdminBlogCategoryListResponseDto,
  type BlogCategoryDto,
  type CreateBlogCategoryDto,
  type UpdateBlogCategoryDto,
} from '@repo/api';

import {
  buildPaginatedListResult,
  parsePaginationQuery,
  resolvePaginationSlice,
} from '../../common/pagination/parse-pagination';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class BlogCategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAdminList(
    rawQuery: AdminBlogCategoryListQueryDto,
  ): Promise<AdminBlogCategoryListResponseDto> {
    const pagination = parsePaginationQuery(rawQuery);

    const totalItems = await this.prisma.blogCategory.count();
    const slice = resolvePaginationSlice(pagination, totalItems);

    const rows = await this.prisma.blogCategory.findMany({
      orderBy: [{ displayName: 'asc' }],
      skip: slice.skip,
      take: slice.take,
    });

    return buildPaginatedListResult(
      rows.map((row) => this.toDto(row)),
      slice,
      totalItems,
    );
  }

  async findAll(): Promise<BlogCategoryDto[]> {
    const rows = await this.prisma.blogCategory.findMany({
      orderBy: [{ displayName: 'asc' }],
    });
    return rows.map((row) => this.toDto(row));
  }

  async create(dto: CreateBlogCategoryDto): Promise<BlogCategoryDto> {
    const displayName = this.requireTrimmedString(dto.displayName, 120);

    const row = await this.prisma.blogCategory.create({
      data: { displayName },
    });
    return this.toDto(row);
  }

  async update(
    id: string,
    dto: UpdateBlogCategoryDto,
  ): Promise<BlogCategoryDto> {
    const existing = await this.prisma.blogCategory.findUnique({
      where: { id },
    });
    if (!existing) {
      throw new NotFoundException(I18nKey.Errors.Common.NotFound);
    }

    const row = await this.prisma.blogCategory.update({
      where: { id },
      data: {
        ...(dto.displayName !== undefined
          ? { displayName: this.requireTrimmedString(dto.displayName, 120) }
          : {}),
      },
    });
    return this.toDto(row);
  }

  async remove(id: string): Promise<void> {
    const existing = await this.prisma.blogCategory.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!existing) {
      throw new NotFoundException(I18nKey.Errors.Common.NotFound);
    }

    const blogCount = await this.prisma.blog.count({
      where: { categoryId: id, deletedAt: null },
    });
    if (blogCount > 0) {
      throw new ConflictException(I18nKey.Errors.Blogs.CategoryInUse);
    }

    await this.prisma.blogCategory.delete({ where: { id } });
  }

  private requireTrimmedString(value: unknown, maxLen: number): string {
    if (typeof value !== 'string') {
      throw new BadRequestException(I18nKey.Errors.Common.BadRequest);
    }
    const trimmed = value.trim();
    if (trimmed.length === 0 || trimmed.length > maxLen) {
      throw new BadRequestException(I18nKey.Errors.Common.BadRequest);
    }
    return trimmed;
  }

  private toDto(row: {
    id: string;
    displayName: string;
    createdAt: Date;
    updatedAt: Date;
  }): BlogCategoryDto {
    return {
      id: row.id,
      displayName: row.displayName,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
    };
  }
}
