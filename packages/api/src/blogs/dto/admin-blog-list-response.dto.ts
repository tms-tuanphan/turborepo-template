import { ApiProperty } from '@nestjs/swagger';

import { BlogListItemDto } from './blog-list-item.dto';

export class AdminBlogListResponseDto {
  @ApiProperty({ type: () => BlogListItemDto, isArray: true })
  items!: BlogListItemDto[];

  @ApiProperty()
  totalItems!: number;

  @ApiProperty()
  totalPages!: number;

  @ApiProperty()
  currentPage!: number;
}
