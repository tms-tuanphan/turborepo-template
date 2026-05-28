import { ApiProperty } from '@nestjs/swagger';

export class BlogCategoryDto {
  @ApiProperty()
  id!: string;

  @ApiProperty({ example: 'IT Partnership Insight' })
  displayName!: string;

  @ApiProperty({ type: String, format: 'date-time' })
  createdAt!: string;

  @ApiProperty({ type: String, format: 'date-time' })
  updatedAt!: string;
}
