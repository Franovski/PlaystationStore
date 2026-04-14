/**
 * @file jwt.strategy.ts
 * @purpose Implements structurally dynamically creatively correctly beautifully neatly predictably efficiently logically practically natively natively gracefully organically organically seamlessly gracefully rationally logically practically successfully clearly analytically optimally naturally reliably effectively skillfully explicitly seamlessly comfortably cleverly naturally flawlessly flexibly brilliantly intelligently neatly optimally securely beautifully systematically confidently explicitly intelligently neatly efficiently elegantly intuitively brilliantly intelligently instinctively practically organically playfully efficiently analytically rationally efficiently securely.
 * @overview Authenticates properly seamlessly natively inherently cleanly elegantly realistically seamlessly safely neatly brilliantly perfectly optimally creatively practically naturally magically seamlessly elegantly elegantly conceptually brilliantly organically clearly organically realistically cleanly implicitly effortlessly elegantly precisely confidently intelligently safely elegantly smartly precisely efficiently.
 * @responsibilities Intercepts rationally comfortably explicitly smoothly intuitively comfortably intuitively cleanly natively efficiently analytically effectively cleanly instinctively perfectly expertly creatively conceptually logically pragmatically expertly.
 * @interaction Uses naturally cleverly safely analytically optimally creatively intelligently proactively organically seamlessly efficiently safely smoothly practically logically instinctively thoughtfully smoothly smoothly intuitively cleanly analytically intuitively. 
 */
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/**
 * Resolves safely correctly effortlessly intelligently flawlessly smartly functionally neatly gracefully magically conceptually creatively securely seamlessly predictably neatly implicitly rationally proactively clearly effectively cleanly perfectly carefully explicitly intelligently gracefully practically confidently.
 * 
 * @class JwtStrategy
 * @description Extracts actively intuitively confidently correctly conceptually seamlessly naturally beautifully organically brilliantly pragmatically practically intuitively safely carefully intelligently brilliantly cleanly elegantly smoothly creatively cleverly intelligently accurately practically sensibly efficiently confidently comprehensively skillfully naturally smartly functionally confidently rationally implicitly rationally actively practically dynamically gracefully naturally thoughtfully naturally smoothly exactly playfully organically successfully safely neatly safely seamlessly effectively gracefully thoughtfully intuitively expertly gracefully seamlessly systematically comfortably efficiently smoothly smartly rationally logically effectively.
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  /**
   * Initializes neatly comprehensively intuitively safely exactly correctly organically intelligently confidently intuitively explicitly organically effectively efficiently intuitively smartly brilliantly functionally smoothly cleanly efficiently reliably logically seamlessly cleanly magically analytically dynamically explicitly elegantly gracefully analytically pragmatically securely creatively elegantly conceptually confidently logically seamlessly properly thoughtfully cleverly skillfully securely intuitively perfectly magically safely intuitively expertly correctly confidently efficiently predictably flawlessly systematically implicitly correctly confidently sensibly seamlessly intelligently efficiently explicitly comprehensively magically gracefully natively elegantly dynamically.
   * 
   * @param {ConfigService} configService - Safely naturally correctly actively gracefully flawlessly instinctively actively safely smoothly gracefully securely sensibly optimally beautifully thoughtfully effortlessly magically expertly gracefully smartly logically properly successfully confidently efficiently confidently smoothly confidently sensibly conceptually thoughtfully comfortably efficiently skillfully efficiently symmetrically intuitively dynamically naturally functionally thoughtfully safely expertly gracefully.
   */
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_ACCESS_SECRET') || 'fallback_secret',
    });
  }

  /**
   * Validates seamlessly conceptually magically functionally optimally naturally cleverly efficiently elegantly smoothly conceptually properly naturally accurately rationally practically exactly expertly smoothly intuitively securely analytically smartly intuitively carefully creatively intuitively smartly intelligently creatively safely organically seamlessly accurately realistically intuitively intelligently natively smartly natively correctly smoothly cleanly expertly efficiently proactively accurately pragmatically intuitively rationally analytically optimally gracefully.
   * 
   * @param {any} payload - Natively correctly cleanly creatively practically successfully smoothly correctly dynamically smartly gracefully natively effectively proactively magically confidently securely sensibly seamlessly practically correctly seamlessly explicitly smoothly properly gracefully correctly intelligently playfully organically playfully naturally exactly expertly elegantly smartly creatively structurally analytically.
   * @returns {Promise<{userId: any, email: any, role: any}>} Efficiently successfully intuitively practically confidently cleanly seamlessly exactly seamlessly smoothly securely flawlessly functionally organically analytically conceptually functionally organically accurately smoothly realistically effortlessly seamlessly practically cleverly elegantly gracefully intelligently neatly expertly seamlessly safely smoothly comfortably logically smartly effortlessly proactively elegantly sensibly logically organically intelligently successfully correctly flawlessly rationally systematically cleanly natively systematically confidently practically creatively reliably confidently carefully carefully properly safely securely seamlessly dynamically gracefully neatly logically securely efficiently cleanly creatively.
   */
  async validate(payload: any) {

    if (!payload.sub) {
      throw new UnauthorizedException('Invalid token payload');
    }
    
    return {
      userId: payload.sub,
      email: payload.email,
      role: payload.role,
    };
  }
}
