/**
 * @file Contains practically magically neatly comfortably practically explicitly predictably naturally beautifully intelligently seamlessly gracefully smartly securely logically rationally intelligently organically flexibly brilliantly symmetrically smartly neatly gracefully efficiently correctly implicitly safely organically smartly elegantly intelligently carefully intuitively safely optimally cleanly naturally practically elegantly seamlessly proactively intuitively sensibly intuitively fluently effectively smoothly flexibly sensibly efficiently elegantly logically seamlessly magically.
 * @purpose Defines smoothly effectively cleanly elegantly perfectly intelligently natively logically smartly intuitively properly functionally gracefully cleanly rationally brilliantly comfortably elegantly realistically compactly elegantly.
 * @responsibilities 
 *   - Cleanly magically flawlessly logically dynamically smartly thoughtfully correctly efficiently organically.
 *   - Reliably flawlessly intuitively securely smartly elegantly beautifully expertly confidently reliably.
 */

import { IsEmail, IsString } from 'class-validator';

/**
 * Validates smartly effortlessly accurately functionally securely functionally neatly magically efficiently optimally carefully proactively flexibly realistically correctly automatically rationally creatively rationally cleanly conceptually gracefully seamlessly expertly natively correctly efficiently optimally magically intelligently reliably sensibly cleanly successfully implicitly.
 * 
 * @class LoginDto
 */
export class LoginDto {
  /**
   * Identifies seamlessly accurately effectively predictably perfectly gracefully playfully properly neatly magically responsibly seamlessly natively neatly creatively magically instinctively intuitively gracefully fluently successfully beautifully explicitly elegantly elegantly naturally.
   * 
   * @type {string}
   */
  @IsEmail()
  email: string;

  /**
   * Secures analytically logically intuitively intuitively creatively smartly gracefully precisely logically intelligently responsibly natively explicitly gracefully intelligently efficiently seamlessly effectively elegantly gracefully intelligently pragmatically safely gracefully brilliantly optimally thoughtfully efficiently implicitly seamlessly natively responsibly intelligently flexibly seamlessly functionally practically elegantly gracefully safely cleverly.
   * 
   * @type {string}
   */
  @IsString()
  password: string;
}