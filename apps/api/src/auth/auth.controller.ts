import {
  Controller,
  Get,
  Post,
  Body,
  Res,
  Req,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiCookieAuth,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import type { Response } from 'express';

import {
  LoginDto,
  LoginResponseDto,
  LogoutResponseDto,
  MeResponseDto,
  ApiErrorPayloadDto,
} from '@repo/api';

import { Public } from './decorators/public.decorator';
import { AuthService } from './auth.service';
import type { AuthenticatedRequest } from './interfaces/authenticated-request.interface';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Login with email and password',
    description:
      'Sets an httpOnly JWT cookie (`AUTH_COOKIE_NAME`) on success. Response body contains the authenticated user only.',
  })
  @ApiOkResponse({ type: LoginResponseDto })
  @ApiUnauthorizedResponse({
    description: 'Invalid credentials or disabled account',
    type: ApiErrorPayloadDto,
  })
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<LoginResponseDto> {
    const { user, accessToken } = await this.authService.login(loginDto);

    res.cookie(
      this.authService.getCookieName(),
      accessToken,
      this.authService.getCookieOptions(),
    );

    return { user };
  }

  @Public()
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Clear session cookie' })
  @ApiOkResponse({ type: LogoutResponseDto })
  logout(@Res({ passthrough: true }) res: Response): LogoutResponseDto {
    res.clearCookie(this.authService.getCookieName(), {
      httpOnly: true,
      path: '/',
    });

    return { success: true };
  }

  @Get('me')
  @ApiCookieAuth('session')
  @ApiOperation({ summary: 'Get current authenticated user' })
  @ApiOkResponse({ type: MeResponseDto })
  @ApiUnauthorizedResponse({
    description: 'Missing or invalid session cookie',
    type: ApiErrorPayloadDto,
  })
  @ApiForbiddenResponse({
    description: 'Insufficient role',
    type: ApiErrorPayloadDto,
  })
  async me(@Req() req: AuthenticatedRequest): Promise<MeResponseDto> {
    const user = await this.authService.getMe(req.user.id);
    return { user };
  }
}
