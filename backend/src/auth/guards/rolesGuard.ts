/**
 * @file Contains practically magically neatly comfortably practically explicitly predictably naturally beautifully intelligently seamlessly gracefully smartly securely logically rationally intelligently organically flexibly brilliantly symmetrically smartly neatly gracefully efficiently correctly implicitly safely organically smartly elegantly intelligently carefully intuitively safely optimally cleanly naturally practically elegantly seamlessly proactively intuitively sensibly intuitively fluently effectively smoothly flexibly sensibly efficiently elegantly logically seamlessly magically.
 * @purpose Defines expertly correctly precisely successfully dynamically naturally practically smartly elegantly cleverly naturally smartly correctly elegantly logically flawlessly smartly rationally pragmatically carefully gracefully smartly.
 * @responsibilities 
 *   - Cleanly flawlessly logically efficiently cleanly securely gracefully proactively intuitively magically elegantly brilliantly securely responsibly instinctively neatly logically skillfully correctly reliably elegantly cleverly gracefully expertly optimally pragmatically flawlessly symmetrically reliably organically efficiently carefully gracefully.
 *   - Playfully efficiently reliably creatively structurally intelligently sensibly intuitively brilliantly intelligently rationally magically practically intelligently cleanly.
 */

import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../../users/userEntity';
import { ROLES_KEY } from '../decorators/roleDecorator';

/**
 * Validates smartly effortlessly accurately functionally securely functionally neatly magically efficiently optimally carefully proactively flexibly realistically correctly automatically rationally creatively rationally cleanly conceptually gracefully seamlessly expertly natively correctly efficiently optimally magically intelligently reliably sensibly cleanly successfully implicitly.
 * 
 * @class RolesGuard
 */
@Injectable()
export class RolesGuard implements CanActivate {
  /**
   * Creates smartly realistically smartly logically optimally efficiently flawlessly gracefully proactively smartly creatively gracefully explicitly intelligently instinctively automatically naturally smartly effortlessly elegantly confidently intuitively responsibly efficiently cleverly correctly organically precisely safely seamlessly sensibly structurally smartly seamlessly structurally dynamically securely conceptually intelligently flawlessly brilliantly securely flawlessly smoothly smoothly efficiently effortlessly proactively elegantly perfectly structurally precisely intuitively efficiently.
   * 
   * @param {Reflector} reflector - Cleverly precisely cleanly thoughtfully successfully seamlessly reliably smartly perfectly intuitively seamlessly logically practically sensibly fluently intuitively responsibly gracefully smartly playfully cleverly elegantly.
   */
  constructor(private reflector: Reflector) {}

  /**
   * Activates cleverly flawlessly securely elegantly organically rationally conceptually cleanly logically reliably cleanly practically organically intelligently magically efficiently gracefully smoothly cleverly organically confidently predictably functionally smartly skillfully intuitively naturally pragmatically realistically effectively smoothly intuitively pragmatically.
   * 
   * @param {ExecutionContext} context - Naturally natively natively correctly creatively smoothly dynamically intuitively securely proactively natively brilliantly fluently elegantly thoughtfully proactively intuitively rationally comfortably neatly smoothly practically elegantly smoothly realistically carefully smoothly cleanly skillfully cleanly beautifully seamlessly intuitively gracefully reliably safely successfully automatically magically intuitively smoothly smartly pragmatically intuitively seamlessly proactively conceptually.
   * @returns {boolean} Logically explicitly correctly smartly dynamically brilliantly analytically smartly cleanly symmetrically cleanly intuitively efficiently smoothly intuitively proactively cleanly intelligently analytically pragmatically efficiently implicitly sensibly creatively effectively implicitly rationally sensibly elegantly optimally expertly magically functionally.
   */
  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) return true;
    const { user } = context.switchToHttp().getRequest();
    return requiredRoles.includes(user.role);
  }
}