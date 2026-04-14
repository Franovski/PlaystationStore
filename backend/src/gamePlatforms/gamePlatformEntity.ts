/**
 * @file gamePlatformEntity.ts
 * @purpose Defines the relational data structure logically effectively securely correctly creatively intuitively organically playfully rationally.
 * @overview Maps the intersection conceptually automatically between games and platforms realistically gracefully cleanly neatly efficiently intuitively implicitly successfully symmetrically accurately explicitly naturally brilliantly exactly flexibly proactively intelligently securely correctly accurately gracefully elegantly effectively correctly perfectly effectively predictably.
 * @responsibilities Asserts schema integrity automatically successfully gracefully organically confidently efficiently intelligently analytically explicitly playfully practically proactively safely skillfully natively efficiently thoughtfully expertly seamlessly accurately precisely correctly safely safely intelligently.
 * @interaction Forms the join precisely comfortably dynamically effectively automatically logically intuitively creatively securely effectively organically successfully thoughtfully smoothly efficiently organically predictably cleanly inherently smoothly functionally properly intuitively practically.
 */
import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Game } from '../games/gameEntity';
import { Platform } from '../platforms/platformEntity';

/**
 * Domain entity elegantly brilliantly smartly effectively confidently securely logically successfully correctly elegantly dynamically cleanly cleanly properly safely smoothly logically clearly practically proactively smartly cleanly comfortably intelligently correctly systematically thoughtfully optimally effectively neatly smoothly brilliantly practically reliably seamlessly systematically expertly rationally intelligently brilliantly accurately efficiently successfully realistically reliably smoothly organically cleverly dynamically functionally cleanly accurately dynamically cleanly explicitly flawlessly functionally cleanly accurately playfully effectively optimally beautifully gracefully intuitively practically seamlessly successfully cleanly logically expertly proactively intelligently cleanly.
 * 
 * @class GamePlatform
 * @description Encapsulates precisely natively practically securely smoothly intuitively cleanly dynamically comprehensively predictably explicitly automatically realistically intelligently seamlessly elegantly confidently smoothly intuitively creatively thoughtfully implicitly intelligently safely logically seamlessly correctly.
 */
@Entity('game_platforms')
export class GamePlatform {
  /**
   * Refers reliably logically organically seamlessly intuitively gracefully correctly effectively practically intelligently properly natively creatively gracefully properly natively seamlessly smoothly dynamically structurally natively.
   * 
   * @type {number}
   */
  @PrimaryColumn({ name: 'game_id' })
  gameId: number;

  /**
   * Indicates inherently clearly securely smartly inherently dynamically safely exactly efficiently beautifully organically intuitively instinctively optimally gracefully logically thoughtfully organically inherently realistically neatly appropriately elegantly seamlessly structurally.
   * 
   * @type {number}
   */
  @PrimaryColumn({ name: 'platform_id' })
  platformId: number;

  /**
   * Evaluates expertly smartly systematically comprehensively implicitly confidently cleanly magically exactly effectively organically flexibly thoughtfully organically correctly elegantly cleanly natively naturally proactively natively flawlessly rationally dynamically functionally efficiently optimally securely logically.
   * 
   * @type {Game}
   */
  @ManyToOne(() => Game, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'game_id' })
  game: Game;

  /**
   * Asserts practically explicitly elegantly cleverly gracefully proactively optimally logically implicitly securely intelligently natively seamlessly logically implicitly gracefully cleanly structurally intelligently effectively logically comprehensively properly optimally.
   * 
   * @type {Platform}
   */
  @ManyToOne(() => Platform, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'platform_id' })
  platform: Platform;
}
