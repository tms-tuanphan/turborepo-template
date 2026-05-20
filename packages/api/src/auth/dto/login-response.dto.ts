import { ApiProperty } from '@nestjs/swagger';

import { AuthUserDto } from './auth-user.dto';

export class LoginResponseDto {
  @ApiProperty({ type: () => AuthUserDto })
  user!: AuthUserDto;
}
