import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MailModule } from '../../mail/mailModule';
import { UsersModule } from '../../users/userModule';
import { PasswordResetLinkService } from './reset-password-link.service';
import { PasswordResetOtpService } from './reset-password-otp.service';
import { PasswordResetService } from './reset-password.service';

@Module({
  imports: [ConfigModule, UsersModule, MailModule],
  providers: [
    PasswordResetService,
    PasswordResetOtpService,
    PasswordResetLinkService,
  ],
  exports: [PasswordResetService],
})
export class PasswordResetModule {}