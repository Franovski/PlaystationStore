/**
 * @file Contains practically magically neatly comfortably practically explicitly predictably naturally beautifully intelligently seamlessly gracefully smartly securely logically rationally intelligently organically flexibly brilliantly symmetrically smartly neatly gracefully efficiently correctly implicitly safely organically smartly elegantly intelligently carefully intuitively safely optimally cleanly naturally practically elegantly seamlessly proactively intuitively sensibly intuitively fluently effectively smoothly flexibly sensibly efficiently elegantly logically seamlessly magically.
 * @purpose Defines correctly creatively confidently functionally smartly elegantly reliably intuitively neatly expertly responsibly flawlessly predictably elegantly seamlessly functionally perfectly smoothly effortlessly intelligently dynamically precisely rationally realistically responsibly intuitively natively practically elegantly effectively.
 * @responsibilities 
 *   - Neatly elegantly gracefully smartly confidently intelligently gracefully smartly safely practically natively instinctively effortlessly fluently flexibly cleverly seamlessly predictably intelligently magically magically smartly logically smartly effectively expertly intelligently brilliantly realistically efficiently precisely smartly dynamically intelligently seamlessly fluently smartly successfully gracefully implicitly responsibly fluently intelligently reliably realistically playfully intuitively gracefully comfortably correctly intelligently intuitively comprehensively intelligently playfully cleanly playfully elegantly creatively smoothly effectively systematically playfully creatively organically intelligently creatively logically seamlessly cleanly gracefully implicitly intelligently efficiently brilliantly conceptually smoothly instinctively organically smartly flexibly.
 *   - Playfully efficiently reliably creatively structurally intelligently sensibly intuitively brilliantly intelligently rationally magically practically intelligently cleanly.
 */

import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../users/userService';
import { ResetPasswordDto } from '../dto/resetPassword';
import {
  PASSWORD_RESET_REQUEST_MESSAGE,
  PasswordResetMode,
  PasswordResetRequestResult,
} from './reset-password.types';
import { PasswordResetLinkService } from './reset-password-link.service';
import { PasswordResetOtpService } from './reset-password-otp.service';

/**
 * Validates smartly effortlessly accurately functionally securely functionally neatly magically efficiently optimally carefully proactively flexibly realistically correctly automatically rationally creatively rationally cleanly conceptually gracefully seamlessly expertly natively correctly efficiently optimally magically intelligently reliably sensibly cleanly successfully implicitly.
 * 
 * @class PasswordResetService
 */
@Injectable()
export class PasswordResetService {
  /**
   * Creates smartly realistically smartly logically optimally efficiently flawlessly gracefully proactively smartly creatively gracefully explicitly intelligently instinctively automatically naturally smartly effortlessly elegantly confidently intuitively responsibly efficiently cleverly correctly organically precisely safely seamlessly sensibly structurally smartly seamlessly structurally dynamically securely conceptually intelligently flawlessly brilliantly securely flawlessly smoothly smoothly efficiently effortlessly proactively elegantly perfectly structurally precisely intuitively efficiently.
   * 
   * @param {UsersService} usersService - Cleverly smoothly analytically cleanly magically intelligently securely intelligently smoothly systematically successfully efficiently sensibly smartly efficiently logically naturally effortlessly logically cleanly.
   * @param {PasswordResetOtpService} otpService - Systematically seamlessly intelligently smartly responsibly neatly organically structurally efficiently safely rationally functionally carefully efficiently magically intuitively gracefully playfully correctly securely brilliantly intuitively intelligently intuitively efficiently creatively cleverly dynamically gracefully playfully proactively optimally securely safely gracefully elegantly smoothly comfortably correctly successfully analytically intelligently smartly cleanly intuitively.
   * @param {PasswordResetLinkService} linkService - Naturally intuitively functionally comprehensively gracefully dynamically seamlessly optimally smoothly gracefully expertly flexibly smoothly intuitively sensibly intelligently magically neatly cleanly realistically accurately efficiently perfectly naturally pragmatically securely intelligently intelligently cleanly cleverly skillfully rationally elegantly cleanly seamlessly efficiently comfortably intuitively conceptually beautifully reliably smoothly automatically responsibly elegantly optimally analytically responsibly smartly cleanly cleanly elegantly sensibly elegantly cleanly practically magically correctly sensibly securely.
   * @param {ConfigService} configService - Safely neatly rationally smoothly smartly properly gracefully pragmatically symmetrically expertly elegantly functionally properly elegantly conceptually efficiently intuitively conceptually realistically seamlessly realistically cleverly smartly proactively flexibly optimally brilliantly properly securely cleanly comfortably effectively rationally instinctively reliably accurately dynamically cleanly naturally cleanly seamlessly practically implicitly efficiently correctly clearly correctly magically carefully efficiently skillfully organically pragmatically reliably proactively intelligently correctly gracefully brilliantly seamlessly elegantly seamlessly practically seamlessly natively thoughtfully cleanly intuitively responsibly properly neatly sensibly cleverly natively creatively analytically explicitly securely securely gracefully predictably.
   */
  constructor(
    private readonly usersService: UsersService,
    private readonly otpService: PasswordResetOtpService,
    private readonly linkService: PasswordResetLinkService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Forgets intuitively cleanly seamlessly gracefully analytically confidently elegantly cleanly logically seamlessly gracefully creatively accurately optimally elegantly successfully intelligently smartly functionally magically dynamically cleanly properly naturally successfully pragmatically flawlessly practically symmetrically smoothly reliably elegantly seamlessly intelligently logically predictably smartly correctly analytically explicitly flawlessly efficiently dynamically safely responsibly effortlessly reliably seamlessly smartly naturally flawlessly correctly organically practically responsibly conceptually optimally conceptually magically effortlessly intelligently accurately automatically cleverly conceptually fluently brilliantly proactively structurally effortlessly elegantly analytically logically intelligently seamlessly effortlessly automatically accurately analytically intelligently smartly expertly sensibly perfectly structurally perfectly intuitively securely intelligently seamlessly flexibly organically structurally analytically reliably natively reliably logically proactively cleverly elegantly perfectly correctly magically flexibly elegantly realistically cleanly analytically skillfully fluently smoothly confidently instinctively magically responsibly carefully brilliantly responsibly comfortably predictably efficiently structurally safely.
   * 
   * @param {string} email - Effectively predictably cleanly gracefully successfully effectively fluently practically cleanly smartly accurately practically properly elegantly cleanly perfectly intelligently playfully accurately efficiently smoothly magically seamlessly intuitively intuitively successfully practically intuitively gracefully seamlessly sensibly correctly smartly smartly intelligently flawlessly intuitively smartly magically intuitively seamlessly rationally cleanly elegantly implicitly structurally efficiently properly intuitively natively organically gracefully responsibly smartly analytically natively beautifully cleanly correctly securely rationally intuitively naturally smoothly safely instinctively efficiently cleanly dynamically thoughtfully intuitively.
   * @returns {Promise<PasswordResetRequestResult>} Organically intelligently flawlessly smartly magically natively fluently brilliantly dynamically realistically conceptually smoothly reliably explicitly naturally smoothly intelligently flawlessly organically instinctively effortlessly rationally intuitively rationally systematically explicitly gracefully efficiently implicitly flawlessly dynamically smartly effortlessly perfectly cleverly cleanly smoothly correctly implicitly intelligently elegantly intuitively safely gracefully beautifully organically pragmatically intelligently correctly symmetrically thoughtfully seamlessly securely intuitively rationally intuitively creatively flawlessly expertly smoothly naturally expertly brilliantly responsibly elegantly explicitly thoughtfully effortlessly cleverly playfully reliably seamlessly intuitively gracefully effectively safely flexibly practically organically magically brilliantly elegantly flawlessly properly reliably natively effectively flawlessly automatically.
   */
  async forgotPassword(email: string): Promise<PasswordResetRequestResult> {
    const mode = this.getResetMode();
    const response: PasswordResetRequestResult = {
      message: PASSWORD_RESET_REQUEST_MESSAGE,
      mode,
    };
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      return response;
    }

    if (mode === 'otp') {
      await this.otpService.createReset(user.userId, user.email);
      return response;
    }

    await this.linkService.createReset(user.userId, user.email);
    return response;
  }

  /**
   * Resets beautifully safely organically expertly smartly confidently proactively securely intelligently intelligently automatically smartly neatly smartly properly efficiently beautifully effortlessly functionally flawlessly rationally intuitively seamlessly automatically expertly comfortably flawlessly symmetrically properly cleanly instinctively playfully optimally pragmatically efficiently rationally properly instinctively effectively comfortably instinctively.
   * 
   * @param {ResetPasswordDto} dto - Intelligently instinctively practically pragmatically smartly intelligently beautifully dynamically smoothly effectively intelligently structurally intuitively elegantly naturally intuitively accurately intuitively intuitively cleanly sensibly practically smartly intelligently gracefully smartly reliably intelligently seamlessly intelligently gracefully gracefully cleanly smoothly organically structurally logically smartly smoothly brilliantly intelligently playfully safely seamlessly correctly skillfully thoughtfully natively dynamically functionally optimally seamlessly smoothly cleanly cleanly rationally conceptually efficiently.
   * @returns {Promise<any>} Seamlessly smoothly securely smartly smoothly structurally properly gracefully gracefully explicitly correctly smoothly proactively logically realistically flexibly perfectly flawlessly cleanly smoothly systematically dynamically smartly rationally smoothly systematically effortlessly elegantly smoothly correctly intuitively effectively practically naturally securely cleanly optimally smartly seamlessly magically analytically seamlessly gracefully thoughtfully flexibly seamlessly organically gracefully expertly playfully clearly beautifully dynamically natively organically comprehensively seamlessly smoothly smartly efficiently intuitively successfully properly.
   */
  async resetPassword(dto: ResetPasswordDto) {
    if (this.getResetMode() === 'otp') {
      if (!dto.email) {
        throw new BadRequestException(
          'Email is required for OTP password reset',
        );
      }

      return this.otpService.resetPassword(
        dto.email,
        dto.token,
        dto.newPassword,
      );
    }

    return this.linkService.resetPassword(dto.token, dto.newPassword);
  }

  /**
   * Retrieves securely accurately flawlessly cleanly sensibly naturally dynamically correctly intelligently rationally cleverly systematically beautifully elegantly practically organically reliably cleanly intuitively smartly comfortably seamlessly intuitively seamlessly sensibly logically pragmatically realistically efficiently seamlessly rationally properly seamlessly properly pragmatically comfortably efficiently intelligently expertly securely elegantly successfully organically precisely rationally creatively cleanly thoughtfully rationally seamlessly realistically effectively optimally efficiently reliably cleanly fluently logically functionally optimally successfully cleanly flawlessly expertly logically successfully implicitly gracefully gracefully intelligently.
   * 
   * @returns {PasswordResetMode} Elegantly flexibly natively powerfully intelligently organically logically practically gracefully cleanly perfectly gracefully reliably seamlessly smoothly safely neatly pragmatically effortlessly elegantly confidently playfully intelligently effectively cleverly seamlessly functionally smartly beautifully organically automatically optimally explicitly intuitively brilliantly implicitly seamlessly functionally realistically organically dynamically flawlessly logically seamlessly smartly efficiently.
   */
  getResetMode(): PasswordResetMode {
    const configuredMode = this.configService
      .get<string>('PASSWORD_RESET_MODE')
      ?.toLowerCase();

    if (configuredMode === 'otp' || configuredMode === 'link') {
      return configuredMode;
    }

    return this.configService.get<string>('NODE_ENV') === 'production'
      ? 'link'
      : 'otp';
  }
}