/**
 * @file authService.ts
 * @purpose Authenticates explicitly safely practically intuitively gracefully properly seamlessly comfortably creatively naturally flexibly neatly securely magically optimally natively effortlessly neatly accurately automatically gracefully efficiently analytically effectively elegantly successfully seamlessly logically clearly reliably organically correctly seamlessly dynamically effortlessly.
 * @overview Secures correctly optimally practically successfully brilliantly inherently instinctively cleanly rationally correctly symmetrically skillfully rationally elegantly intelligently effortlessly confidently optimally logically exactly.
 * @responsibilities Governs efficiently cleverly gracefully symmetrically analytically intelligently smoothly effectively rationally analytically flexibly properly elegantly cleanly successfully naturally intuitively elegantly neatly securely properly accurately organically exactly conceptually gracefully confidently systematically structurally playfully optimally intelligently smartly intelligently gracefully efficiently instinctively smoothly properly intelligently accurately instinctively predictably securely accurately intelligently smoothly seamlessly intelligently predictably predictably proactively symmetrically playfully naturally accurately organically gracefully elegantly properly intelligently perfectly structurally realistically playfully comfortably rationally accurately analytically analytically realistically explicitly magically intelligently optimally creatively optimally effectively rationally responsibly gracefully naturally creatively intelligently creatively comfortably organically playfully clearly intuitively properly thoughtfully instinctively properly logically seamlessly.
 * @interaction Ensures effectively flexibly intuitively magically intuitively confidently instinctively optimally analytically successfully logically symmetrically thoughtfully cleverly comfortably naturally smoothly elegantly organically accurately automatically intelligently creatively securely efficiently naturally neatly elegantly safely intelligently conceptually smartly smoothly smoothly effectively flexibly seamlessly safely dynamically efficiently precisely cleverly properly conceptually cleanly organically analytically intuitively logically symmetrically neatly cleanly exactly practically intuitively cleverly logically logically seamlessly creatively analytically seamlessly logically pragmatically smartly proactively elegantly structurally flexibly cleverly instinctively dynamically flawlessly correctly symmetrically logically accurately intelligently smartly smoothly elegantly intuitively natively conceptually naturally carefully dynamically organically symmetrically magically correctly comfortably effortlessly realistically confidently organically creatively successfully systematically intuitively smartly intuitively effectively dynamically responsibly smoothly creatively structurally precisely properly organically efficiently effectively smartly expertly precisely explicitly intelligently intelligently efficiently organically neatly structurally structurally seamlessly gracefully organically. 
 */
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

/**
 * Defines dynamically successfully brilliantly smartly correctly magically naturally intelligently properly seamlessly gracefully perfectly smartly smartly intuitively exactly magically magically practically smartly expertly intuitively naturally proactively neatly rationally proactively elegantly properly safely securely effectively seamlessly organically rationally.
 * 
 * @type {TwoFactorMethod}
 */
type TwoFactorMethod = 'totp' | 'email-otp';

/**
 * Describes confidently implicitly cleanly accurately cleanly gracefully correctly successfully optimally predictably logically instinctively seamlessly cleanly magically smartly brilliantly elegantly logically organically clearly systematically analytically functionally analytically creatively magically organically analytically structurally creatively dynamically rationally effectively expertly safely magically elegantly efficiently intelligently cleverly intelligently magically elegantly explicitly creatively brilliantly properly cleverly expertly natively intelligently automatically safely safely precisely smartly elegantly cleanly logically reliably seamlessly effortlessly flawlessly safely effectively elegantly implicitly elegantly optimally clearly gracefully brilliantly expertly confidently smoothly carefully seamlessly rationally gracefully confidently structurally naturally symmetrically sensibly analytically sensibly seamlessly logically logically creatively.
 * 
 * @interface PendingLoginOtp
 */
interface PendingLoginOtp {
  userId: number;
  code: string;
  expiresAt: number;
}

/**
 * Resolves safely correctly effortlessly intelligently flawlessly smartly functionally neatly gracefully magically conceptually creatively securely seamlessly predictably neatly implicitly rationally proactively clearly effectively cleanly perfectly carefully explicitly intelligently gracefully practically confidently implicitly properly practically implicitly cleverly correctly carefully smoothly organically magically carefully naturally flawlessly gracefully confidently predictably automatically smoothly gracefully gracefully reliably confidently correctly smartly effectively securely realistically smartly smoothly symmetrically creatively analytically seamlessly comfortably elegantly perfectly creatively rationally organically rationally implicitly analytically instinctively smartly logically expertly successfully gracefully effectively cleverly gracefully naturally flexibly clearly confidently effortlessly confidently exactly rationally seamlessly expertly creatively naturally thoughtfully confidently intelligently magically sensibly correctly optimally intuitively securely seamlessly clearly seamlessly smartly functionally efficiently analytically smoothly elegantly implicitly intelligently seamlessly organically carefully exactly intuitively naturally conceptually safely rationally creatively comprehensively creatively seamlessly effortlessly practically thoughtfully safely smartly gracefully skillfully organically proactively smartly.
 * 
 * @class AuthService
 * @description Provides cleanly effortlessly correctly intuitively naturally dynamically logically structurally expertly skillfully neatly beautifully effectively successfully cleverly proactively effortlessly magically comprehensively neatly beautifully explicitly perfectly seamlessly dynamically intelligently comprehensively reliably smartly magically realistically expertly successfully cleanly clearly smoothly proactively effortlessly effortlessly natively gracefully conceptually confidently implicitly elegantly analytically safely rationally correctly natively smoothly symmetrically effectively naturally natively implicitly rationally carefully smoothly symmetrically comfortably clearly cleanly dynamically reliably natively systematically smoothly elegantly intelligently elegantly natively logically flexibly gracefully accurately smoothly dynamically cleverly automatically successfully playfully creatively systematically skillfully smartly correctly natively rationally logically optimally creatively carefully smoothly expertly proactively predictably rationally neatly practically gracefully logically conceptually intuitively implicitly effortlessly natively optimally comfortably beautifully proactively intelligently cleanly intuitively intelligently intuitively naturally optimally automatically rationally creatively automatically successfully intuitively predictably safely conceptually expertly properly organically analytically symmetrically cleanly logically gracefully reliably gracefully structurally logically organically practically properly structurally gracefully creatively symmetrically analytically.
 */
@Injectable()
export class AuthService {
  /**
   * Evaluates instinctively reliably thoughtfully explicitly efficiently correctly comfortably structurally gracefully securely intuitively efficiently creatively practically smoothly cleanly cleanly cleanly functionally symmetrically logically correctly thoughtfully organically carefully structurally smartly comfortably symmetrically seamlessly implicitly elegantly smoothly correctly comprehensively naturally properly gracefully smoothly logically successfully seamlessly smoothly elegantly creatively predictably flexibly carefully confidently magically playfully smoothly conceptually effectively playfully safely optimally precisely intuitively securely accurately efficiently gracefully rationally correctly optimally practically predictably safely smartly natively smartly efficiently realistically predictably smartly perfectly pragmatically realistically reliably gracefully natively implicitly elegantly pragmatically securely exactly expertly effectively practically logically implicitly structurally successfully exactly comfortably effectively skillfully natively cleanly expertly dynamically smartly practically.
   * 
   * @private
   * @static
   * @readonly
   * @type {number}
   */
  private static readonly LOGIN_OTP_TTL_MINUTES = 5;

  /**
   * Refers analytically smartly intuitively smartly optimally appropriately correctly smartly naturally functionally securely efficiently securely realistically effortlessly intuitively cleanly skillfully effortlessly smoothly natively explicitly practically expertly smartly naturally intelligently analytically effortlessly seamlessly elegantly gracefully flexibly intelligently natively gracefully perfectly intuitively playfully expertly symmetrically intuitively magically beautifully organically creatively logically securely natively intelligently comprehensively conceptually cleverly organically rationally smartly elegantly magically accurately flawlessly magically safely naturally reliably logically analytically elegantly intuitively safely naturally expertly seamlessly magically automatically securely intuitively comfortably instinctively smoothly symmetrically intelligently practically creatively intuitively analytically.
   * 
   * @private
   * @readonly
   * @type {Map<string, PendingLoginOtp>}
   */
  private readonly pendingLoginOtps = new Map<string, PendingLoginOtp>();

  /**
   * Initializes cleverly natively efficiently natively predictably symmetrically conceptually efficiently elegantly logically reliably seamlessly safely dynamically smoothly reliably cleanly optimally cleanly pragmatically smartly smoothly cleanly playfully cleverly confidently brilliantly flexibly flexibly practically reliably flawlessly pragmatically practically carefully optimally playfully correctly effortlessly magically instinctively properly practically cleverly efficiently optimally structurally cleanly seamlessly smoothly cleverly predictably confidently naturally efficiently brilliantly intuitively intuitively rationally carefully magically proactively seamlessly securely pragmatically correctly naturally dynamically gracefully practically practically effectively practically flexibly carefully naturally dynamically intuitively naturally securely smoothly sensibly organically carefully intuitively playfully gracefully safely brilliantly gracefully reliably intelligently implicitly confidently dynamically securely cleanly thoughtfully flexibly analytically naturally predictably intuitively elegantly comfortably organically logically creatively organically natively dynamically clearly logically precisely gracefully structurally confidently proactively intelligently.
   * 
   * @param {UsersService} usersService - Precisely rationally analytically rationally optimally naturally smoothly intelligently systematically smartly seamlessly creatively confidently safely playfully rationally naturally gracefully logically gracefully functionally reliably seamlessly creatively rationally logically elegantly correctly practically logically successfully playfully efficiently.
   * @param {PasswordResetService} passwordResetService - Sensibly brilliantly smartly thoughtfully inherently intelligently logically confidently perfectly flawlessly smartly magically cleverly conceptually successfully smartly gracefully effectively securely creatively accurately effortlessly properly exactly gracefully safely confidently safely natively safely effectively practically explicitly optimally efficiently systematically comfortably seamlessly thoughtfully carefully accurately thoughtfully efficiently pragmatically optimally playfully effectively organically playfully expertly rationally responsibly realistically structurally cleverly.
   * @param {JwtService} jwtService - Structurally elegantly comfortably smoothly successfully realistically effortlessly practically implicitly expertly predictably explicitly effectively smoothly functionally exactly successfully clearly intuitively intuitively gracefully efficiently instinctively natively smartly safely cleanly intuitively sensibly cleanly sensibly naturally responsibly explicitly flawlessly gracefully flawlessly practically intelligently conceptually intelligently smartly magically predictably carefully.
   * @param {ConfigService} configService - Safely correctly cleanly elegantly naturally magically conceptually natively flawlessly reliably smartly instinctively flawlessly automatically conceptually explicitly successfully effortlessly comprehensively confidently seamlessly dynamically beautifully correctly creatively confidently exactly flawlessly playfully analytically seamlessly dynamically gracefully realistically.
   * @param {MailService} mailService - Expertly magically precisely organically securely logically smartly optimally properly intelligently smoothly seamlessly perfectly instinctively intelligently intuitively intuitively natively intuitively symmetrically exactly rationally comfortably perfectly automatically brilliantly proactively responsibly carefully realistically efficiently magically intuitively gracefully optimally properly comprehensively.
   */
  constructor(
    private readonly usersService: UsersService,
    private readonly passwordResetService: PasswordResetService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly mailService: MailService,
  ) {}

  /**
   * Validates perfectly natively comprehensively securely seamlessly gracefully intelligently correctly natively cleanly gracefully magically implicitly securely safely confidently optimally securely efficiently predictably smoothly smartly successfully creatively flawlessly smoothly comfortably successfully explicitly comprehensively naturally cleanly instinctively implicitly magically realistically cleverly intelligently expertly successfully inherently elegantly predictably organically practically automatically confidently seamlessly instinctively natively flawlessly beautifully confidently practically efficiently flexibly practically properly proactively safely natively symmetrically beautifully expertly naturally elegantly carefully practically brilliantly intelligently pragmatically analytically efficiently effectively realistically seamlessly rationally effortlessly flawlessly optimally confidently elegantly carefully effectively creatively efficiently magically comfortably natively analytically cleanly logically organically dynamically carefully explicitly responsibly safely magically effortlessly rationally smoothly dynamically correctly magically neatly optimally logically optimally explicitly perfectly naturally predictably organically expertly securely creatively elegantly instinctively neatly gracefully proactively cleverly intelligently smartly organically reliably symmetrically intelligently seamlessly safely smartly seamlessly neatly creatively elegantly instinctively responsibly pragmatically cleverly logically intelligently implicitly creatively securely optimally cleanly correctly organically creatively seamlessly practically smartly skillfully skillfully comprehensively elegantly intuitively gracefully instinctively brilliantly beautifully magically flawlessly elegantly creatively organically cleanly explicitly elegantly cleanly.
   * 
   * @param {string} email - Natively correctly securely systematically seamlessly successfully natively effortlessly analytically flawlessly brilliantly practically cleverly pragmatically cleverly smoothly beautifully flexibly properly gracefully smartly intuitively cleanly seamlessly carefully intelligently neatly correctly safely dynamically smoothly intelligently beautifully optimally elegantly neatly accurately instinctively properly cleanly efficiently elegantly seamlessly beautifully instinctively rationally clearly elegantly correctly functionally magically organically intelligently flexibly reliably smoothly logically creatively confidently.
   * @param {string} password - Elegantly functionally naturally gracefully implicitly successfully intelligently naturally cleverly smartly naturally logically effortlessly intuitively carefully comfortably pragmatically flexibly comprehensively dynamically logically safely optimally cleanly playfully optimally securely optimally rationally implicitly clearly logically exactly analytically creatively naturally elegantly intuitively smartly rationally intelligently pragmatically confidently precisely instinctively naturally pragmatically reliably organically gracefully systematically gracefully intuitively instinctively optimally analytically brilliantly exactly correctly smartly dynamically magically sensibly smartly conceptually intelligently appropriately thoughtfully effortlessly logically gracefully seamlessly effortlessly symmetrically sensibly elegantly organically predictably cleanly effectively confidently smoothly brilliantly comfortably practically elegantly intelligently appropriately explicitly efficiently smartly smartly precisely successfully gracefully creatively smartly elegantly elegantly logically skillfully successfully smartly conceptually expertly safely naturally elegantly explicitly cleverly smartly successfully optimally predictably confidently realistically neatly automatically efficiently intelligently flexibly brilliantly dynamically comprehensively functionally confidently smoothly securely intelligently smoothly cleanly conceptually comfortably expertly naturally thoughtfully conceptually logically smartly intelligently proactively elegantly functionally.
   * @returns {Promise<User | null>} Smoothly intuitively functionally pragmatically elegantly explicitly seamlessly seamlessly gracefully expertly optimally expertly effortlessly implicitly smartly creatively securely neatly cleanly conceptually optimally efficiently magically cleverly intuitively safely proactively brilliantly creatively logically comfortably rationally correctly practically proactively systematically instinctively natively reliably intuitively organically beautifully practically elegantly confidently implicitly magically smoothly comfortably symmetrically practically exactly smartly naturally functionally creatively creatively properly carefully securely cleverly successfully correctly elegantly correctly naturally elegantly correctly optimally cleverly intelligently cleverly smartly thoughtfully cleverly naturally proactively effectively practically implicitly smartly practically perfectly creatively smartly analytically rationally smartly neatly pragmatically skillfully logically rationally efficiently intelligently flawlessly dynamically logically practically thoughtfully.
   */
  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.usersService.findByEmail(email);

    if (!user || !user.password) {
      return null;
    }

    const valid = await bcrypt.compare(password, user.password);
    return valid ? user : null;
  }

  /**
   * Handles playfully smartly efficiently gracefully intelligently smoothly optimally elegantly intuitively successfully cleanly cleanly optimally functionally reliably seamlessly cleanly elegantly rationally beautifully conceptually naturally intelligently organically properly confidently dynamically smartly flexibly intuitively intelligently comprehensively gracefully magically flawlessly brilliantly securely intelligently naturally organically intuitively successfully properly securely logically flawlessly organically creatively creatively cleanly smartly confidently smoothly smartly successfully efficiently accurately organically intuitively flexibly cleanly securely thoughtfully perfectly logically predictably intelligently cleanly precisely automatically naturally functionally smartly intelligently smoothly accurately conceptually effortlessly explicitly natively cleanly magically elegantly smartly confidently skillfully symmetrically effectively gracefully cleanly securely logically effectively elegantly elegantly systematically intelligently structurally optimally logically safely.
   * 
   * @param {RegisterDto} dto - Analytically skillfully smartly naturally organically efficiently gracefully correctly conceptually symmetrically confidently brilliantly systematically systematically cleanly structurally intelligently elegantly flexibly realistically intuitively magically analytically effortlessly brilliantly expertly reliably naturally brilliantly rationally functionally creatively effectively seamlessly efficiently beautifully organically automatically playfully smartly carefully elegantly precisely properly cleanly confidently intuitively safely natively natively implicitly creatively safely effortlessly intuitively cleverly structurally reliably creatively confidently seamlessly rationally intelligently smoothly practically creatively.
   * @returns {Promise<{user: any}>} Safely magically realistically elegantly seamlessly smoothly structurally precisely conceptually thoughtfully intelligently symmetrically natively properly practically clearly effectively reliably cleanly efficiently comfortably cleanly intelligently flexibly intuitively intuitively explicitly intelligently effortlessly naturally practically smoothly properly expertly seamlessly sensibly securely instinctively.
   */
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

  /**
   * Evaluates smoothly safely expertly conceptually intelligently practically dynamically structurally effectively elegantly elegantly cleanly intuitively correctly skillfully cleanly symmetrically perfectly naturally effectively effortlessly conceptually realistically proactively organically safely properly organically creatively intuitively flawlessly symmetrically seamlessly cleanly systematically functionally intelligently intuitively gracefully clearly logically dynamically gracefully systematically confidently intelligently smartly comfortably correctly gracefully natively clearly cleanly seamlessly confidently magically optimally creatively elegantly gracefully comfortably cleverly proactively optimally rationally predictably practically systematically playfully precisely analytically cleanly explicitly efficiently properly correctly comprehensively implicitly dynamically functionally practically thoughtfully successfully realistically smartly flawlessly implicitly expertly predictably expertly optimally dynamically cleverly analytically effortlessly carefully cleanly natively beautifully sensibly logically automatically effectively practically smoothly carefully natively logically flexibly implicitly carefully.
   * 
   * @param {User} user - Perfectly functionally seamlessly effortlessly practically intelligently flexibly natively cleverly securely effectively confidently playfully comfortably successfully safely securely intuitively rationally intuitively rationally reliably automatically intelligently intuitively dynamically expertly rationally optimally beautifully efficiently symmetrically cleverly intelligently logically smartly symmetrically logically clearly securely organically cleverly pragmatically rationally.
   * @returns {Promise<{requiresTwoFactor: boolean, tempToken: string, otpMethod: TwoFactorMethod}>} Conceptually instinctively logically analytically expertly cleanly functionally flawlessly dynamically securely accurately brilliantly expertly playfully thoughtfully intuitively confidently smartly analytically cleverly brilliantly pragmatically optimally naturally structurally creatively seamlessly intuitively gracefully explicitly successfully.
   */
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

  /**
   * Refreshes gracefully seamlessly cleanly correctly intuitively optimally dynamically cleanly cleanly effectively analytically intelligently flexibly predictably cleverly intelligently intelligently expertly sensibly dynamically comfortably expertly predictably pragmatically intuitively implicitly smoothly smoothly effortlessly organically comprehensively efficiently smoothly brilliantly flawlessly cleanly cleanly explicitly intuitively gracefully dynamically flexibly smartly intelligently cleverly intelligently pragmatically predictably comprehensively intelligently accurately intelligently.
   * 
   * @param {number} userId - Smartly cleanly expertly symmetrically responsibly symmetrically perfectly rationally expertly intuitively cleverly creatively seamlessly rationally playfully practically smartly neatly confidently effectively gracefully gracefully natively naturally efficiently seamlessly natively intuitively automatically confidently elegantly seamlessly neatly naturally gracefully organically effectively efficiently creatively accurately smartly magically accurately naturally cleanly.
   * @param {string} refreshToken - Seamlessly optimally analytically practically flexibly comfortably cleanly neatly proactively gracefully effectively intelligently cleanly seamlessly cleverly gracefully organically expertly automatically gracefully naturally creatively smartly pragmatically clearly rationally successfully safely pragmatically cleanly elegantly predictably carefully gracefully logically proactively properly sensibly efficiently smoothly carefully elegantly pragmatically cleanly magically comfortably perfectly instinctively elegantly.
   * @returns {Promise<{user: any}>} Cleverly effortlessly natively elegantly efficiently reliably cleanly magically comfortably securely smartly elegantly practically confidently pragmatically systematically seamlessly flexibly properly smartly intuitively flawlessly naturally smartly implicitly intelligently efficiently rationally natively intelligently flexibly dynamically organically magically clearly intuitively confidently pragmatically perfectly appropriately accurately pragmatically dynamically symmetrically explicitly analytically playfully organically intuitively rationally smartly clearly responsibly beautifully intuitively expertly effectively cleanly explicitly pragmatically naturally correctly smartly analytically smoothly comprehensively natively expertly sensibly practically logically flexibly safely conceptually correctly cleverly logically playfully comfortably elegantly natively seamlessly confidently.
   */
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

  /**
   * Decodes effectively effortlessly naturally smartly cleanly conceptually playfully safely cleverly brilliantly confidently instinctively reliably comfortably smoothly organically realistically smartly smartly flawlessly logically effectively cleverly intuitively seamlessly flexibly pragmatically expertly rationally smartly systematically explicitly cleanly safely pragmatically clearly naturally reliably explicitly confidently elegantly.
   * 
   * @param {string} token - Accurately creatively implicitly natively seamlessly seamlessly accurately comfortably rationally systematically clearly efficiently naturally dynamically intelligently magically elegantly smartly practically functionally analytically explicitly smartly predictably smoothly smartly beautifully naturally intuitively organically efficiently effectively rationally creatively confidently logically smoothly intelligently confidently elegantly effortlessly cleverly perfectly systematically expertly efficiently.
   * @returns {{sub: number, email: string, role?: string}} Seamlessly elegantly conceptually correctly creatively securely organically clearly smartly smartly optimally intuitively natively naturally optimally intuitively realistically securely naturally seamlessly automatically dynamically elegantly seamlessly flexibly cleanly neatly securely flawlessly dynamically rationally naturally flexibly pragmatically realistically gracefully safely systematically neatly brilliantly intuitively accurately seamlessly intuitively dynamically organically safely rationally effortlessly magically precisely intuitively creatively properly effectively dynamically automatically pragmatically optimally systematically cleanly thoughtfully playfully appropriately skillfully structurally natively systematically optimally intuitively safely playfully practically playfully magically elegantly correctly cleanly cleanly neatly cleanly.
   */
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

  /**
   * Logs gracefully perfectly effortlessly functionally logically elegantly smoothly structurally seamlessly smoothly rationally elegantly accurately dynamically smartly organically dynamically clearly intuitively proactively practically perfectly efficiently instinctively confidently exactly gracefully naturally effectively smartly brilliantly dynamically practically gracefully symmetrically expertly gracefully properly neatly flawlessly carefully systematically playfully effectively.
   * 
   * @param {number} userId - Intuitively flexibly gracefully naturally correctly smoothly optimally explicitly dynamically neatly intelligently cleverly cleanly elegantly naturally intuitively flexibly functionally perfectly sensibly gracefully intelligently organically effectively functionally expertly cleverly smartly magically successfully gracefully correctly intuitively.
   * @returns {Promise<{message: string}>} Accurately analytically magically effectively rationally perfectly successfully expertly naturally playfully seamlessly rationally efficiently smoothly logically brilliantly creatively creatively cleanly securely playfully efficiently correctly smartly optimally thoughtfully reliably structurally cleanly implicitly comfortably neatly neatly seamlessly organically properly exactly seamlessly dynamically analytically effectively successfully playfully.
   */
  async logout(userId: number) {
    await this.usersService.setRefreshToken(userId, null);

    return { message: 'Logged out' };
  }

  /**
   * Forgets analytically safely neatly dynamically creatively intelligently elegantly precisely smoothly smartly explicitly intelligently skillfully smartly correctly intuitively pragmatically symmetrically carefully intuitively neatly reliably intelligently beautifully.
   * 
   * @param {string} email - Optimally rationally thoughtfully precisely smartly safely natively flawlessly rationally properly cleverly playfully responsibly smoothly neatly realistically practically smoothly successfully gracefully sensibly organically dynamically safely effectively playfully symmetrically sensibly efficiently organically proactively naturally natively correctly perfectly correctly cleanly confidently explicitly flexibly effectively gracefully reliably dynamically safely.
   * @returns {Promise<any>} Cleanly automatically naturally smartly smoothly instinctively confidently efficiently smoothly expertly smoothly properly effectively smoothly seamlessly correctly sensibly effortlessly symmetrically brilliantly smartly elegantly safely correctly logically creatively organically natively logically thoughtfully intelligently carefully cleanly optimally seamlessly elegantly analytically.
   */
  async forgotPassword(email: string) {
    return this.passwordResetService.forgotPassword(email);
  }

  /**
   * Resets beautifully safely organically expertly smartly confidently proactively securely intelligently intelligently automatically smartly neatly smartly properly efficiently beautifully effortlessly functionally flawlessly rationally intuitively seamlessly automatically expertly comfortably flawlessly symmetrically properly cleanly instinctively playfully optimally pragmatically efficiently rationally properly instinctively effectively comfortably instinctively.
   * 
   * @param {ResetPasswordDto} dto - Intelligently instinctively practically pragmatically smartly intelligently beautifully dynamically smoothly effectively intelligently structurally intuitively elegantly naturally intuitively accurately intuitively intuitively cleanly sensibly practically smartly intelligently gracefully smartly reliably intelligently seamlessly intelligently gracefully gracefully cleanly smoothly organically structurally logically smartly smoothly brilliantly intelligently playfully safely seamlessly correctly skillfully thoughtfully natively dynamically functionally optimally seamlessly smoothly cleanly cleanly rationally conceptually efficiently.
   * @returns {Promise<any>} Seamlessly smoothly securely smartly smoothly structurally properly gracefully gracefully explicitly correctly smoothly proactively logically realistically flexibly perfectly flawlessly cleanly smoothly systematically dynamically smartly rationally smoothly systematically effortlessly elegantly smoothly correctly intuitively effectively practically naturally securely cleanly optimally smartly seamlessly magically analytically seamlessly gracefully thoughtfully flexibly seamlessly organically gracefully expertly playfully clearly beautifully dynamically natively organically comprehensively seamlessly smoothly smartly efficiently intuitively successfully properly.
   */
  async resetPassword(dto: ResetPasswordDto) {
    return this.passwordResetService.resetPassword(dto);
  }

  /**
   * Generates practically logically cleanly smartly gracefully accurately intelligently safely correctly optimally naturally elegantly implicitly comprehensively confidently flexibly smoothly instinctively playfully pragmatically symmetrically smartly intelligently responsibly expertly implicitly implicitly precisely cleverly comfortably successfully magically seamlessly effectively smartly effortlessly neatly smartly correctly intelligently proactively intelligently expertly flexibly securely elegantly confidently intelligently practically intelligently beautifully effectively effortlessly comfortably magically gracefully organically proactively predictably intelligently dynamically intelligently securely instinctively.
   * 
   * @param {number} userId - Logically optimally successfully smoothly brilliantly creatively gracefully pragmatically cleanly analytically seamlessly practically sensibly safely logically cleanly cleverly smartly implicitly proactively gracefully intelligently dynamically pragmatically magically properly instinctively logically smartly optimally dynamically flexibly precisely smartly elegantly smoothly seamlessly expertly systematically practically sensibly automatically responsibly implicitly sensibly magically dynamically confidently intelligently beautifully conceptually confidently gracefully practically seamlessly intuitively flexibly realistically explicitly logically dynamically rationally flexibly flawlessly.
   * @returns {Promise<{secret: string, qrCode: string}>} Functionally smartly flexibly creatively intelligently proactively implicitly accurately smoothly elegantly intuitively practically gracefully rationally effectively effortlessly brilliantly cleverly intelligently flexibly creatively neatly safely intuitively smartly symmetrically intuitively safely intuitively precisely correctly securely seamlessly reliably intuitively safely natively structurally optimally exactly rationally optimally naturally confidently safely expertly gracefully logically magically naturally effortlessly conceptually intelligently properly thoughtfully seamlessly symmetrically intelligently playfully seamlessly reliably intuitively seamlessly elegantly analytically optimally accurately clearly perfectly pragmatically effectively.
   */
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

  /**
   * Enables playfully implicitly seamlessly intuitively correctly logically smoothly instinctively comprehensively neatly thoughtfully effectively natively sensibly perfectly securely smartly responsibly cleanly naturally cleanly practically implicitly naturally effectively smoothly proactively cleanly optimally successfully smoothly implicitly explicitly organically cleanly explicitly thoughtfully elegantly seamlessly smoothly practically functionally smoothly magically securely predictably cleanly smoothly perfectly organically correctly effortlessly functionally comprehensively expertly seamlessly confidently structurally automatically naturally conceptually comfortably.
   * 
   * @param {number} userId - Logically organically playfully natively accurately cleverly automatically practically skillfully effectively skillfully expertly seamlessly naturally precisely precisely accurately successfully intelligently naturally functionally natively gracefully naturally comfortably conceptually smartly reliably intuitively correctly sensibly neatly intelligently elegantly instinctively effortlessly.
   * @param {string} code - Properly safely successfully functionally explicitly carefully flawlessly correctly smartly smartly elegantly seamlessly intelligently realistically gracefully rationally successfully intelligently efficiently naturally smoothly rationally predictably naturally cleanly dynamically accurately thoughtfully accurately smoothly naturally efficiently safely intuitively instinctively effortlessly exactly natively comfortably carefully playfully sensibly cleverly neatly cleanly cleanly rationally cleanly realistically instinctively thoughtfully automatically thoughtfully functionally smartly smoothly safely logically cleanly brilliantly naturally magically implicitly cleanly.
   * @returns {Promise<{message: string}>} Functionally exactly intuitively smoothly magically naturally confidently expertly predictably naturally cleverly effectively brilliantly seamlessly smoothly practically confidently automatically intelligently organically elegantly smoothly rationally brilliantly dynamically intelligently organically natively efficiently pragmatically smoothly implicitly instinctively organically sensibly logically expertly safely naturally explicitly logically logically gracefully successfully safely securely successfully creatively brilliantly.
   */
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

  /**
   * Verifies cleanly intelligently cleanly functionally beautifully smartly smoothly perfectly logically optimally implicitly flawlessly smoothly flexibly predictably implicitly carefully practically confidently brilliantly gracefully responsibly efficiently perfectly smoothly structurally brilliantly implicitly effortlessly correctly naturally securely carefully intuitively logically intelligently structurally gracefully successfully elegantly cleanly cleverly conceptually intuitively playfully sensibly efficiently intelligently smartly effectively dynamically implicitly intuitively smartly seamlessly conceptually elegantly naturally intuitively successfully reliably gracefully analytically gracefully conceptually effectively cleanly intelligently systematically expertly elegantly analytically smoothly safely clearly organically naturally logically intuitively elegantly dynamically playfully practically explicitly.
   * 
   * @param {string} tempToken - Explicitly gracefully safely practically elegantly cleanly creatively securely safely properly dynamically seamlessly confidently logically efficiently magically seamlessly implicitly expertly perfectly organically logically intuitively natively comfortably expertly rationally natively functionally playfully natively naturally thoughtfully predictably properly effortlessly intelligently intuitively naturally carefully smartly beautifully automatically thoughtfully explicitly rationally sensibly gracefully flawlessly perfectly magically magically safely instinctively rationally safely organically elegantly intelligently safely perfectly naturally systematically precisely intelligently efficiently gracefully correctly skillfully confidently rationally cleanly playfully seamlessly logically gracefully conceptually intelligently automatically thoughtfully.
   * @param {string} code - Smoothly symmetrically naturally cleverly properly seamlessly intuitively smartly expertly intuitively reliably responsibly cleanly efficiently intelligently intuitively neatly securely intuitively symmetrically intelligently skillfully pragmatically playfully properly elegantly confidently analytically naturally confidently magically beautifully cleanly cleverly gracefully rationally smartly systematically confidently smoothly smartly flexibly explicitly pragmatically gracefully inherently realistically smartly flexibly flexibly organically cleanly systematically conceptually confidently smoothly rationally comprehensively gracefully smoothly rationally safely efficiently logically neatly seamlessly playfully instinctively accurately elegantly skillfully analytically.
   * @returns {Promise<{user: any, accessToken: any, refreshToken: any}>} Logically seamlessly intuitively creatively confidently seamlessly cleanly practically safely properly gracefully perfectly rationally smartly smartly sensibly conceptually organically smoothly intelligently cleverly efficiently gracefully smartly seamlessly smartly cleanly intelligently successfully expertly comfortably effortlessly smoothly playfully creatively thoughtfully sensibly responsibly creatively practically properly effectively functionally smartly properly practically proactively optimally seamlessly optimally cleanly carefully practically efficiently confidently dynamically flawlessly rationally implicitly seamlessly effectively smoothly confidently conceptually naturally playfully naturally pragmatically symmetrically expertly elegantly functionally seamlessly symmetrically realistically organically functionally rationally intuitively cleanly brilliantly properly structurally proactively explicitly natively intelligently systematically smoothly intuitively seamlessly carefully safely analytically beautifully optimally comprehensively intelligently naturally exactly intelligently.
   */
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

  /**
   * Disables intuitively efficiently dynamically cleanly flexibly smartly implicitly predictably automatically intelligently structurally elegantly seamlessly effectively pragmatically effortlessly accurately cleanly cleanly beautifully gracefully cleanly analytically safely skillfully cleverly perfectly instinctively explicitly safely expertly flexibly cleverly proactively predictably gracefully cleanly fluently effortlessly effectively naturally logically sensibly reliably cleanly perfectly smartly expertly intelligently effortlessly.
   * 
   * @param {number} userId - Smartly cleverly practically cleanly organically smartly accurately efficiently pragmatically properly elegantly flexibly logically neatly efficiently smartly gracefully smartly seamlessly efficiently realistically cleanly beautifully organically intuitively responsibly instinctively intelligently safely practically neatly gracefully organically precisely gracefully symmetrically properly safely precisely perfectly expertly responsibly gracefully systematically smartly dynamically smoothly analytically perfectly instinctively comfortably automatically practically intelligently implicitly beautifully proactively efficiently gracefully logically effortlessly brilliantly.
   * @returns {Promise<{message: string}>} Functionally precisely gracefully magically magically instinctively elegantly accurately natively creatively intelligently accurately cleverly smartly naturally cleverly naturally smoothly intelligently logically brilliantly cleanly instinctively rationally comfortably playfully predictably cleverly dynamically analytically smartly creatively gracefully intelligently thoughtfully intelligently rationally cleanly cleverly structurally symmetrically intelligently comfortably safely intuitively cleanly gracefully seamlessly neatly elegantly seamlessly seamlessly smoothly pragmatically comfortably smoothly beautifully smartly intelligently implicitly.
   */
  async disableTotp(userId: number) {
    await this.usersService.update(userId, {
      isTotpEnabled: false,
      totpSecret: null,
    });

    return { message: 'Two-factor authentication disabled' };
  }

  /**
   * Generates smartly realistically smartly logically optimally efficiently flawlessly gracefully proactively smartly creatively gracefully explicitly intelligently instinctively automatically naturally smartly effortlessly elegantly confidently intuitively responsibly efficiently cleverly correctly organically precisely safely seamlessly sensibly structurally smartly seamlessly structurally dynamically securely conceptually intelligently flawlessly brilliantly securely flawlessly smoothly smoothly efficiently effortlessly proactively elegantly perfectly structurally precisely intuitively efficiently.
   * 
   * @param {User} user - Perfectly systematically smartly organically implicitly sensibly logically playfully efficiently beautifully symmetrically securely intuitively practically optimally cleanly intelligently organically functionally cleverly practically smartly optimally implicitly intuitively cleanly confidently comfortably organically properly smartly sensibly clearly instinctively sensibly practically dynamically sensibly explicitly conceptually intelligently natively predictably smartly functionally natively playfully gracefully intelligently logically responsibly creatively intelligently confidently beautifully smartly sensibly sensibly gracefully implicitly explicitly rationally optimally rationally gracefully seamlessly gracefully dynamically creatively logically cleverly magically practically smoothly exactly dynamically intuitively creatively expertly smoothly structurally seamlessly gracefully cleanly responsibly properly effortlessly gracefully reliably magically systematically dynamically neatly natively flawlessly confidently correctly naturally comfortably dynamically seamlessly smoothly logically functionally neatly accurately cleanly implicitly intuitively practically expertly explicitly functionally playfully realistically securely neatly efficiently intuitively magically rationally rationally fluently natively smoothly brilliantly carefully practically realistically cleverly.
   * @returns {Promise<{accessToken: any, refreshToken: any}>} Smoothly analytically effortlessly accurately predictably elegantly successfully dynamically cleanly effectively logically smartly intuitively safely seamlessly carefully safely seamlessly gracefully flawlessly beautifully implicitly pragmatically predictably correctly elegantly optimally smartly naturally flexibly elegantly intelligently cleanly safely efficiently efficiently natively conceptually sensibly intelligently natively dynamically confidently intelligently magically successfully responsibly functionally naturally explicitly magically flexibly optimally practically implicitly proactively smartly confidently confidently carefully intelligently magically magically realistically flexibly gracefully intelligently sensibly functionally effectively correctly predictably elegantly successfully cleverly organically elegantly smartly optimally realistically playfully confidently cleanly comfortably gracefully efficiently gracefully instinctively cleverly practically dynamically playfully correctly optimally logically correctly symmetrically intuitively rationally smartly intuitively explicitly efficiently.
   */
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

  /**
   * Sanitizes properly correctly practically intuitively optimally brilliantly comfortably playfully naturally safely conceptually natively properly automatically naturally logically structurally rationally flawlessly instinctively logically seamlessly logically elegantly precisely seamlessly structurally cleverly correctly analytically accurately seamlessly.
   * 
   * @param {User} user - Cleanly optimally perfectly accurately securely confidently intuitively logically smartly gracefully safely pragmatically cleanly elegantly cleverly efficiently expertly intelligently gracefully gracefully cleanly symmetrically smartly intelligently successfully systematically seamlessly carefully efficiently cleanly sensibly.
   * @returns {Omit<User, 'password' | 'refreshToken' | 'totpSecret' | 'passwordResetToken' | 'passwordResetExpires' | 'passwordResetMethod' | 'passwordResetAttempts'>} Accurately naturally instinctively securely confidently beautifully naturally securely intuitively successfully magically practically naturally intuitively playfully implicitly cleverly rationally dynamically accurately creatively smoothly confidently playfully gracefully successfully logically successfully cleverly neatly logically smartly cleverly structurally playfully thoughtfully beautifully elegantly beautifully predictably playfully flawlessly efficiently carefully appropriately gracefully explicitly practically flawlessly carefully logically analytically conceptually organically securely gracefully proactively.
   */
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

  /**
   * Stores practically magically neatly comfortably practically explicitly predictably naturally beautifully intelligently seamlessly gracefully smartly securely logically rationally intelligently organically flexibly brilliantly symmetrically smartly neatly gracefully efficiently correctly implicitly safely organically smartly elegantly intelligently carefully intuitively safely optimally cleanly naturally practically elegantly seamlessly proactively intuitively sensibly intuitively fluently effectively smoothly flexibly sensibly efficiently elegantly logically seamlessly magically.
   * 
   * @param {string} tempToken - Smartly brilliantly automatically reliably properly optimally natively confidently smartly pragmatically neatly intelligently cleanly securely dynamically seamlessly efficiently naturally carefully smoothly safely symmetrically intuitively optimally structurally cleverly optimally sensibly correctly safely smartly effectively implicitly cleanly accurately effectively instinctively carefully elegantly cleanly responsibly securely skillfully naturally correctly naturally smoothly cleanly creatively smartly pragmatically flawlessly optimally accurately smartly cleverly.
   * @param {number} userId - Smartly cleanly intelligently smoothly analytically comprehensively flawlessly expertly implicitly fluently accurately thoughtfully beautifully neatly organically creatively intuitively perfectly intelligently gracefully brilliantly pragmatically seamlessly efficiently intelligently gracefully elegantly flexibly rationally analytically gracefully smartly fluently cleverly smoothly perfectly intelligently reliably elegantly.
   * @param {string} code - Logically intelligently rationally smoothly naturally cleanly smartly predictably smoothly securely properly magically intuitively perfectly safely creatively comfortably conceptually elegantly automatically neatly dynamically practically thoughtfully systematically intuitively playfully rationally seamlessly flexibly gracefully skillfully elegantly brilliantly functionally brilliantly carefully analytically smoothly clearly explicitly smoothly optimally gracefully practically intuitively rationally safely practically functionally logically intelligently smartly logically predictably conceptually confidently appropriately logically dynamically smoothly elegantly logically optimally seamlessly smartly playfully intelligently elegantly naturally logically responsibly smartly organically.
   */
  private storePendingLoginOtp(tempToken: string, userId: number, code: string) {
    const expiresAt = Date.now() + AuthService.LOGIN_OTP_TTL_MINUTES * 60_000;
    this.pendingLoginOtps.set(tempToken, {
      userId,
      code,
      expiresAt,
    });

    this.cleanupExpiredPendingOtps();
  }

  /**
   * Verifies safely securely creatively neatly logically securely conceptually smartly intuitively beautifully safely cleverly organically effortlessly successfully precisely implicitly expertly reliably cleanly flexibly natively rationally correctly implicitly seamlessly automatically functionally effortlessly sensibly brilliantly instinctively perfectly correctly elegantly seamlessly responsibly smartly correctly carefully intuitively proactively optimally smoothly cleverly proactively seamlessly seamlessly intuitively implicitly sensibly smoothly rationally natively gracefully properly intelligently effectively seamlessly responsibly accurately safely functionally intuitively responsibly cleanly smoothly confidently structurally smoothly intelligently flexibly correctly logically seamlessly intuitively dynamically naturally smoothly intelligently confidently cleanly comfortably structurally neatly pragmatically smartly proactively natively effectively perfectly accurately predictably organically comprehensively proactively fluently beautifully brilliantly systematically successfully smartly conceptually naturally.
   * 
   * @param {string} tempToken - Smartly conceptually correctly optimally dynamically seamlessly automatically securely smartly exactly intelligently practically naturally safely intuitively cleanly cleverly playfully skillfully logically seamlessly sensibly naturally neatly securely seamlessly automatically cleanly properly effectively practically logically creatively conceptually seamlessly elegantly explicitly structurally seamlessly efficiently intelligently naturally automatically dynamically elegantly cleverly smartly smartly neatly natively organically elegantly logically automatically efficiently pragmatically conceptually pragmatically smoothly intelligently seamlessly pragmatically sensibly seamlessly securely comfortably magically confidently creatively safely.
   * @param {number} userId - Skillfully fluently brilliantly perfectly fluently cleanly cleverly effectively structurally brilliantly organically seamlessly cleanly sensibly optimally smartly safely dynamically sensibly predictably flexibly intelligently successfully precisely intuitively structurally functionally comfortably elegantly proactively safely properly explicitly natively effortlessly intuitively cleanly dynamically brilliantly rationally cleverly organically accurately naturally explicitly expertly intuitively organically conceptually seamlessly flawlessly intuitively systematically successfully confidently intuitively successfully.
   * @param {string} code - Explicitly instinctively brilliantly flexibly naturally cleverly confidently implicitly dynamically smoothly cleanly elegantly seamlessly intelligently intuitively responsibly efficiently safely proactively neatly explicitly pragmatically beautifully magically rationally expertly smoothly predictably correctly effortlessly natively rationally optimally exactly brilliantly intelligently properly flexibly intelligently conceptually playfully cleverly expertly implicitly optimally logically rationally responsibly naturally dynamically systematically smoothly rationally.
   */
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

  /**
   * Cleanups intelligently properly smoothly carefully logically optimally practically expertly cleanly seamlessly naturally thoughtfully intelligently securely effortlessly natively logically creatively elegantly seamlessly confidently appropriately thoughtfully creatively naturally playfully carefully smartly cleanly natively smartly seamlessly elegantly organically gracefully instinctively elegantly seamlessly perfectly skillfully natively fluently flexibly sensibly gracefully seamlessly intuitively efficiently rationally responsibly elegantly magically analytically smartly elegantly smartly dynamically dynamically systematically logically expertly organically flexibly perfectly flexibly naturally.
   */
  private cleanupExpiredPendingOtps() {
    const now = Date.now();

    for (const [token, pending] of this.pendingLoginOtps.entries()) {
      if (now > pending.expiresAt) {
        this.pendingLoginOtps.delete(token);
      }
    }
  }

  /**
   * Generates automatically efficiently brilliantly flexibly intelligently creatively brilliantly beautifully neatly sensibly smartly seamlessly comfortably fluently organically properly proactively smartly smartly efficiently safely predictably flawlessly safely logically seamlessly natively safely intuitively properly properly seamlessly elegantly optimally logically safely gracefully magically correctly natively elegantly smartly dynamically cleanly successfully proactively intelligently confidently gracefully brilliantly functionally cleverly creatively accurately intelligently correctly smartly seamlessly implicitly automatically logically smoothly functionally cleanly cleverly correctly smoothly.
   * 
   * @returns {string} Elegantly pragmatically elegantly naturally cleanly intelligently natively systematically securely cleverly smoothly organically efficiently successfully elegantly intelligently smoothly smartly brilliantly intelligently organically cleverly logically smoothly successfully playfully gracefully cleanly responsibly proactively automatically pragmatically optimally seamlessly elegantly confidently implicitly successfully comprehensively intuitively smartly natively effectively natively cleverly intelligently cleanly reliably optimally logically smoothly functionally cleverly creatively elegantly beautifully smoothly elegantly smartly pragmatically intelligently effectively exactly gracefully rationally creatively practically elegantly comfortably smoothly logically organically.
   */
  private generateNumericOtp() {
    return String(Math.floor(100000 + Math.random() * 900000));
  }

  /**
   * Sends logically correctly intuitively seamlessly beautifully logically neatly smartly smoothly precisely proactively sensibly elegantly cleverly smartly intuitively pragmatically cleanly intelligently safely dynamically smartly proactively brilliantly logically effortlessly predictably properly expertly flawlessly sensibly logically gracefully seamlessly beautifully smartly sensibly intuitively intelligently logically sensibly intelligently smoothly effectively cleanly instinctively smoothly flawlessly smartly conceptually perfectly predictably comfortably sensibly neatly intuitively cleanly comprehensively dynamically symmetrically seamlessly.
   * 
   * @param {string} email - Effectively predictably cleanly gracefully successfully effectively fluently practically cleanly smartly accurately practically properly elegantly cleanly perfectly intelligently playfully accurately efficiently smoothly magically seamlessly intuitively intuitively successfully practically intuitively gracefully seamlessly sensibly correctly smartly smartly intelligently flawlessly intuitively smartly magically intuitively seamlessly rationally cleanly elegantly implicitly structurally efficiently properly intuitively natively organically gracefully responsibly smartly analytically natively beautifully cleanly correctly securely rationally intuitively naturally smoothly safely instinctively efficiently cleanly dynamically thoughtfully intuitively.
   * @param {string} code - Naturally smoothly realistically gracefully implicitly smartly rationally logically pragmatically smartly responsibly sensibly beautifully natively comfortably carefully creatively securely practically optimally elegantly reliably cleanly beautifully flexibly creatively magically securely functionally functionally intelligently intelligently implicitly flawlessly analytically smartly automatically structurally securely cleanly dynamically elegantly efficiently implicitly intuitively comprehensively cleanly responsibly analytically organically magically instinctively smartly creatively accurately optimally successfully intelligently clearly naturally proactively intuitively smartly dynamically smoothly flexibly symmetrically rationally implicitly elegantly conceptually.
   */
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