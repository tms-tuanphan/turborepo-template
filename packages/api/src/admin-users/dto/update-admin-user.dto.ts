import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateAdminUserDto {
  @ApiPropertyOptional({ format: 'email' })
  email?: string;

  @ApiPropertyOptional({ enum: ['active', 'disabled'] })
  status?: 'active' | 'disabled';

  @ApiPropertyOptional({ format: 'password', minLength: 8 })
  password?: string;
}
