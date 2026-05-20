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
import type { Response } from 'express';

import type { LoginDto, LoginResponseDto, MeResponseDto } from '@repo/api';

import { Public } from './decorators/public.decorator';
import { AuthService } from './auth.service';
import type { AuthenticatedRequest } from './interfaces/authenticated-request.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
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
  logout(@Res({ passthrough: true }) res: Response): { success: true } {
    res.clearCookie(this.authService.getCookieName(), {
      httpOnly: true,
      path: '/',
    });

    return { success: true };
  }

  @Get('me')
  async me(@Req() req: AuthenticatedRequest): Promise<MeResponseDto> {
    const user = await this.authService.getMe(req.user.id);
    return { user };
  }
}
