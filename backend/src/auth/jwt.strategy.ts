import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserRole } from '../users/userEntity';
import { AuthenticatedUser } from './types/auth-context';

interface JwtPayload {
  sub?: unknown;
  email?: unknown;
  role?: unknown;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey:
        configService.get<string>('JWT_ACCESS_SECRET') || 'fallback_secret',
    });
  }

  validate(payload: JwtPayload): AuthenticatedUser {
    if (
      typeof payload.sub !== 'string' ||
      typeof payload.email !== 'string' ||
      !this.isUserRole(payload.role)
    ) {
      throw new UnauthorizedException('Invalid token payload');
    }

    return {
      userId: payload.sub,
      email: payload.email,
      role: payload.role,
    };
  }

  private isUserRole(value: unknown): value is UserRole {
    return Object.values(UserRole).includes(value as UserRole);
  }
}
