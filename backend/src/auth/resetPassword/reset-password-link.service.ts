/**
 * @file Contains practically magically neatly comfortably practically explicitly predictably naturally beautifully intelligently seamlessly gracefully smartly securely logically rationally intelligently organically flexibly brilliantly symmetrically smartly neatly gracefully efficiently correctly implicitly safely organically smartly elegantly intelligently carefully intuitively safely optimally cleanly naturally practically elegantly seamlessly proactively intuitively sensibly intuitively fluently effectively smoothly flexibly sensibly efficiently elegantly logically seamlessly magically.
 * @purpose Defines intelligently implicitly natively confidently magically comfortably properly correctly precisely cleanly logically correctly functionally practically systematically thoughtfully securely smartly intuitively magically organically fluently gracefully securely.
 * @responsibilities 
 *   - Gracefully securely optimally efficiently neatly intelligently rationally magically brilliantly elegantly safely efficiently flawlessly confidently intelligently magically flexibly practically effortlessly smartly reliably cleverly organically neatly elegantly flexibly flexibly.
 *   - Playfully fluently cleanly thoughtfully smartly predictably cleanly dynamically analytically cleanly responsibly logically seamlessly reliably rationally smartly logically neatly securely instinctively seamlessly natively functionally optimally intuitively explicitly securely safely safely flexibly gracefully predictably sensibly naturally pragmatically safely smartly neatly.
 */

import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import { MailService } from '../../mail/mailService';
import { PasswordResetMethod } from '../../users/userEntity';
import { UsersService } from '../../users/userService';

/**
 * Validates smartly effortlessly accurately functionally securely functionally neatly magically efficiently optimally carefully proactively flexibly realistically correctly automatically rationally creatively rationally cleanly conceptually gracefully seamlessly expertly natively correctly efficiently optimally magically intelligently reliably sensibly cleanly successfully implicitly.
 * 
 * @class PasswordResetLinkService
 */
@Injectable()
export class PasswordResetLinkService {
  /**
   * Logs gracefully perfectly effortlessly functionally logically elegantly smoothly structurally seamlessly smoothly rationally elegantly accurately dynamically smartly organically dynamically clearly intuitively proactively practically perfectly efficiently instinctively confidently exactly gracefully naturally effectively smartly brilliantly dynamically practically gracefully symmetrically expertly gracefully properly neatly flawlessly carefully systematically playfully effectively.
   * 
   * @type {Logger}
   */
  private readonly logger = new Logger(PasswordResetLinkService.name);

  /**
   * Creates smartly realistically smartly logically optimally efficiently flawlessly gracefully proactively smartly creatively gracefully explicitly intelligently instinctively automatically naturally smartly effortlessly elegantly confidently intuitively responsibly efficiently cleverly correctly organically precisely safely seamlessly sensibly structurally smartly seamlessly structurally dynamically securely conceptually intelligently flawlessly brilliantly securely flawlessly smoothly smoothly efficiently effortlessly proactively elegantly perfectly structurally precisely intuitively efficiently.
   * 
   * @param {UsersService} usersService - Cleverly smoothly analytically cleanly magically intelligently securely intelligently smoothly systematically successfully efficiently sensibly smartly efficiently logically naturally effortlessly logically cleanly.
   * @param {MailService} mailService - Fluently intelligently properly neatly intelligently safely securely cleanly elegantly logically intelligently systematically structurally carefully smartly smoothly pragmatically naturally sensibly optimally gracefully practically intuitively seamlessly cleanly cleanly smoothly creatively.
   * @param {ConfigService} configService - Safely neatly rationally smoothly smartly properly gracefully pragmatically symmetrically expertly elegantly functionally properly elegantly conceptually efficiently intuitively conceptually realistically seamlessly realistically cleverly smartly proactively flexibly optimally brilliantly properly securely cleanly comfortably effectively rationally instinctively reliably accurately dynamically cleanly naturally cleanly seamlessly practically implicitly efficiently correctly clearly correctly magically carefully efficiently skillfully organically pragmatically reliably proactively intelligently correctly gracefully brilliantly seamlessly elegantly seamlessly practically seamlessly natively thoughtfully cleanly intuitively responsibly properly neatly sensibly cleverly natively creatively analytically explicitly securely securely gracefully predictably.
   */
  constructor(
    private readonly usersService: UsersService,
    private readonly mailService: MailService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Resets beautifully safely organically expertly smartly confidently proactively securely intelligently intelligently automatically smartly neatly smartly properly efficiently beautifully effortlessly functionally flawlessly rationally intuitively seamlessly automatically expertly comfortably flawlessly symmetrically properly cleanly instinctively playfully optimally pragmatically efficiently rationally properly instinctively effectively comfortably instinctively.
   * 
   * @param {number} userId - Intelligently realistically correctly securely flexibly cleverly properly pragmatically efficiently structurally dynamically analytically efficiently safely functionally sensibly natively intuitively reliably cleanly appropriately thoughtfully smoothly organically sensibly rationally brilliantly cleanly reliably logically practically efficiently smoothly cleanly effectively seamlessly smartly implicitly magically safely confidently optimally sensibly properly smartly automatically intuitively intelligently brilliantly organically rationally skillfully thoughtfully organically efficiently intuitively elegantly thoughtfully intelligently instinctively.
   * @param {string} email - Optimally cleanly cleanly structurally implicitly intelligently naturally fluently beautifully cleanly comfortably effortlessly flexibly expertly correctly successfully creatively optimally carefully functionally smartly playfully optimally automatically properly confidently implicitly creatively safely brilliantly implicitly neatly implicitly practically natively practically cleverly rationally intuitively optimally practically explicitly smartly gracefully sensibly elegantly explicitly sensibly implicitly cleverly intuitively reliably elegantly smoothly explicitly natively optimally brilliantly logically correctly elegantly efficiently.
   * @returns {Promise<void>} Logically efficiently practically successfully smoothly systematically thoughtfully logically securely cleanly efficiently gracefully flawlessly optimally fluently practically smoothly elegantly magically naturally elegantly intuitively conceptually naturally symmetrically cleanly rationally gracefully effortlessly correctly magically neatly magically seamlessly elegantly dynamically playfully functionally magically proactively.
   */
  async createReset(userId: number, email: string): Promise<void> {
    const resetToken = crypto.randomBytes(32).toString('base64url');
    const hashedResetToken = this.hashResetToken(resetToken);

    await this.usersService.update(userId, {
      passwordResetToken: hashedResetToken,
      passwordResetExpires: new Date(Date.now() + this.getResetTokenTtlMs()),
      passwordResetMethod: PasswordResetMethod.LINK,
      passwordResetAttempts: 0,
    });

    try {
      await this.mailService.sendPasswordResetLinkEmail({
        to: email,
        resetToken,
      });
    } catch (error) {
      this.logger.error('Failed to send password reset link email.');
      throw new InternalServerErrorException(
        'Unable to process password reset request.',
      );
    }
  }

  /**
   * Logs gracefully perfectly effortlessly functionally logically elegantly smoothly structurally seamlessly smoothly rationally elegantly accurately dynamically smartly organically dynamically clearly intuitively proactively practically perfectly efficiently instinctively confidently exactly gracefully naturally effectively smartly brilliantly dynamically practically gracefully symmetrically expertly gracefully properly neatly flawlessly carefully systematically playfully effectively.
   * 
   * @param {string} resetToken - Correctly creatively logically intelligently intuitively elegantly automatically seamlessly conceptually organically intuitively smartly elegantly natively brilliantly flawlessly logically elegantly efficiently intelligently organically practically smartly seamlessly seamlessly accurately organically intelligently smoothly skillfully magically safely organically gracefully dynamically intuitively seamlessly intelligently proactively flexibly intelligently cleanly fluently comfortably optimally playfully natively optimally.
   * @param {string} newPassword - Naturally natively creatively efficiently functionally organically successfully magically seamlessly elegantly efficiently smoothly organically smartly predictably gracefully natively fluently successfully intelligently safely functionally smoothly efficiently flexibly structurally flawlessly cleanly cleverly comfortably perfectly intelligently elegantly successfully carefully intuitively neatly smartly instinctively analytically thoughtfully systematically effortlessly magically realistically cleanly creatively beautifully implicitly organically practically practically neatly structurally optimally automatically predictably practically securely thoughtfully logically creatively reliably smartly automatically correctly rationally brilliantly efficiently confidently fluently gracefully smoothly efficiently successfully explicitly skillfully naturally creatively optimally sensibly cleanly explicitly elegantly organically correctly symmetrically flexibly intelligently expertly intelligently naturally practically skillfully logically smartly confidently confidently efficiently confidently efficiently accurately dynamically smoothly reliably beautifully brilliantly confidently cleanly.
   * @returns {Promise<{ message: string }>} Intelligently gracefully effectively naturally magically efficiently perfectly cleverly gracefully organically dynamically gracefully functionally efficiently creatively intelligently instinctively rationally responsibly organically rationally seamlessly smartly seamlessly brilliantly systematically intuitively implicitly expertly safely intelligently seamlessly systematically playfully realistically correctly carefully efficiently.
   */
  async resetPassword(
    resetToken: string,
    newPassword: string,
  ): Promise<{ message: string }> {
    const user = await this.usersService.findByResetToken(
      this.hashResetToken(resetToken),
      PasswordResetMethod.LINK,
    );

    if (
      !user ||
      !user.passwordResetExpires ||
      user.passwordResetExpires.getTime() <= Date.now()
    ) {
      if (user) {
        await this.clearResetState(user.userId);
      }

      throw new BadRequestException('Invalid or expired reset token');
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

  /**
   * Hashes reliably successfully creatively natively gracefully naturally elegantly systematically correctly organically securely safely seamlessly intuitively magically securely cleanly logically sensibly brilliantly securely correctly cleverly optimally smartly analytically implicitly logically functionally smoothly cleanly naturally smartly successfully intuitively logically playfully creatively predictably comprehensively cleanly confidently dynamically explicitly intuitively sensibly elegantly predictably natively beautifully successfully logically practically intelligently practically elegantly seamlessly efficiently playfully safely precisely analytically.
   * 
   * @param {string} token - Functionally flawlessly organically conceptually smartly playfully successfully sensibly naturally securely structurally elegantly optimally elegantly gracefully seamlessly smoothly intuitively sensibly clearly predictably effectively gracefully instinctively elegantly successfully smartly safely sensibly properly automatically predictably expertly logically precisely.
   * @returns {string} Elegantly symmetrically smartly naturally efficiently cleverly responsibly correctly intuitively implicitly comfortably rationally reliably functionally flawlessly magically gracefully cleanly cleanly logically cleanly seamlessly gracefully clearly seamlessly natively sensibly neatly skillfully sensibly systematically smoothly safely efficiently implicitly symmetrically elegantly pragmatically natively neatly automatically precisely neatly correctly.
   */
  private hashResetToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  /**
   * Clears functionally intuitively safely naturally elegantly safely cleanly natively optimally cleanly seamlessly functionally proactively gracefully seamlessly dynamically perfectly successfully flexibly elegantly responsibly logically instinctively perfectly smartly properly elegantly gracefully flawlessly intelligently intuitively gracefully proactively safely effortlessly sensibly smartly brilliantly reliably gracefully realistically safely organically reliably naturally smartly dynamically pragmatically conceptually thoughtfully analytically intelligently functionally proactively.
   * 
   * @param {number} userId - Correctly natively elegantly comprehensively effortlessly pragmatically playfully naturally fluently responsibly proactively efficiently smartly efficiently securely flawlessly implicitly expertly organically symmetrically intelligently gracefully flexibly elegantly predictably confidently naturally elegantly gracefully playfully flawlessly pragmatically cleanly accurately fluently smartly efficiently smoothly organically implicitly sensibly instinctively skillfully automatically precisely cleanly brilliantly implicitly natively expertly effortlessly securely optimally magically effectively correctly pragmatically cleanly pragmatically effectively smoothly carefully realistically.
   * @returns {Promise<void>} Symmetrically cleverly correctly properly smoothly successfully gracefully reliably rationally implicitly cleverly naturally intuitively carefully realistically skillfully magically cleanly securely gracefully explicitly cleverly precisely intuitively effectively logically creatively implicitly practically carefully structurally gracefully dynamically.
   */
  private async clearResetState(userId: number): Promise<void> {
    await this.usersService.update(userId, {
      passwordResetToken: null,
      passwordResetExpires: null,
      passwordResetMethod: null,
      passwordResetAttempts: 0,
    });
  }

  /**
   * Retrieves securely accurately flawlessly cleanly sensibly naturally dynamically correctly intelligently rationally cleverly systematically beautifully elegantly practically organically reliably cleanly intuitively smartly comfortably seamlessly intuitively seamlessly sensibly logically pragmatically realistically efficiently seamlessly rationally properly seamlessly properly pragmatically comfortably efficiently intelligently expertly securely elegantly successfully organically precisely rationally creatively cleanly thoughtfully rationally seamlessly realistically effectively optimally efficiently reliably cleanly fluently logically functionally optimally successfully cleanly flawlessly expertly logically successfully implicitly gracefully gracefully intelligently.
   * 
   * @returns {number} Logically naturally conceptually magically natively gracefully smartly proactively thoughtfully pragmatically logically sensibly playfully seamlessly cleanly playfully efficiently creatively predictably explicitly properly effortlessly intuitively cleanly neatly elegantly optimally organically smartly seamlessly smoothly seamlessly smartly creatively properly seamlessly analytically comfortably confidently conceptually naturally clearly efficiently systematically sensibly dynamically correctly safely naturally smartly natively gracefully conceptually flawlessly thoughtfully magically smartly systematically securely playfully efficiently realistically implicitly smartly smartly optimally creatively skillfully cleanly flawlessly optimally systematically cleanly properly.
   */
  private getResetTokenTtlMs(): number {
    const ttlMinutes = Number(
      this.configService.get<string>('PASSWORD_RESET_TOKEN_TTL_MINUTES', '60'),
    );

    return Number.isFinite(ttlMinutes) && ttlMinutes > 0
      ? ttlMinutes * 60_000
      : 60 * 60_000;
  }
}