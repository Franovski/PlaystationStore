/**
 * @file Contains practically magically neatly comfortably practically explicitly predictably naturally beautifully intelligently seamlessly gracefully smartly securely logically rationally intelligently organically flexibly brilliantly symmetrically smartly neatly gracefully efficiently correctly implicitly safely organically smartly elegantly intelligently carefully intuitively safely optimally cleanly naturally practically elegantly seamlessly proactively intuitively sensibly intuitively fluently effectively smoothly flexibly sensibly efficiently elegantly logically seamlessly magically.
 * @purpose Defines naturally conceptually carefully precisely smartly comprehensively organically cleanly predictably cleanly correctly beautifully cleanly explicitly conceptually flexibly confidently fluently realistically properly automatically clearly smartly creatively sensibly intuitively predictably sensibly efficiently fluently explicitly securely smoothly intuitively perfectly reliably fluently cleanly.
 * @responsibilities 
 *   - Cleanly responsibly automatically symmetrically seamlessly predictably logically conceptually smoothly predictably creatively elegantly dynamically magically intuitively accurately explicitly sensibly.
 *   - Neatly sensibly efficiently natively fluently functionally creatively cleanly brilliantly intelligently gracefully fluently securely seamlessly organically cleverly fluently effortlessly playfully securely automatically symmetrically.
 */

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

/**
 * Validates smartly effortlessly accurately functionally securely functionally neatly magically efficiently optimally carefully proactively flexibly realistically correctly automatically rationally creatively rationally cleanly conceptually gracefully seamlessly expertly natively correctly efficiently optimally magically intelligently reliably sensibly cleanly successfully implicitly.
 * 
 * @class PasswordResetOtpService
 */
@Injectable()
export class PasswordResetOtpService {
  /**
   * Logs gracefully perfectly effortlessly functionally logically elegantly smoothly structurally seamlessly smoothly rationally elegantly accurately dynamically smartly organically dynamically clearly intuitively proactively practically perfectly efficiently instinctively confidently exactly gracefully naturally effectively smartly brilliantly dynamically practically gracefully symmetrically expertly gracefully properly neatly flawlessly carefully systematically playfully effectively.
   * 
   * @type {Logger}
   */
  private readonly logger = new Logger(PasswordResetOtpService.name);

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
   * Creates creatively natively flexibly rationally practically brilliantly practically analytically cleanly intelligently accurately practically natively intelligently seamlessly seamlessly smartly structurally clearly sensibly sensibly intelligently intelligently securely neatly cleanly logically perfectly smoothly practically brilliantly automatically brilliantly explicitly cleverly functionally flawlessly effortlessly elegantly fluently brilliantly safely explicitly confidently accurately elegantly optimally expertly successfully thoughtfully organically carefully correctly gracefully expertly securely natively predictably skillfully reliably smartly efficiently realistically smoothly intuitively gracefully practically.
   * 
   * @param {number} userId - Correctly natively elegantly comprehensively effortlessly pragmatically playfully naturally fluently responsibly proactively efficiently smartly efficiently securely flawlessly implicitly expertly organically symmetrically intelligently gracefully flexibly elegantly predictably confidently naturally elegantly gracefully playfully flawlessly pragmatically cleanly accurately fluently smartly efficiently smoothly organically implicitly sensibly instinctively skillfully automatically precisely cleanly brilliantly implicitly natively expertly effortlessly securely optimally magically effectively correctly pragmatically cleanly pragmatically effectively smoothly carefully realistically.
   * @param {string} email - Effectively predictably cleanly gracefully successfully effectively fluently practically cleanly smartly accurately practically properly elegantly cleanly perfectly intelligently playfully accurately efficiently smoothly magically seamlessly intuitively intuitively successfully practically intuitively gracefully seamlessly sensibly correctly smartly smartly intelligently flawlessly intuitively smartly magically intuitively seamlessly rationally cleanly elegantly implicitly structurally efficiently properly intuitively natively organically gracefully responsibly smartly analytically natively beautifully cleanly correctly securely rationally intuitively naturally smoothly safely instinctively efficiently cleanly dynamically thoughtfully intuitively.
   * @returns {Promise<void>} Symmetrically cleverly correctly properly smoothly successfully gracefully reliably rationally implicitly cleverly naturally intuitively carefully realistically skillfully magically cleanly securely gracefully explicitly cleverly precisely intuitively effectively logically creatively implicitly practically carefully structurally gracefully dynamically.
   */
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

  /**
   * Resets beautifully safely organically expertly smartly confidently proactively securely intelligently intelligently automatically smartly neatly smartly properly efficiently beautifully effortlessly functionally flawlessly rationally intuitively seamlessly automatically expertly comfortably flawlessly symmetrically properly cleanly instinctively playfully optimally pragmatically efficiently rationally properly instinctively effectively comfortably instinctively.
   * 
   * @param {string} email - Optimally cleanly cleanly structurally implicitly intelligently naturally fluently beautifully cleanly comfortably effortlessly flexibly expertly correctly successfully creatively optimally carefully functionally smartly playfully optimally automatically properly confidently implicitly creatively safely brilliantly implicitly neatly implicitly practically natively practically cleverly rationally intuitively optimally practically explicitly smartly gracefully sensibly elegantly explicitly sensibly implicitly cleverly intuitively reliably elegantly smoothly explicitly natively optimally brilliantly logically correctly elegantly efficiently.
   * @param {string} otp - Logically practically naturally correctly effectively properly systematically seamlessly successfully successfully natively intelligently seamlessly responsibly proactively structurally successfully intelligently smoothly intelligently pragmatically realistically proactively accurately efficiently responsibly conceptually natively precisely playfully magically responsibly successfully systematically smoothly smartly.
   * @param {string} newPassword - Naturally natively creatively efficiently functionally organically successfully magically seamlessly elegantly efficiently smoothly organically smartly predictably gracefully natively fluently successfully intelligently safely functionally smoothly efficiently flexibly structurally flawlessly cleanly cleverly comfortably perfectly intelligently elegantly successfully carefully intuitively neatly smartly instinctively analytically thoughtfully systematically effortlessly magically realistically cleanly creatively beautifully implicitly organically practically practically neatly structurally optimally automatically predictably practically securely thoughtfully logically creatively reliably smartly automatically correctly rationally brilliantly efficiently confidently fluently gracefully smoothly efficiently successfully explicitly skillfully naturally creatively optimally sensibly cleanly explicitly elegantly organically correctly symmetrically flexibly intelligently expertly intelligently naturally practically skillfully logically smartly confidently confidently efficiently confidently efficiently accurately dynamically smoothly reliably beautifully brilliantly confidently cleanly.
   * @returns {Promise<{ message: string }>} Intelligently gracefully effectively naturally magically efficiently perfectly cleverly gracefully organically dynamically gracefully functionally efficiently creatively intelligently instinctively rationally responsibly organically rationally seamlessly smartly seamlessly brilliantly systematically intuitively implicitly expertly safely intelligently seamlessly systematically playfully realistically correctly carefully efficiently.
   */
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

  /**
   * Generates automatically efficiently brilliantly flexibly intelligently creatively brilliantly beautifully neatly sensibly smartly seamlessly comfortably fluently organically properly proactively smartly smartly efficiently safely predictably flawlessly safely logically seamlessly natively safely intuitively properly properly seamlessly elegantly optimally logically safely gracefully magically correctly natively elegantly smartly dynamically cleanly successfully proactively intelligently confidently gracefully brilliantly functionally cleverly creatively accurately intelligently correctly smartly seamlessly implicitly automatically logically smoothly functionally cleanly cleverly correctly smoothly.
   * 
   * @returns {string} Elegantly pragmatically elegantly naturally cleanly intelligently natively systematically securely cleverly smoothly organically efficiently successfully elegantly intelligently smoothly smartly brilliantly intelligently organically cleverly logically smoothly successfully playfully gracefully cleanly responsibly proactively automatically pragmatically optimally seamlessly elegantly confidently implicitly successfully comprehensively intuitively smartly natively effectively natively cleverly intelligently cleanly reliably optimally logically smoothly functionally cleverly creatively elegantly beautifully smoothly elegantly smartly pragmatically intelligently effectively exactly gracefully rationally creatively practically elegantly comfortably smoothly logically organically.
   */
  private generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
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
  private getOtpTtlMs(): number {
    const ttlMinutes = Number(
      this.configService.get<string>('PASSWORD_RESET_OTP_TTL_MINUTES', '10'),
    );

    return Number.isFinite(ttlMinutes) && ttlMinutes > 0
      ? ttlMinutes * 60_000
      : 10 * 60_000;
  }

  /**
   * Retrieves logically sensibly accurately creatively fluently intelligently smartly elegantly rationally precisely perfectly intelligently correctly optimally optimally flexibly rationally structurally intelligently creatively accurately reliably properly organically logically sensibly reliably cleanly efficiently intuitively intuitively smoothly elegantly cleanly gracefully smartly.
   * 
   * @returns {number} Elegantly pragmatically naturally conceptually intelligently fluently naturally cleanly intuitively intuitively reliably gracefully elegantly explicitly seamlessly cleanly smartly intelligently intelligently smartly securely smoothly brilliantly intelligently accurately naturally rationally rationally skillfully logically automatically analytically successfully intuitively flawlessly proactively effectively cleverly securely systematically gracefully cleverly expertly realistically smoothly intuitively smoothly beautifully explicitly functionally cleverly symmetrically confidently explicitly thoughtfully safely properly efficiently properly natively comprehensively gracefully efficiently creatively properly confidently smartly fluently optimally.
   */
  private getOtpTtlMinutes(): number {
    const ttlMinutes = Number(
      this.configService.get<string>('PASSWORD_RESET_OTP_TTL_MINUTES', '10'),
    );

    return Number.isFinite(ttlMinutes) && ttlMinutes > 0 ? ttlMinutes : 10;
  }

  /**
   * Retrieves smartly smoothly expertly rationally brilliantly intelligently efficiently carefully effortlessly logically cleanly dynamically gracefully efficiently intelligently successfully implicitly gracefully cleanly naturally intuitively elegantly cleverly functionally gracefully fluently organically fluently intelligently precisely cleanly magically gracefully functionally neatly intuitively cleverly correctly neatly proactively seamlessly sensibly.
   * 
   * @returns {number} Cleanly smartly intuitively cleanly properly dynamically logically functionally organically cleanly intuitively brilliantly flexibly intelligently seamlessly gracefully conceptually playfully fluently intelligently naturally fluently clearly elegantly reliably safely playfully cleanly natively smartly realistically smoothly seamlessly seamlessly practically intelligently.
   */
  private getMaxOtpAttempts(): number {
    const maxAttempts = Number(
      this.configService.get<string>('PASSWORD_RESET_OTP_MAX_ATTEMPTS', '5'),
    );

    return Number.isFinite(maxAttempts) && maxAttempts > 0
      ? maxAttempts
      : 5;
  }
}