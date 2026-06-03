import { ApiProperty } from '@nestjs/swagger';

import type { AuthUserRole } from '../../auth/dto/auth-user.dto';

export class AdminUserDto {
  @ApiProperty()
  id!: string;

  @ApiProperty({ format: 'email' })
  email!: string;

  @ApiProperty({ enum: ['admin', 'sub_admin'] })
  role!: AuthUserRole;

  @ApiProperty({ enum: ['active', 'disabled'] })
  status!: 'active' | 'disabled';

  @ApiProperty({ type: String, format: 'date-time' })
  createdAt!: string;

  @ApiProperty({ type: String, format: 'date-time' })
  updatedAt!: string;

  @ApiProperty({ type: String, format: 'date-time', required: false })
  deletedAt?: string | null;
}
