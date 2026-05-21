import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { UserRole, UserStatus, type User } from '@repo/database';

import {
  AuthUserDto,
  I18nKey,
  type AuthUserRole,
  type ChangePasswordDto,
  type ChangePasswordResponseDto,
  type LoginDto,
  type RegisterDto,
  type RegisterResponseDto,
} from '@repo/api';

import { PrismaService } from '../prisma/prisma.service';

import type { JwtPayload } from './interfaces/jwt-payload.interface';

const userSelect = {
  id: true,
  email: true,
  password: true,
  role: true,
  status: true,
} as const;

type SafeUser = Pick<User, keyof typeof userSelect>;

const BCRYPT_ROUNDS = 10;
const MIN_PASSWORD_LENGTH = 8;

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async login(
    dto: LoginDto,
  ): Promise<{ user: AuthUserDto; accessToken: string }> {
    const email = dto.email.trim().toLowerCase();

    if (!email || !dto.password) {
      throw new UnauthorizedException(I18nKey.Errors.Auth.InvalidCredentials);
    }

    const user = await this.prisma.user.findUnique({
      where: { email },
      select: userSelect,
    });

    if (!user) {
      throw new UnauthorizedException(I18nKey.Errors.Auth.InvalidCredentials);
    }

    if (user.status === UserStatus.disabled) {
      throw new ForbiddenException(I18nKey.Errors.Auth.AccountDisabled);
    }

    const passwordMatches = await bcrypt.compare(dto.password, user.password);

    if (!passwordMatches) {
      throw new UnauthorizedException(I18nKey.Errors.Auth.InvalidCredentials);
    }

    const authUser = this.toAuthUserDto(user);
    const payload: JwtPayload = {
      sub: authUser.id,
      email: authUser.email,
      role: authUser.role,
    };

    const accessToken = await this.jwtService.signAsync(payload);

    return { user: authUser, accessToken };
  }

  async register(dto: RegisterDto): Promise<RegisterResponseDto> {
    const email = dto.email.trim().toLowerCase();

    if (!email || !this.isPasswordStrongEnough(dto.password)) {
      throw new BadRequestException(I18nKey.Errors.Auth.WeakPassword);
    }

    const existing = await this.prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (existing) {
      throw new ConflictException(I18nKey.Errors.Auth.EmailAlreadyExists);
    }

    const hashedPassword = await bcrypt.hash(dto.password, BCRYPT_ROUNDS);

    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: UserRole.sub_admin,
        status: UserStatus.active,
      },
      select: {
        id: true,
        email: true,
        role: true,
        status: true,
      },
    });

    this.logger.log(`User registered: ${user.id} (sub_admin)`);

    return {
      user: {
        id: user.id,
        email: user.email,
        role: this.mapRole(user.role),
      },
    };
  }

  async changePassword(
    userId: string,
    dto: ChangePasswordDto,
  ): Promise<ChangePasswordResponseDto> {
    if (!this.isPasswordStrongEnough(dto.newPassword)) {
      throw new BadRequestException(I18nKey.Errors.Auth.WeakPassword);
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: userSelect,
    });

    if (!user) {
      throw new UnauthorizedException(I18nKey.Errors.Common.Unauthorized);
    }

    if (user.status === UserStatus.disabled) {
      throw new ForbiddenException(I18nKey.Errors.Auth.AccountDisabled);
    }

    const currentMatches = await bcrypt.compare(
      dto.currentPassword,
      user.password,
    );

    if (!currentMatches) {
      throw new UnauthorizedException(I18nKey.Errors.Auth.InvalidCredentials);
    }

    const hashedPassword = await bcrypt.hash(dto.newPassword, BCRYPT_ROUNDS);

    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    this.logger.log(`Password changed for user ${userId}`);

    return { success: true };
  }

  async getMe(userId: string): Promise<AuthUserDto> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        role: true,
        status: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException(I18nKey.Errors.Common.Unauthorized);
    }

    if (user.status === UserStatus.disabled) {
      throw new ForbiddenException(I18nKey.Errors.Auth.AccountDisabled);
    }

    return {
      id: user.id,
      email: user.email,
      role: this.mapRole(user.role),
    };
  }

  getCookieName(): string {
    return this.configService.get<string>('AUTH_COOKIE_NAME') ?? 'access_token';
  }

  getCookieOptions(): {
    httpOnly: boolean;
    secure: boolean;
    sameSite: 'lax';
    path: string;
    maxAge: number;
  } {
    const isProduction =
      this.configService.get<string>('NODE_ENV') === 'production';

    return {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    };
  }

  /** Must match set-cookie attributes (except maxAge) so browsers clear the session. */
  getClearCookieOptions(): {
    httpOnly: boolean;
    secure: boolean;
    sameSite: 'lax';
    path: string;
  } {
    const { httpOnly, secure, sameSite, path } = this.getCookieOptions();
    return { httpOnly, secure, sameSite, path };
  }

  private toAuthUserDto(user: SafeUser): AuthUserDto {
    return {
      id: user.id,
      email: user.email,
      role: this.mapRole(user.role),
    };
  }

  private mapRole(role: UserRole): AuthUserRole {
    return role === 'sub_admin' ? 'sub_admin' : 'admin';
  }

  private isPasswordStrongEnough(password: string | undefined): boolean {
    return (
      typeof password === 'string' && password.length >= MIN_PASSWORD_LENGTH
    );
  }
}
