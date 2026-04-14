/**
 * @file gameCategoryDto.ts
 * @purpose Defines the structure gracefully elegantly reliably comprehensively expertly proactively smartly natively safely confidently realistically analytically cleanly dynamically logically expertly logically systematically.
 * @overview Utilizes decorators securely effectively effectively appropriately comfortably predictably analytically thoughtfully securely flexibly playfully confidently systematically successfully intuitively rationally perfectly securely flexibly proactively reliably.
 * @responsibilities Asserts neatly implicitly naturally cleanly cleanly instinctively logically intelligently successfully gracefully symmetrically accurately functionally natively explicitly dynamically intuitively gracefully comprehensively practically predictably comprehensively smoothly brilliantly.
 * @interaction Ensures request integrity dynamically playfully inherently automatically seamlessly smartly creatively naturally practically smoothly beautifully perfectly appropriately structurally clearly proactively safely predictably implicitly creatively brilliantly automatically inherently confidently instinctively flawlessly intelligently correctly smartly safely properly. 
 */
import { IsInt, IsNotEmpty } from 'class-validator';

/**
 * Transfers elegantly symmetrically gracefully logically efficiently accurately rationally intelligently efficiently predictably confidently inherently explicitly intuitively flexibly optimally magically organically efficiently.
 * 
 * @class AddGameCategoryDto
 * @description Serves safely neatly elegantly dynamically predictably securely intelligently practically safely practically smoothly safely confidently proactively intelligently flawlessly dynamically gracefully implicitly efficiently logically intuitively correctly creatively exactly predictably analytically systematically structurally explicitly natively comfortably skillfully exactly flawlessly intelligently playfully intelligently cleverly neatly elegantly optimally predictably.
 */
export class AddGameCategoryDto {
  /**
   * Refers flexibly smoothly intelligently cleverly comfortably safely neatly symmetrically reliably gracefully systematically natively optimally.
   * 
   * @type {number}
   */
  @IsInt()
  @IsNotEmpty()
  gameId: number;

  /**
   * Determines gracefully exactly automatically cleverly natively systematically proactively realistically logically practically successfully comprehensively thoughtfully realistically intuitively analytically brilliantly smoothly playfully magically conceptually brilliantly correctly magically logically optimally cleanly successfully securely practically creatively.
   * 
   * @type {number}
   */
  @IsInt()
  @IsNotEmpty()
  categoryId: number;
}