import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import {
  I18nKey,
  type BlogCategoryDto,
  type CreateBlogCategoryDto,
  type UpdateBlogCategoryDto,
} from '@repo/api';

import { PrismaService } from '../../prisma/prisma.service';

import { isValidBlogSlug, normalizeBlogSlug } from '../utils/blogs-slug.util';

@Injectable()
export class BlogCategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<BlogCategoryDto[]> {
    const rows = await this.prisma.blogCategory.findMany({
      orderBy: [{ sortOrder: 'asc' }, { slug: 'asc' }],
    });
    return rows.map((row) => this.toDto(row));
  }

  async create(dto: CreateBlogCategoryDto): Promise<BlogCategoryDto> {
    const slug = this.resolveCategorySlug(dto.slug);
    const nameKey = this.requireTrimmedString(dto.nameKey, 120);
    const sortOrder =
      typeof dto.sortOrder === 'number' && Number.isFinite(dto.sortOrder)
        ? Math.trunc(dto.sortOrder)
        : 0;

    const existing = await this.prisma.blogCategory.findUnique({
      where: { slug },
    });
    if (existing) {
      throw new ConflictException(I18nKey.Errors.Common.Conflict);
    }

    const row = await this.prisma.blogCategory.create({
      data: { slug, nameKey, sortOrder },
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

    const slug =
      dto.slug !== undefined
        ? this.resolveCategorySlug(dto.slug)
        : existing.slug;

    if (slug !== existing.slug) {
      const taken = await this.prisma.blogCategory.findUnique({
        where: { slug },
      });
      if (taken) {
        throw new ConflictException(I18nKey.Errors.Common.Conflict);
      }
    }

    const row = await this.prisma.blogCategory.update({
      where: { id },
      data: {
        slug,
        ...(dto.nameKey !== undefined
          ? { nameKey: this.requireTrimmedString(dto.nameKey, 120) }
          : {}),
        ...(dto.sortOrder !== undefined && Number.isFinite(dto.sortOrder)
          ? { sortOrder: Math.trunc(dto.sortOrder) }
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

  private resolveCategorySlug(raw: string): string {
    const slug = normalizeBlogSlug(raw);
    if (!isValidBlogSlug(slug)) {
      throw new BadRequestException(I18nKey.Errors.Common.BadRequest);
    }
    return slug;
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
    slug: string;
    nameKey: string;
    sortOrder: number;
    createdAt: Date;
    updatedAt: Date;
  }): BlogCategoryDto {
    return {
      id: row.id,
      slug: row.slug,
      nameKey: row.nameKey,
      sortOrder: row.sortOrder,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
    };
  }
}
