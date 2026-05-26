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
  ApiErrorPayloadDto,
  BlogCategoryDto,
  CreateBlogCategoryDto,
  UpdateBlogCategoryDto,
} from '@repo/api';

import { Roles } from '../auth/decorators/roles.decorator';
import { BlogCategoriesService } from './blog-categories.service';

@ApiTags('Admin Blog Categories')
@Controller('admin/blog-categories')
@Roles('admin', 'sub_admin')
export class AdminBlogCategoriesController {
  constructor(private readonly blogCategoriesService: BlogCategoriesService) {}

  @Get()
  @ApiCookieAuth('session')
  @ApiOperation({ summary: 'List blog categories' })
  @ApiOkResponse({ type: BlogCategoryDto, isArray: true })
  @ApiUnauthorizedResponse({ type: ApiErrorPayloadDto })
  @ApiForbiddenResponse({ type: ApiErrorPayloadDto })
  async list(): Promise<BlogCategoryDto[]> {
    return this.blogCategoriesService.findAll();
  }

  @Post()
  @Roles('admin')
  @HttpCode(HttpStatus.CREATED)
  @ApiCookieAuth('session')
  @ApiOperation({ summary: 'Create a blog category (admin only)' })
  @ApiCreatedResponse({ type: BlogCategoryDto })
  @ApiConflictResponse({ type: ApiErrorPayloadDto })
  @ApiUnauthorizedResponse({ type: ApiErrorPayloadDto })
  @ApiForbiddenResponse({ type: ApiErrorPayloadDto })
  async create(@Body() dto: CreateBlogCategoryDto): Promise<BlogCategoryDto> {
    return this.blogCategoriesService.create(dto);
  }

  @Patch(':id')
  @Roles('admin')
  @ApiCookieAuth('session')
  @ApiOperation({ summary: 'Update a blog category (admin only)' })
  @ApiOkResponse({ type: BlogCategoryDto })
  @ApiNotFoundResponse({ type: ApiErrorPayloadDto })
  @ApiConflictResponse({ type: ApiErrorPayloadDto })
  @ApiUnauthorizedResponse({ type: ApiErrorPayloadDto })
  @ApiForbiddenResponse({ type: ApiErrorPayloadDto })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateBlogCategoryDto,
  ): Promise<BlogCategoryDto> {
    return this.blogCategoriesService.update(id, dto);
  }

  @Delete(':id')
  @Roles('admin')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiCookieAuth('session')
  @ApiOperation({ summary: 'Delete a blog category (admin only)' })
  @ApiNoContentResponse({ description: 'Category deleted' })
  @ApiNotFoundResponse({ type: ApiErrorPayloadDto })
  @ApiConflictResponse({
    description: 'Category still has blogs',
    type: ApiErrorPayloadDto,
  })
  @ApiUnauthorizedResponse({ type: ApiErrorPayloadDto })
  @ApiForbiddenResponse({ type: ApiErrorPayloadDto })
  async remove(@Param('id') id: string): Promise<void> {
    return this.blogCategoriesService.remove(id);
  }
}
