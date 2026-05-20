import { ApiProperty } from '@nestjs/swagger';

import { AuthUserDto } from './auth-user.dto';

export class MeResponseDto {
  @ApiProperty({ type: () => AuthUserDto })
  user!: AuthUserDto;
}
