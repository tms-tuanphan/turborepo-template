import { ApiProperty } from '@nestjs/swagger';

import { BlogCategoryDto } from './blog-category.dto';

export class AdminBlogCategoryListResponseDto {
  @ApiProperty({ type: () => BlogCategoryDto, isArray: true })
  items!: BlogCategoryDto[];

  @ApiProperty()
  totalItems!: number;

  @ApiProperty()
  totalPages!: number;

  @ApiProperty()
  currentPage!: number;
}
