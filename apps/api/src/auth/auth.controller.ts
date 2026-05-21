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
  ApiConflictResponse,
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
  RegisterDto,
  RegisterResponseDto,
  ForgotPasswordDto,
  ForgotPasswordResponseDto,
  ResetPasswordDto,
  ResetPasswordResponseDto,
  ChangePasswordDto,
  ChangePasswordResponseDto,
} from '@repo/api';

import { Public } from './decorators/public.decorator';
import { AuthService } from './auth.service';
import { PasswordResetService } from './password-reset.service';
import type { AuthenticatedRequest } from './interfaces/authenticated-request.interface';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly passwordResetService: PasswordResetService,
  ) {}

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
    res.clearCookie(
      this.authService.getCookieName(),
      this.authService.getClearCookieOptions(),
    );

    return { success: true };
  }

  @Public()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Register a new sub-admin account',
    description:
      'Always creates a user with role `sub_admin`. Public endpoint.',
  })
  @ApiOkResponse({ type: RegisterResponseDto })
  @ApiConflictResponse({
    description: 'Email already registered',
    type: ApiErrorPayloadDto,
  })
  async register(@Body() dto: RegisterDto): Promise<RegisterResponseDto> {
    return this.authService.register(dto);
  }

  @Public()
  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Request a password reset email',
    description:
      'Always returns success to prevent email enumeration. Rate limited per IP and email.',
  })
  @ApiOkResponse({ type: ForgotPasswordResponseDto })
  async forgotPassword(
    @Body() dto: ForgotPasswordDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<ForgotPasswordResponseDto> {
    const clientIp = req.ip ?? req.socket?.remoteAddress ?? 'unknown';
    return this.passwordResetService.forgotPassword(dto, clientIp);
  }

  @Public()
  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reset password using a one-time token from email' })
  @ApiOkResponse({ type: ResetPasswordResponseDto })
  @ApiUnauthorizedResponse({
    description: 'Invalid or expired reset token',
    type: ApiErrorPayloadDto,
  })
  async resetPassword(
    @Body() dto: ResetPasswordDto,
  ): Promise<ResetPasswordResponseDto> {
    return this.passwordResetService.resetPassword(dto);
  }

  @Post('change-password')
  @HttpCode(HttpStatus.OK)
  @ApiCookieAuth('session')
  @ApiOperation({ summary: 'Change password for the authenticated user' })
  @ApiOkResponse({ type: ChangePasswordResponseDto })
  @ApiUnauthorizedResponse({
    description: 'Invalid current password or missing session',
    type: ApiErrorPayloadDto,
  })
  async changePassword(
    @Body() dto: ChangePasswordDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<ChangePasswordResponseDto> {
    return this.authService.changePassword(req.user.id, dto);
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
