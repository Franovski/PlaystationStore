import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { authenticator } from 'otplib';
import * as QRCode from 'qrcode';
import { StringValue } from 'ms';

import { UsersService } from '../users/userService';
import { User } from '../users/userEntity';
import { RegisterDto } from './dto/register';
import { PasswordResetService } from './resetPassword/reset-password.service';
import { ResetPasswordDto } from './dto/resetPassword';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly passwordResetService: PasswordResetService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.usersService.findByEmail(email);

    if (!user || !user.password) {
      return null;
    }

    const valid = await bcrypt.compare(password, user.password);
    return valid ? user : null;
  }

  async register(dto: RegisterDto) {
    const user = await this.usersService.create(dto);

    const tokens = await this.generateTokens(user);
    await this.usersService.setRefreshToken(user.userId, tokens.refreshToken);

    return {
      user: this.sanitizeUser(user),
      ...tokens,
    };
  }

  async login(user: User) {
    if (user.isTotpEnabled) {
      const tempToken = this.jwtService.sign(
        { sub: user.userId, requiresTwoFactor: true },
        {
          secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
          expiresIn: '5m',
        },
      );

      return {
        requiresTwoFactor: true,
        tempToken,
      };
    }

    const tokens = await this.generateTokens(user);
    await this.usersService.setRefreshToken(user.userId, tokens.refreshToken);

    return {
      user: this.sanitizeUser(user),
      ...tokens,
    };
  }

  async refreshTokens(userId: number, refreshToken: string) {
    const user = await this.usersService.findById(userId);

    if (!user || !user.refreshToken) {
      throw new UnauthorizedException();
    }

    const valid = await bcrypt.compare(refreshToken, user.refreshToken);

    if (!valid) {
      throw new UnauthorizedException();
    }

    const tokens = await this.generateTokens(user);
    await this.usersService.setRefreshToken(user.userId, tokens.refreshToken);

    return {
      user: this.sanitizeUser(user),
      ...tokens,
    };
  }

  decodeRefreshToken(token: string): {
    sub: number;
    email: string;
    role?: string;
  } {
    try {
      return this.jwtService.verify(token, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(userId: number) {
    await this.usersService.setRefreshToken(userId, null);

    return { message: 'Logged out' };
  }

  async forgotPassword(email: string) {
    return this.passwordResetService.forgotPassword(email);
  }

  async resetPassword(dto: ResetPasswordDto) {
    return this.passwordResetService.resetPassword(dto);
  }

  async generateTotpSecret(userId: number) {
    const user = await this.usersService.findById(userId);

    if (!user) {
      throw new UnauthorizedException();
    }

    const secret = authenticator.generateSecret();
    await this.usersService.update(userId, { totpSecret: secret });

    const otpauthUrl = authenticator.keyuri(
      user.email,
      'PlayStationStore',
      secret,
    );
    const qrCode = await QRCode.toDataURL(otpauthUrl);

    return { secret, qrCode };
  }

  async enableTotp(userId: number, code: string) {
    const user = await this.usersService.findById(userId);

    if (!user || !user.totpSecret) {
      throw new BadRequestException('TOTP not set up');
    }

    const valid = authenticator.verify({
      token: code,
      secret: user.totpSecret,
    });

    if (!valid) {
      throw new BadRequestException('Invalid TOTP code');
    }

    await this.usersService.update(userId, { isTotpEnabled: true });

    return { message: 'Two-factor authentication enabled' };
  }

  async verifyTotpAndLogin(tempToken: string, code: string) {
    let payload: { sub: number; requiresTwoFactor?: boolean };

    try {
      payload = this.jwtService.verify(tempToken, {
        secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
      });
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }

    if (!payload.requiresTwoFactor) {
      throw new BadRequestException('Token is not a 2FA token');
    }

    const user = await this.usersService.findById(payload.sub);

    if (!user || !user.totpSecret) {
      throw new UnauthorizedException();
    }

    const valid = authenticator.verify({
      token: code,
      secret: user.totpSecret,
    });

    if (!valid) {
      throw new UnauthorizedException('Invalid TOTP code');
    }

    const tokens = await this.generateTokens(user);
    await this.usersService.setRefreshToken(user.userId, tokens.refreshToken);

    return {
      user: this.sanitizeUser(user),
      ...tokens,
    };
  }

  async disableTotp(userId: number) {
    await this.usersService.update(userId, {
      isTotpEnabled: false,
      totpSecret: null,
    });

    return { message: 'Two-factor authentication disabled' };
  }

  private async generateTokens(user: User) {
    const payload = {
      sub: user.userId,
      email: user.email,
      role: user.role,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
        expiresIn: this.configService.get<StringValue>(
          'JWT_ACCESS_EXPIRATION',
          '15m',
        ),
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.get<StringValue>(
          'JWT_REFRESH_EXPIRATION',
          '7d',
        ),
      }),
    ]);

    return { accessToken, refreshToken };
  }

  private sanitizeUser(user: User) {
    const {
      password,
      refreshToken,
      totpSecret,
      passwordResetToken,
      passwordResetExpires,
      passwordResetMethod,
      passwordResetAttempts,
      ...safe
    } = user;

    return safe;
  }
}