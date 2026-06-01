import { ApiProperty } from '@nestjs/swagger';

import { AuthUserDto } from './auth-user.dto';

export class RefreshResponseDto {
  @ApiProperty({ type: () => AuthUserDto })
  user!: AuthUserDto;
}
