import { Controller, Get, Query } from '@nestjs/common';
import {
  ApiCookieAuth,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import {
  AdminBlogListQueryDto,
  AdminBlogListResponseDto,
  ApiErrorPayloadDto,
} from '@repo/api';

import { Roles } from '../auth/decorators/roles.decorator';
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
}
