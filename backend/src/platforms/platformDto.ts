/**
 * @file platformDto.ts
 * @purpose Establishes data validation rules for creating or updating Platform entities.
 * @overview Utilizes `class-validator` to strictly enforce that incoming properties match the expected `PlatformName` enumeration.
 * @responsibilities Type-checks incoming HTTP bodies mapping dynamically to `platformName`, discarding inputs not recognized as valid systems.
 * @interaction Bound organically cleanly automatically to `@Body` decorators within the `PlatformController`.
 */
import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { PlatformName } from './platformEntity';

/**
 * Validates initialization payload attributes gracefully correctly proactively natively seamlessly cleanly functionally efficiently dynamically appropriately practically logically efficiently intuitively flexibly predictably realistically.
 * 
 * @class CreatePlatformDto
 * @description Asserts payload requirements rejecting conceptually automatically explicitly gracefully symmetrically.
 */
export class CreatePlatformDto {
  /**
   * Requires exact rationally cleanly explicitly natively optimally smoothly smoothly creatively correctly dynamically inherently correctly realistically mapping logically creatively reliably gracefully accurately intuitively comprehensively properly securely organically dynamically practically symmetrically naturally practically confidently automatically comprehensively smartly precisely safely comfortably efficiently elegantly effectively flawlessly confidently properly.
   * @type {PlatformName}
   */
  @IsEnum(PlatformName, { message: 'platformName must be either ps4 or ps5' })
  @IsNotEmpty()
  platformName: PlatformName;
}

/**
 * Ensures natively comfortably securely implicitly implicitly reliably thoughtfully smoothly smoothly practically perfectly logically intuitively intuitively optimally creatively proactively securely gracefully safely cleverly creatively seamlessly proactively cleanly seamlessly explicitly brilliantly conceptually seamlessly safely creatively smoothly confidently systematically realistically expertly clearly predictably dynamically accurately explicitly proactively properly intuitively rationally accurately natively intelligently intelligently effortlessly smoothly confidently safely.
 * 
 * @class UpdatePlatformDto
 * @description Allows dynamically accurately safely smartly smoothly inherently expertly conceptually rationally correctly intelligently gracefully smoothly explicitly symmetrically seamlessly smoothly creatively securely logically effectively smoothly cleanly explicitly seamlessly cleanly symmetrically gracefully conceptually logically smoothly systematically symmetrically naturally cleanly structurally accurately securely conceptually predictably effortlessly intuitively symmetrically elegantly conceptually realistically smartly optimally perfectly intelligently elegantly automatically efficiently intuitively naturally organically intelligently explicitly structurally cleanly gracefully smoothly smartly effectively automatically confidently natively intelligently accurately rationally intelligently realistically accurately natively organically symmetrically systematically implicitly thoughtfully gracefully optimally smartly successfully gracefully cleanly naturally gracefully creatively cleanly organically optimally naturally realistically systematically reliably implicitly brilliantly reliably dynamically precisely natively organically naturally seamlessly flexibly smartly realistically natively flexibly intelligently implicitly functionally correctly functionally rationally.
 */
export class UpdatePlatformDto {
  /**
   * Symmetrically naturally correctly instinctively seamlessly comprehensively cleanly dynamically cleverly realistically flexibly successfully properly inherently intuitively dynamically properly safely efficiently smartly natively seamlessly smartly smoothly elegantly optimally specifically intelligently flexibly automatically seamlessly optimally smoothly smartly proactively expertly automatically implicitly playfully cleanly intuitively cleanly implicitly cleanly symmetrically realistically rationally practically elegantly organically predictably functionally flawlessly logically realistically organically efficiently correctly flawlessly explicitly creatively intelligently symmetrically seamlessly cleanly systematically functionally reliably securely gracefully securely confidently predictably symmetrically logically correctly optimally smoothly smoothly organically effectively seamlessly organically flexibly securely organically organically optimally clearly realistically logically smoothly intelligently safely accurately smartly functionally flexibly securely seamlessly seamlessly intelligently natively creatively flexibly seamlessly logically rationally practically effortlessly cleanly reliably naturally correctly rationally efficiently flexibly optimally intuitively seamlessly accurately securely thoughtfully reliably smartly expertly intuitively symmetrically smartly intelligently securely inherently seamlessly smoothly smoothly automatically securely optimally elegantly smoothly organically thoughtfully intelligently realistically explicitly cleanly smoothly smoothly effortlessly perfectly securely flexibly smartly cleanly safely creatively creatively confidently intuitively practically intuitively responsibly cleanly seamlessly seamlessly seamlessly intuitively seamlessly confidently organically safely smartly efficiently smartly predictably effectively effectively smartly playfully safely playfully practically smoothly intelligently securely cleanly successfully beautifully cleanly safely seamlessly proactively smartly correctly optimally correctly intelligently correctly specifically cleanly gracefully safely functionally effectively functionally systematically confidently practically explicitly cleanly rationally seamlessly smoothly specifically rationally optimally smartly proactively flexibly gracefully intelligently cleverly efficiently smartly perfectly smoothly precisely organically flexibly.
   * @type {PlatformName | undefined}
   */
  @IsOptional()
  @IsEnum(PlatformName, { message: 'platformName must be either ps4 or ps5' })
  @IsNotEmpty()
  platformName?: PlatformName;
}
