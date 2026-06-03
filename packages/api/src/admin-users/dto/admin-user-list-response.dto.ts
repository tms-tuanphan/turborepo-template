import { ApiProperty } from '@nestjs/swagger';

import { AdminUserDto } from './admin-user.dto';

export class AdminUserListResponseDto {
  @ApiProperty({ type: () => AdminUserDto, isArray: true })
  items!: AdminUserDto[];

  @ApiProperty()
  totalItems!: number;

  @ApiProperty()
  totalPages!: number;

  @ApiProperty()
  currentPage!: number;
}
