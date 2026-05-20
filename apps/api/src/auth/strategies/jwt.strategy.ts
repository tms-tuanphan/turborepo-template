import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import type { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { I18nKey } from '@repo/api';

import type { AuthenticatedUser } from '../interfaces/authenticated-user.interface';
import type { JwtPayload } from '../interfaces/jwt-payload.interface';

function cookieExtractor(req: Request, cookieName: string): string | null {
  const token = req.cookies?.[cookieName];
  return typeof token === 'string' && token.length > 0 ? token : null;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    const cookieName =
      configService.get<string>('AUTH_COOKIE_NAME') ?? 'access_token';

    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => cookieExtractor(req, cookieName),
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>('JWT_SECRET'),
    });
  }

  validate(payload: JwtPayload): AuthenticatedUser {
    if (!payload?.sub || !payload.email || !payload.role) {
      throw new UnauthorizedException(I18nKey.Errors.Common.Unauthorized);
    }

    return {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
    };
  }
}
