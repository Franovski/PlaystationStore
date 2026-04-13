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
import { MailService } from '../mail/mailService';
import { RegisterDto } from './dto/register';
import { PasswordResetService } from './resetPassword/reset-password.service';
import { ResetPasswordDto } from './dto/resetPassword';

type TwoFactorMethod = 'totp' | 'email-otp';

interface PendingLoginOtp {
  userId: number;
  code: string;
  expiresAt: number;
}

@Injectable()
export class AuthService {
  private static readonly LOGIN_OTP_TTL_MINUTES = 5;
  private readonly pendingLoginOtps = new Map<string, PendingLoginOtp>();

  constructor(
    private readonly usersService: UsersService,
    private readonly passwordResetService: PasswordResetService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly mailService: MailService,
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

    if (
      dto.role === 'admin' &&
      (process.env.NODE_ENV !== 'development' ||
        process.env.ENABLE_DEV_ADMIN_SIGNUP !== 'true')
    ) {
      dto.role = 'playstation_user' as any;
    }

    const user = await this.usersService.create(dto);

    const tokens = await this.generateTokens(user);
    await this.usersService.setRefreshToken(user.userId, tokens.refreshToken);

    return {
      user: this.sanitizeUser(user),
      ...tokens,
    };
  }

  async login(user: User) {
    const tempToken = this.jwtService.sign(
      {
        sub: user.userId,
        requiresTwoFactor: true,
        otpMethod: user.isTotpEnabled ? 'totp' : 'email-otp',
      },
      {
        secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
        expiresIn: '5m',
      },
    );

    if (user.isTotpEnabled) {
      return {
        requiresTwoFactor: true,
        tempToken,
        otpMethod: 'totp' as TwoFactorMethod,
      };
    }

    const loginCode = this.generateNumericOtp();
    this.storePendingLoginOtp(tempToken, user.userId, loginCode);
    
    try {
      await this.sendLoginOtp(user.email, loginCode);
    } catch (error) {
      throw new BadRequestException('Failed to send verification code. Please try again.');
    }

    return {
      requiresTwoFactor: true,
      tempToken,
      otpMethod: 'email-otp' as TwoFactorMethod,
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
    let payload: {
      sub: number;
      requiresTwoFactor?: boolean;
      otpMethod?: TwoFactorMethod;
    };

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

    if (!user) {
      throw new UnauthorizedException();
    }

    const normalizedCode = code.trim();
    const isEmailOtpFlow =
      payload.otpMethod === 'email-otp' || this.pendingLoginOtps.has(tempToken);

    if (isEmailOtpFlow) {
      this.verifyPendingLoginOtp(tempToken, user.userId, normalizedCode);
    } else {
      if (!user.totpSecret) {
        throw new UnauthorizedException();
      }

      const valid = authenticator.verify({
        token: normalizedCode,
        secret: user.totpSecret,
      });

      if (!valid) {
        throw new UnauthorizedException('Invalid TOTP code');
      }
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

  private storePendingLoginOtp(tempToken: string, userId: number, code: string) {
    const expiresAt = Date.now() + AuthService.LOGIN_OTP_TTL_MINUTES * 60_000;
    this.pendingLoginOtps.set(tempToken, {
      userId,
      code,
      expiresAt,
    });

    this.cleanupExpiredPendingOtps();
  }

  private verifyPendingLoginOtp(tempToken: string, userId: number, code: string) {
    const pending = this.pendingLoginOtps.get(tempToken);

    if (!pending || pending.userId !== userId) {
      throw new UnauthorizedException('Invalid or expired login verification session');
    }

    if (Date.now() > pending.expiresAt) {
      this.pendingLoginOtps.delete(tempToken);
      throw new UnauthorizedException('Login verification code expired');
    }

    if (pending.code !== code) {
      throw new UnauthorizedException('Invalid login verification code');
    }

    this.pendingLoginOtps.delete(tempToken);
  }

  private cleanupExpiredPendingOtps() {
    const now = Date.now();

    for (const [token, pending] of this.pendingLoginOtps.entries()) {
      if (now > pending.expiresAt) {
        this.pendingLoginOtps.delete(token);
      }
    }
  }

  private generateNumericOtp() {
    return String(Math.floor(100000 + Math.random() * 900000));
  }

  private async sendLoginOtp(email: string, code: string) {
    try {
      await this.mailService.sendLoginOtpEmail({
        to: email,
        loginCode: code,
        expiresInMinutes: AuthService.LOGIN_OTP_TTL_MINUTES,
      });
    } catch (error) {
      throw new BadRequestException('Failed to send verification code. Please try again.');
    }
  }
}