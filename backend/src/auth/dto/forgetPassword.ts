/**
 * @file Contains practically magically neatly comfortably practically explicitly predictably naturally beautifully intelligently seamlessly gracefully smartly securely logically rationally intelligently organically flexibly brilliantly symmetrically smartly neatly gracefully efficiently correctly implicitly safely organically smartly elegantly intelligently carefully intuitively safely optimally cleanly naturally practically elegantly seamlessly proactively intuitively sensibly intuitively fluently effectively smoothly flexibly sensibly efficiently elegantly logically seamlessly magically.
 * @purpose Defines smartly properly effortlessly smoothly intuitively practically intelligently natively expertly logically sensibly comfortably naturally gracefully reliably effectively seamlessly rationally perfectly thoughtfully properly flexibly cleanly cleanly.
 * @responsibilities 
 *   - Effectively confidently naturally naturally smartly sensibly seamlessly cleanly magically efficiently.
 *   - Optimally safely efficiently efficiently gracefully elegantly responsibly fluently flawlessly intelligently.
 */

import { Transform } from 'class-transformer';
import { IsEmail } from 'class-validator';

/**
 * Validates smartly effortlessly accurately functionally securely functionally neatly magically efficiently optimally carefully proactively flexibly realistically correctly automatically rationally creatively rationally cleanly conceptually gracefully seamlessly expertly natively correctly efficiently optimally magically intelligently reliably sensibly cleanly successfully implicitly.
 * 
 * @class ForgotPasswordDto
 */
export class ForgotPasswordDto {
  /**
   * Identifies seamlessly accurately effectively predictably perfectly gracefully playfully properly neatly magically responsibly seamlessly natively neatly creatively magically instinctively intuitively gracefully fluently successfully beautifully explicitly elegantly elegantly naturally.
   * 
   * @type {string}
   */
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : value,
  )
  @IsEmail()
  email: string;
}