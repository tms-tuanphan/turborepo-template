import { ApiProperty } from '@nestjs/swagger';

import { BlogListItemDto } from './blog-list-item.dto';

export class BlogDetailDto extends BlogListItemDto {
  @ApiProperty({ description: 'Full post body (markdown)' })
  content!: string;
}
