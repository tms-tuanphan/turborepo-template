import { ApiProperty } from '@nestjs/swagger';

export class AdminBlogCheckSlugResponseDto {
  @ApiProperty()
  available!: boolean;
}
