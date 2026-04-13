import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { MailService } from '../../mail/mailService';
import { PasswordResetMethod } from '../../users/userEntity';
import { UsersService } from '../../users/userService';

@Injectable()
export class PasswordResetOtpService {
  private readonly logger = new Logger(PasswordResetOtpService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly mailService: MailService,
    private readonly configService: ConfigService,
  ) {}

  async createReset(userId: number, email: string): Promise<void> {
    const otp = this.generateOtp();
    const hashedOtp = await bcrypt.hash(otp, 12);

    await this.usersService.update(userId, {
      passwordResetToken: hashedOtp,
      passwordResetExpires: new Date(Date.now() + this.getOtpTtlMs()),
      passwordResetMethod: PasswordResetMethod.OTP,
      passwordResetAttempts: 0,
    });

    try {
      await this.mailService.sendPasswordResetOtpEmail({
        to: email,
        resetCode: otp,
        expiresInMinutes: this.getOtpTtlMinutes(),
      });
    } catch (error) {
      this.logger.error('Failed to send password reset OTP email.');
      throw new InternalServerErrorException(
        'Unable to process password reset request.',
      );
    }
  }

  async resetPassword(
    email: string,
    otp: string,
    newPassword: string,
  ): Promise<{ message: string }> {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new BadRequestException('Invalid reset request');
    }

    if (
      !user.passwordResetToken ||
      !user.passwordResetExpires ||
      user.passwordResetMethod !== PasswordResetMethod.OTP
    ) {
      throw new BadRequestException('Invalid or expired OTP');
    }

    if (user.passwordResetExpires.getTime() <= Date.now()) {
      await this.clearResetState(user.userId);
      throw new BadRequestException('Invalid or expired OTP');
    }

    const maxAttempts = this.getMaxOtpAttempts();
    if ((user.passwordResetAttempts ?? 0) >= maxAttempts) {
      await this.clearResetState(user.userId);
      throw new BadRequestException('Maximum OTP attempts exceeded');
    }

    const isValidOtp = await bcrypt.compare(otp, user.passwordResetToken);

    if (!isValidOtp) {
      await this.usersService.incrementPasswordResetAttempts(user.userId);

      const refreshedUser = await this.usersService.findById(user.userId);
      if (
        refreshedUser &&
        (refreshedUser.passwordResetAttempts ?? 0) >= maxAttempts
      ) {
        await this.clearResetState(user.userId);
      }

      throw new BadRequestException('Invalid OTP');
    }

    await this.usersService.update(user.userId, {
      password: newPassword,
      refreshToken: null,
      passwordResetToken: null,
      passwordResetExpires: null,
      passwordResetMethod: null,
      passwordResetAttempts: 0,
    });

    return { message: 'Password reset successful' };
  }

  private generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  private async clearResetState(userId: number): Promise<void> {
    await this.usersService.update(userId, {
      passwordResetToken: null,
      passwordResetExpires: null,
      passwordResetMethod: null,
      passwordResetAttempts: 0,
    });
  }

  private getOtpTtlMs(): number {
    const ttlMinutes = Number(
      this.configService.get<string>('PASSWORD_RESET_OTP_TTL_MINUTES', '10'),
    );

    return Number.isFinite(ttlMinutes) && ttlMinutes > 0
      ? ttlMinutes * 60_000
      : 10 * 60_000;
  }

  private getOtpTtlMinutes(): number {
    const ttlMinutes = Number(
      this.configService.get<string>('PASSWORD_RESET_OTP_TTL_MINUTES', '10'),
    );

    return Number.isFinite(ttlMinutes) && ttlMinutes > 0 ? ttlMinutes : 10;
  }

  private getMaxOtpAttempts(): number {
    const maxAttempts = Number(
      this.configService.get<string>('PASSWORD_RESET_OTP_MAX_ATTEMPTS', '5'),
    );

    return Number.isFinite(maxAttempts) && maxAttempts > 0
      ? maxAttempts
      : 5;
  }
}