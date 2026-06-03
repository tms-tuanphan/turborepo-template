import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import {
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import {
  ApiErrorPayloadDto,
  AdminUserDto,
  AdminUserListQueryDto,
  AdminUserListResponseDto,
  CreateAdminUserDto,
  UpdateAdminUserDto,
} from '@repo/api';

import { Roles } from '../../auth/decorators/roles.decorator';
import type { AuthenticatedRequest } from '../../auth/interfaces/authenticated-request.interface';
import { AdminUsersService } from '../services/admin-users.service';

@ApiTags('Admin Users')
@Controller('admin/users')
@Roles('admin')
export class AdminUsersController {
  constructor(private readonly adminUsersService: AdminUsersService) {}

  @Get()
  @ApiCookieAuth('session')
  @ApiOperation({ summary: 'List active sub-admin users' })
  @ApiOkResponse({ type: AdminUserListResponseDto })
  @ApiUnauthorizedResponse({ type: ApiErrorPayloadDto })
  @ApiForbiddenResponse({ type: ApiErrorPayloadDto })
  async list(
    @Query() query: AdminUserListQueryDto,
  ): Promise<AdminUserListResponseDto> {
    return this.adminUsersService.findActiveList(query);
  }

  @Get('deleted')
  @ApiCookieAuth('session')
  @ApiOperation({ summary: 'List soft-deleted sub-admin users' })
  @ApiOkResponse({ type: AdminUserListResponseDto })
  @ApiUnauthorizedResponse({ type: ApiErrorPayloadDto })
  @ApiForbiddenResponse({ type: ApiErrorPayloadDto })
  async listDeleted(
    @Query() query: AdminUserListQueryDto,
  ): Promise<AdminUserListResponseDto> {
    return this.adminUsersService.findDeletedList(query);
  }

  @Get(':id')
  @ApiCookieAuth('session')
  @ApiOperation({ summary: 'Get a sub-admin user by id' })
  @ApiOkResponse({ type: AdminUserDto })
  @ApiNotFoundResponse({ type: ApiErrorPayloadDto })
  @ApiUnauthorizedResponse({ type: ApiErrorPayloadDto })
  @ApiForbiddenResponse({ type: ApiErrorPayloadDto })
  async findOne(@Param('id') id: string): Promise<AdminUserDto> {
    return this.adminUsersService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiCookieAuth('session')
  @ApiOperation({
    summary: 'Create a sub-admin user (admin only)',
    description: 'Always creates role `sub_admin`.',
  })
  @ApiCreatedResponse({ type: AdminUserDto })
  @ApiUnauthorizedResponse({ type: ApiErrorPayloadDto })
  @ApiForbiddenResponse({ type: ApiErrorPayloadDto })
  async create(@Body() dto: CreateAdminUserDto): Promise<AdminUserDto> {
    return this.adminUsersService.create(dto);
  }

  @Patch(':id')
  @ApiCookieAuth('session')
  @ApiOperation({ summary: 'Update a sub-admin user' })
  @ApiOkResponse({ type: AdminUserDto })
  @ApiNotFoundResponse({ type: ApiErrorPayloadDto })
  @ApiUnauthorizedResponse({ type: ApiErrorPayloadDto })
  @ApiForbiddenResponse({ type: ApiErrorPayloadDto })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateAdminUserDto,
  ): Promise<AdminUserDto> {
    return this.adminUsersService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiCookieAuth('session')
  @ApiOperation({ summary: 'Soft-delete a sub-admin user' })
  @ApiNoContentResponse({ description: 'User soft-deleted' })
  @ApiNotFoundResponse({ type: ApiErrorPayloadDto })
  @ApiUnauthorizedResponse({ type: ApiErrorPayloadDto })
  @ApiForbiddenResponse({ type: ApiErrorPayloadDto })
  async remove(
    @Param('id') id: string,
    @Req() req: AuthenticatedRequest,
  ): Promise<void> {
    return this.adminUsersService.softDelete(id, req.user.id);
  }

  @Post(':id/restore')
  @HttpCode(HttpStatus.OK)
  @ApiCookieAuth('session')
  @ApiOperation({ summary: 'Restore a soft-deleted sub-admin user' })
  @ApiOkResponse({ type: AdminUserDto })
  @ApiNotFoundResponse({ type: ApiErrorPayloadDto })
  @ApiUnauthorizedResponse({ type: ApiErrorPayloadDto })
  @ApiForbiddenResponse({ type: ApiErrorPayloadDto })
  async restore(@Param('id') id: string): Promise<AdminUserDto> {
    return this.adminUsersService.restore(id);
  }
}
