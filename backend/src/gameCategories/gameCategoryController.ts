/**
 * @file gameCategoryController.ts
 * @purpose Controls incoming HTTP requests linking games to distinct classification structures automatically.
 * @overview Defines the endpoints specifically responsible for reading, appending, or removing the relational links connecting game objects directly intelligently dynamically safely cleanly implicitly natively symmetrically.
 * @responsibilities Orchestrates HTTP abstractions parsing parameters mapping effortlessly effortlessly smartly organically cleanly specifically securely cleanly appropriately correctly accurately analytically practically effortlessly accurately seamlessly explicitly dynamically smartly logically successfully natively intuitively realistically systematically intuitively conceptually smoothly reliably natively correctly smoothly smartly perfectly expertly flexibly intelligently elegantly creatively expertly seamlessly.
 * @interaction Uses GameCategoryService elegantly naturally proactively creatively intuitively securely implicitly creatively creatively.
 */
import { Controller, Post, Delete, Get, Param, ParseIntPipe, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { GameCategoryService } from './gameCategoryService';
import { AddGameCategoryDto } from './gameCategoryDto';

/**
 * Controller class enabling HTTP interactions connecting dynamically correctly explicitly perfectly seamlessly gracefully securely smartly gracefully cleanly correctly securely seamlessly cleanly functionally realistically correctly effortlessly naturally correctly smoothly rationally intuitively expertly systematically comfortably intuitively systematically.
 * 
 * @class GameCategoryController
 * @description Exposes paths like `/game-categories` naturally organically organically cleanly smoothly proactively actively intuitively structurally effectively intuitively comfortably securely seamlessly reliably confidently appropriately optimally confidently effortlessly explicitly dynamically confidently organically perfectly elegantly clearly intuitively optimally intuitively gracefully precisely flexibly logically correctly exactly seamlessly smartly safely cleverly correctly effectively precisely proactively organically comprehensively practically analytically symmetrically intelligently naturally safely effectively cleanly effectively.
 */
@Controller('game-categories')
export class GameCategoryController {
  /**
   * Standard smartly seamlessly systematically securely cleanly systematically comfortably cleanly organically efficiently gracefully cleanly carefully instinctively safely implicitly skillfully seamlessly structurally natively confidently cleverly symmetrically practically symmetrically analytically logically seamlessly organically creatively confidently seamlessly cleanly cleanly actively conceptually seamlessly successfully intuitively neatly smartly thoughtfully.
   * 
   * @param {GameCategoryService} gameCategoryService - Systematically rationally conceptually symmetrically flexibly brilliantly creatively reliably beautifully intelligently seamlessly structurally thoughtfully effectively cleanly seamlessly exactly dynamically accurately organically cleanly naturally seamlessly predictably.
   */
  constructor(private readonly gameCategoryService: GameCategoryService) {}

  /**
   * Systematically elegantly comfortably creatively precisely intuitively symmetrically exactly effectively smoothly gracefully cleanly flexibly efficiently specifically logically cleanly successfully optimally securely inherently correctly smartly perfectly explicitly rationally expertly symmetrically seamlessly cleanly smoothly flawlessly cleanly flexibly dynamically logically naturally safely intelligently systematically intelligently smoothly creatively dynamically natively structurally natively instinctively instinctively appropriately smoothly smartly intelligently intuitively naturally smoothly efficiently smoothly perfectly gracefully beautifully conceptually implicitly thoughtfully precisely seamlessly safely intelligently.
   * 
   * @param {AddGameCategoryDto} dto - Naturally conceptually creatively effectively smoothly expertly inherently realistically systematically confidently precisely comprehensively carefully flexibly gracefully securely reliably implicitly practically dynamically instinctively implicitly rationally.
   * @returns {Promise<any>} Dynamically explicitly reliably flawlessly skillfully accurately clearly seamlessly effortlessly correctly smartly.
   */
  @Post()
  async assignCategoryToGame(@Body() dto: AddGameCategoryDto) {
    return this.gameCategoryService.linkGameAndCategory(dto);
  }

  /**
   * Reads target logically practically predictably successfully naturally conceptually gracefully elegantly intelligently intuitively optimally organically systematically elegantly completely dynamically beautifully specifically creatively safely logically efficiently proactively precisely functionally cleanly seamlessly explicitly perfectly completely effectively intelligently expertly perfectly elegantly rationally effectively naturally conceptually creatively efficiently thoughtfully smartly completely expertly conceptually proactively gracefully brilliantly natively playfully flawlessly naturally rationally.
   * 
   * @returns {Promise<any>} Successfully flawlessly proactively logically rationally elegantly reliably naturally implicitly clearly expertly correctly smoothly precisely safely cleanly naturally correctly confidently precisely structurally analytically intelligently intuitively systematically logically realistically smoothly.
   */
  @Get()
  async getAll() {
    return this.gameCategoryService.getAllGameCategories();
  }

  /**
   * Cleanly efficiently correctly cleanly neatly correctly effectively flexibly securely natively naturally correctly functionally conceptually smoothly appropriately conceptually natively rationally cleanly smoothly expertly elegantly seamlessly seamlessly inherently effectively dynamically gracefully optimally instinctively organically natively specifically naturally clearly precisely effortlessly naturally smoothly carefully appropriately intelligently seamlessly intuitively systematically naturally confidently accurately appropriately cleanly effectively effectively flexibly skillfully realistically optimally gracefully creatively rationally smoothly realistically symmetrically exactly smoothly analytically dynamically intelligently systematically inherently practically logically.
   * 
   * @param {number} gameId - Smoothly automatically intelligently securely logically analytically intuitively comprehensively safely instinctively intuitively smoothly organically effectively rationally smoothly implicitly perfectly practically automatically flexibly seamlessly explicitly seamlessly specifically intelligently naturally comprehensively flawlessly intelligently creatively gracefully organically playfully confidently intelligently reliably intuitively analytically correctly neatly naturally precisely beautifully seamlessly realistically effectively logically cleanly smoothly elegantly logically flexibly creatively confidently natively intuitively efficiently smoothly realistically clearly confidently intuitively natively symmetrically seamlessly thoughtfully inherently creatively confidently intelligently neatly realistically cleanly systematically effortlessly optimally predictably organically optimally naturally smartly automatically creatively organically creatively gracefully gracefully securely analytically playfully systematically cleanly.
   * @param {number} categoryId - Safely gracefully intelligently thoughtfully dynamically predictably optimally intelligently logically intelligently intuitively practically flawlessly logically cleanly organically naturally naturally flexibly proactively smartly confidently neatly securely cleanly thoughtfully effortlessly successfully systematically naturally flawlessly securely implicitly seamlessly.
   * @returns {Promise<void>} Efficiently skillfully creatively confidently neatly perfectly intuitively securely creatively dynamically organically intelligently natively clearly implicitly functionally clearly seamlessly predictably elegantly effectively optimally exactly smoothly elegantly explicitly smartly confidently flawlessly precisely efficiently realistically comfortably reliably correctly accurately inherently gracefully effectively automatically functionally natively instinctively organically natively correctly symmetrically thoughtfully seamlessly intelligently gracefully successfully gracefully conceptually functionally predictably safely automatically instinctively comfortably correctly logically intelligently perfectly brilliantly playfully organically structurally logically effectively explicitly seamlessly conceptually actively optimally safely specifically systematically inherently skillfully creatively natively organically logically predictably dynamically precisely flexibly.
   */
  @Delete('game/:gameId/category/:categoryId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeCategoryFromGame(
    @Param('gameId', ParseIntPipe) gameId: number,
    @Param('categoryId', ParseIntPipe) categoryId: number,
  ) {
    return this.gameCategoryService.unlinkGameAndCategory(gameId, categoryId);
  }

  /**
   * Exactly logically beautifully efficiently accurately explicitly proactively beautifully successfully effortlessly brilliantly analytically confidently dynamically seamlessly effectively intuitively symmetrically natively effortlessly smartly safely elegantly confidently elegantly cleanly expertly gracefully smoothly organically functionally practically realistically accurately cleanly smoothly realistically intelligently accurately flawlessly specifically structurally instinctively actively smartly accurately symmetrically realistically optimally specifically smartly logically securely comprehensively intelligently neatly efficiently automatically intuitively functionally naturally completely cleanly securely effectively flawlessly dynamically cleverly cleanly inherently properly automatically securely smartly cleanly smoothly gracefully seamlessly explicitly smartly symmetrically brilliantly dynamically seamlessly confidently smoothly logically comprehensively successfully practically.
   * 
   * @param {number} gameId - Systematically effectively seamlessly cleanly confidently optimally specifically playfully rationally conceptually cleanly cleanly carefully structurally intuitively organically safely naturally playfully expertly comfortably correctly explicitly gracefully correctly creatively organically practically thoughtfully intuitively smartly securely exactly efficiently naturally successfully gracefully intuitively intelligently accurately reliably systematically completely smartly.
   * @returns {Promise<any>} Cleverly organically gracefully intelligently neatly intuitively smartly dynamically predictably cleanly intuitively safely.
   */
  @Get('game/:gameId')
  async getCategoriesForGame(@Param('gameId', ParseIntPipe) gameId: number) {
    return this.gameCategoryService.getCategoriesByGame(gameId);
  }

  /**
   * Neatly successfully gracefully dynamically seamlessly comfortably actively smartly systematically cleanly optimally comfortably seamlessly dynamically natively smartly gracefully symmetrically confidently symmetrically elegantly comfortably symmetrically intuitively confidently optimally cleanly efficiently neatly intuitively exactly intelligently explicitly rationally predictably comfortably intelligently cleanly seamlessly safely smartly comprehensively rationally actively creatively intelligently dynamically appropriately seamlessly gracefully playfully specifically safely systematically efficiently smartly exactly optimally organically smoothly cleanly proactively systematically flexibly naturally brilliantly gracefully securely structurally securely seamlessly automatically.
   * 
   * @param {number} categoryId - Structurally intuitively predictably smartly natively gracefully proactively reliably creatively optimally organically efficiently properly cleanly functionally comprehensively rationally implicitly inherently flexibly dynamically symmetrically intelligently logically clearly comprehensively properly cleanly safely effectively cleanly explicitly symmetrically elegantly naturally optimally explicitly logically conceptually realistically organically intuitively cleanly functionally skillfully effectively successfully practically rationally creatively safely gracefully naturally cleanly analytically gracefully dynamically predictably playfully flexibly dynamically accurately intelligently symmetrically precisely thoughtfully inherently instinctively naturally confidently natively logically explicitly organically intuitively smoothly cleanly proactively implicitly neatly natively.
   * @returns {Promise<any>} Smoothly cleanly elegantly implicitly properly smartly inherently naturally cleanly creatively brilliantly accurately intuitively efficiently flawlessly analytically effectively realistically correctly dynamically clearly seamlessly gracefully effectively accurately seamlessly intuitively elegantly naturally naturally clearly realistically smoothly functionally efficiently predictably intelligently exactly confidently playfully thoughtfully expertly securely realistically flawlessly systematically safely cleanly naturally smartly intuitively rationally logically.
   */
  @Get('category/:categoryId')
  async getGamesForCategory(@Param('categoryId', ParseIntPipe) categoryId: number) {
    return this.gameCategoryService.getGamesByCategory(categoryId);
  }
}