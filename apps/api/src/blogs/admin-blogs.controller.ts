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
  ApiConflictResponse,
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
  AdminBlogCheckSlugQueryDto,
  AdminBlogCheckSlugResponseDto,
  AdminBlogListQueryDto,
  AdminBlogListResponseDto,
  ApiErrorPayloadDto,
  BlogDetailDto,
  CreateAdminBlogDto,
  UpdateAdminBlogDto,
} from '@repo/api';

import { Roles } from '../auth/decorators/roles.decorator';
import type { AuthenticatedRequest } from '../auth/interfaces/authenticated-request.interface';
import { BlogsService } from './blogs.service';

@ApiTags('Admin Blogs')
@Controller('admin/blogs')
@Roles('admin', 'sub_admin')
export class AdminBlogsController {
  constructor(private readonly blogsService: BlogsService) {}

  @Get()
  @ApiCookieAuth('session')
  @ApiOperation({
    summary: 'List blogs for admin CMS',
    description:
      'Paginated list with search, category, and status filters. List items omit post content.',
  })
  @ApiOkResponse({ type: AdminBlogListResponseDto })
  @ApiUnauthorizedResponse({
    description: 'Missing or invalid session cookie',
    type: ApiErrorPayloadDto,
  })
  @ApiForbiddenResponse({
    description: 'Insufficient role',
    type: ApiErrorPayloadDto,
  })
  async list(
    @Query() query: AdminBlogListQueryDto,
  ): Promise<AdminBlogListResponseDto> {
    return this.blogsService.findAdminList(query);
  }

  @Get('check-slug')
  @ApiCookieAuth('session')
  @ApiOperation({ summary: 'Check whether a blog slug is available' })
  @ApiOkResponse({ type: AdminBlogCheckSlugResponseDto })
  @ApiUnauthorizedResponse({ type: ApiErrorPayloadDto })
  @ApiForbiddenResponse({ type: ApiErrorPayloadDto })
  async checkSlug(
    @Query() query: AdminBlogCheckSlugQueryDto,
  ): Promise<AdminBlogCheckSlugResponseDto> {
    return this.blogsService.checkSlug(query);
  }

  @Get(':id')
  @ApiCookieAuth('session')
  @ApiOperation({ summary: 'Get a single blog post for editing' })
  @ApiOkResponse({ type: BlogDetailDto })
  @ApiNotFoundResponse({ type: ApiErrorPayloadDto })
  @ApiUnauthorizedResponse({ type: ApiErrorPayloadDto })
  @ApiForbiddenResponse({ type: ApiErrorPayloadDto })
  async getById(@Param('id') id: string): Promise<BlogDetailDto> {
    return this.blogsService.findAdminById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiCookieAuth('session')
  @ApiOperation({ summary: 'Create a blog post' })
  @ApiCreatedResponse({ type: BlogDetailDto })
  @ApiConflictResponse({
    description: 'Slug already taken',
    type: ApiErrorPayloadDto,
  })
  @ApiUnauthorizedResponse({ type: ApiErrorPayloadDto })
  @ApiForbiddenResponse({ type: ApiErrorPayloadDto })
  async create(
    @Body() dto: CreateAdminBlogDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<BlogDetailDto> {
    return this.blogsService.createAdmin(dto, req.user);
  }

  @Patch(':id')
  @ApiCookieAuth('session')
  @ApiOperation({ summary: 'Update a blog post' })
  @ApiOkResponse({ type: BlogDetailDto })
  @ApiNotFoundResponse({ type: ApiErrorPayloadDto })
  @ApiConflictResponse({ type: ApiErrorPayloadDto })
  @ApiUnauthorizedResponse({ type: ApiErrorPayloadDto })
  @ApiForbiddenResponse({ type: ApiErrorPayloadDto })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateAdminBlogDto,
  ): Promise<BlogDetailDto> {
    return this.blogsService.updateAdmin(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiCookieAuth('session')
  @ApiOperation({ summary: 'Soft-delete a blog post' })
  @ApiNoContentResponse({ description: 'Blog soft-deleted' })
  @ApiNotFoundResponse({ type: ApiErrorPayloadDto })
  @ApiUnauthorizedResponse({ type: ApiErrorPayloadDto })
  @ApiForbiddenResponse({ type: ApiErrorPayloadDto })
  async remove(@Param('id') id: string): Promise<void> {
    return this.blogsService.softDeleteAdmin(id);
  }
}
