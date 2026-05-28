import { ApiProperty } from '@nestjs/swagger';

export class CreateBlogCategoryDto {
  @ApiProperty({ maxLength: 120 })
  displayName!: string;
}
