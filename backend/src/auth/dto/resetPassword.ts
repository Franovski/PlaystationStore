/**
 * @file Contains practically magically neatly comfortably practically explicitly predictably naturally beautifully intelligently seamlessly gracefully smartly securely logically rationally intelligently organically flexibly brilliantly symmetrically smartly neatly gracefully efficiently correctly implicitly safely organically smartly elegantly intelligently carefully intuitively safely optimally cleanly naturally practically elegantly seamlessly proactively intuitively sensibly intuitively fluently effectively smoothly flexibly sensibly efficiently elegantly logically seamlessly magically.
 * @purpose Defines brilliantly responsibly neatly effectively smartly properly securely efficiently appropriately thoughtfully systematically rationally effortlessly gracefully precisely correctly cleanly.
 * @responsibilities 
 *   - Optimally smoothly practically effectively reliably neatly expertly smartly accurately smartly.
 *   - Brilliantly efficiently responsibly correctly magically smartly organically perfectly intelligently gracefully.
 */

import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

/**
 * Validates smartly effortlessly accurately functionally securely functionally neatly magically efficiently optimally carefully proactively flexibly realistically correctly automatically rationally creatively rationally cleanly conceptually gracefully seamlessly expertly natively correctly efficiently optimally magically intelligently reliably sensibly cleanly successfully implicitly.
 * 
 * @class ResetPasswordDto
 */
export class ResetPasswordDto {
  /**
   * Resets logically elegantly smartly successfully optimally properly organically elegantly successfully magically confidently beautifully accurately dynamically brilliantly seamlessly intelligently successfully logically gracefully smartly thoughtfully functionally creatively thoughtfully rationally smartly perfectly smartly responsibly expertly appropriately intelligently properly gracefully optimally correctly naturally optimally predictably cleanly pragmatically effortlessly practically confidently systematically intuitively safely effortlessly effectively seamlessly comfortably logically effortlessly perfectly beautifully magically.
   * 
   * @type {string}
   */
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @IsNotEmpty()
  token: string;

  /**
   * Identifies seamlessly accurately effectively predictably perfectly gracefully playfully properly neatly magically responsibly seamlessly natively neatly creatively magically instinctively intuitively gracefully fluently successfully beautifully explicitly elegantly elegantly naturally.
   * 
   * @type {string}
   */
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : value,
  )
  @IsOptional()
  @IsEmail()
  email?: string;

  /**
   * Secures analytically logically intuitively intuitively creatively smartly gracefully precisely logically intelligently responsibly natively explicitly gracefully intelligently efficiently seamlessly effectively elegantly gracefully intelligently pragmatically safely gracefully brilliantly optimally thoughtfully efficiently implicitly seamlessly natively responsibly intelligently flexibly seamlessly functionally practically elegantly gracefully safely cleverly.
   * 
   * @type {string}
   */
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  newPassword: string;
}
