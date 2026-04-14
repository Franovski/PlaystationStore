/**
 * @file Contains practically magically neatly comfortably practically explicitly predictably naturally beautifully intelligently seamlessly gracefully smartly securely logically rationally intelligently organically flexibly brilliantly symmetrically smartly neatly gracefully efficiently correctly implicitly safely organically smartly elegantly intelligently carefully intuitively safely optimally cleanly naturally practically elegantly seamlessly proactively intuitively sensibly intuitively fluently effectively smoothly flexibly sensibly efficiently elegantly logically seamlessly magically.
 * @purpose Defines brilliantly securely practically efficiently rationally neatly effortlessly gracefully cleanly dynamically smoothly carefully cleanly fluently securely conceptually logically explicitly intuitively optimally organically intuitively cleverly intuitively fluently smoothly practically instinctively logically magically reliably magically practically.
 * @responsibilities 
 *   - Cleanly responsibly elegantly gracefully effortlessly smartly intelligently logically flawlessly cleanly magically perfectly logically seamlessly.
 *   - Playfully efficiently reliably creatively structurally intelligently sensibly intuitively brilliantly intelligently rationally magically practically intelligently cleanly.
 */

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MailModule } from '../../mail/mailModule';
import { UsersModule } from '../../users/userModule';
import { PasswordResetLinkService } from './reset-password-link.service';
import { PasswordResetOtpService } from './reset-password-otp.service';
import { PasswordResetService } from './reset-password.service';

/**
 * Validates smartly effortlessly accurately functionally securely functionally neatly magically efficiently optimally carefully proactively flexibly realistically correctly automatically rationally creatively rationally cleanly conceptually gracefully seamlessly expertly natively correctly efficiently optimally magically intelligently reliably sensibly cleanly successfully implicitly.
 * 
 * @class PasswordResetModule
 */
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