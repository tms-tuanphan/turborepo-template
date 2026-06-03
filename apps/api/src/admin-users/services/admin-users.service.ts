import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserRole, UserStatus } from '@repo/database';

import {
  I18nKey,
  type AdminUserDto,
  type AdminUserListQueryDto,
  type AdminUserListResponseDto,
  type CreateAdminUserDto,
  type UpdateAdminUserDto,
} from '@repo/api';

import {
  isValidPassword,
  registerRequestSchema,
} from '@repo/shared-validation';

import {
  buildPaginatedListResult,
  parsePaginationQuery,
  resolvePaginationSlice,
} from '../../common/pagination/parse-pagination';
import { PrismaService } from '../../prisma/prisma.service';

const BCRYPT_ROUNDS = 10;

const userListSelect = {
  id: true,
  email: true,
  role: true,
  status: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
} as const;

@Injectable()
export class AdminUsersService {
  private readonly logger = new Logger(AdminUsersService.name);

  constructor(private readonly prisma: PrismaService) {}

  async findActiveList(
    rawQuery: AdminUserListQueryDto,
  ): Promise<AdminUserListResponseDto> {
    return this.findList(rawQuery, { deletedAt: null });
  }

  async findDeletedList(
    rawQuery: AdminUserListQueryDto,
  ): Promise<AdminUserListResponseDto> {
    return this.findList(rawQuery, { deletedAt: { not: null } });
  }

  async findOne(id: string): Promise<AdminUserDto> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: userListSelect,
    });

    if (!user || user.deletedAt) {
      throw new NotFoundException(I18nKey.Errors.Common.NotFound);
    }

    if (user.role !== UserRole.sub_admin) {
      throw new ForbiddenException(I18nKey.Errors.Common.Forbidden);
    }

    return this.toDto(user);
  }

  async create(dto: CreateAdminUserDto): Promise<AdminUserDto> {
    const parsed = registerRequestSchema.safeParse({
      email: dto.email,
      password: dto.password,
    });

    if (!parsed.success) {
      throw new BadRequestException(I18nKey.Errors.Auth.WeakPassword);
    }

    const email = parsed.data.email.trim().toLowerCase();

    const existing = await this.prisma.user.findUnique({
      where: { email },
      select: { id: true, deletedAt: true },
    });

    if (existing && !existing.deletedAt) {
      throw new ConflictException(I18nKey.Errors.Auth.EmailAlreadyExists);
    }

    const hashedPassword = await bcrypt.hash(
      parsed.data.password as string,
      BCRYPT_ROUNDS,
    );

    if (existing?.deletedAt) {
      const restored = await this.prisma.user.update({
        where: { id: existing.id },
        data: {
          email,
          password: hashedPassword,
          role: UserRole.sub_admin,
          status: UserStatus.active,
          deletedAt: null,
        },
        select: userListSelect,
      });
      this.logger.log(`User re-created from soft-deleted: ${restored.id}`);
      return this.toDto(restored);
    }

    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: UserRole.sub_admin,
        status: UserStatus.active,
      },
      select: userListSelect,
    });

    this.logger.log(`Admin created sub_admin user: ${user.id}`);

    return this.toDto(user);
  }

  async update(id: string, dto: UpdateAdminUserDto): Promise<AdminUserDto> {
    const existing = await this.prisma.user.findUnique({
      where: { id },
      select: userListSelect,
    });

    if (!existing || existing.deletedAt) {
      throw new NotFoundException(I18nKey.Errors.Common.NotFound);
    }

    if (existing.role !== UserRole.sub_admin) {
      throw new ForbiddenException(I18nKey.Errors.Common.Forbidden);
    }

    const data: {
      email?: string;
      status?: UserStatus;
      password?: string;
    } = {};

    if (dto.email !== undefined) {
      const email = dto.email.trim().toLowerCase();
      if (!email) {
        throw new BadRequestException(I18nKey.Errors.Common.BadRequest);
      }
      const conflict = await this.prisma.user.findFirst({
        where: {
          email,
          id: { not: id },
          deletedAt: null,
        },
        select: { id: true },
      });
      if (conflict) {
        throw new ConflictException(I18nKey.Errors.Auth.EmailAlreadyExists);
      }
      data.email = email;
    }

    if (dto.status !== undefined) {
      data.status =
        dto.status === UserStatus.disabled
          ? UserStatus.disabled
          : UserStatus.active;
    }

    if (dto.password !== undefined) {
      if (!isValidPassword(dto.password)) {
        throw new BadRequestException(I18nKey.Errors.Auth.WeakPassword);
      }
      data.password = await bcrypt.hash(dto.password, BCRYPT_ROUNDS);
    }

    const updated = await this.prisma.user.update({
      where: { id },
      data,
      select: userListSelect,
    });

    return this.toDto(updated);
  }

  async softDelete(id: string, actorId: string): Promise<void> {
    if (id === actorId) {
      throw new ForbiddenException(I18nKey.Errors.Common.Forbidden);
    }

    const existing = await this.prisma.user.findUnique({
      where: { id },
      select: { id: true, deletedAt: true, role: true },
    });

    if (!existing || existing.deletedAt) {
      throw new NotFoundException(I18nKey.Errors.Common.NotFound);
    }

    if (existing.role !== UserRole.sub_admin) {
      throw new ForbiddenException(I18nKey.Errors.Common.Forbidden);
    }

    await this.prisma.user.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async restore(id: string): Promise<AdminUserDto> {
    const existing = await this.prisma.user.findUnique({
      where: { id },
      select: userListSelect,
    });

    if (!existing || !existing.deletedAt) {
      throw new NotFoundException(I18nKey.Errors.Common.NotFound);
    }

    if (existing.role !== UserRole.sub_admin) {
      throw new ForbiddenException(I18nKey.Errors.Common.Forbidden);
    }

    const restored = await this.prisma.user.update({
      where: { id },
      data: { deletedAt: null, status: UserStatus.active },
      select: userListSelect,
    });

    return this.toDto(restored);
  }

  private async findList(
    rawQuery: AdminUserListQueryDto,
    deletedFilter: { deletedAt: null } | { deletedAt: { not: null } },
  ): Promise<AdminUserListResponseDto> {
    const pagination = parsePaginationQuery(rawQuery);
    const where = { ...deletedFilter, role: UserRole.sub_admin };

    const totalItems = await this.prisma.user.count({ where });
    const slice = resolvePaginationSlice(pagination, totalItems);

    const rows = await this.prisma.user.findMany({
      where,
      orderBy: [{ createdAt: 'desc' }],
      skip: slice.skip,
      take: slice.take,
      select: userListSelect,
    });

    return buildPaginatedListResult(
      rows.map((row) => this.toDto(row)),
      slice,
      totalItems,
    );
  }

  private toDto(row: {
    id: string;
    email: string;
    role: UserRole;
    status: UserStatus;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
  }): AdminUserDto {
    return {
      id: row.id,
      email: row.email,
      role: row.role === UserRole.sub_admin ? 'sub_admin' : 'admin',
      status: row.status === UserStatus.disabled ? 'disabled' : 'active',
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
      deletedAt: row.deletedAt?.toISOString() ?? null,
    };
  }
}
