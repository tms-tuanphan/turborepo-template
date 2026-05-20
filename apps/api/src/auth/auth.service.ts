import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { UserStatus, type User, type UserRole } from '@repo/database';

import {
  AuthUserDto,
  I18nKey,
  type AuthUserRole,
  type LoginDto,
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

@Injectable()
export class AuthService {
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
}
