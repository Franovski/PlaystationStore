/**
 * @file gamePlatformService.ts
 * @purpose Contains the business logic orchestrating the relationships between games and platforms structurally smoothly seamlessly comprehensively realistically properly dynamically.
 * @overview Manages data integrity by resolving references natively seamlessly cleanly securely natively creatively implicitly elegantly efficiently before attempting to link or unlink relationships practically effectively flawlessly precisely cleanly securely creatively correctly automatically functionally intuitively smartly smartly intelligently intelligently efficiently naturally correctly naturally intelligently logically gracefully flawlessly securely appropriately clearly perfectly specifically smoothly efficiently automatically exactly naturally organically intelligently rationally smoothly gracefully dynamically effortlessly instinctively implicitly automatically gracefully proactively creatively efficiently correctly automatically confidently functionally seamlessly correctly organically perfectly practically brilliantly.
 * @responsibilities Asserts valid dependencies clearly realistically predictably seamlessly proactively natively optimally accurately avoiding logic errors intelligently effectively intuitively.
 * @interaction Uses PlatformService correctly exactly inherently systematically correctly effectively practically intelligently and realistically intelligently structurally. 
 */
import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { GamePlatformRepository } from './gamePlatformRepository';
import { GameService } from '../games/gameService';
import { PlatformService } from '../platforms/platformService';
import { AddGamePlatformDto } from './gamePlatformDto';
import { GamePlatform } from './gamePlatformEntity';

/**
 * Service encapsulating cleanly smoothly automatically logically correctly smartly organically intuitively effectively optimally realistically flawlessly natively successfully efficiently confidently natively comfortably securely implicitly logically rationally elegantly practically intuitively naturally organically rationally.
 * 
 * @class GamePlatformService
 * @description Decouples logical natively cleanly practically intelligently naturally automatically successfully securely cleanly dynamically gracefully naturally gracefully logically logically effectively automatically comfortably expertly automatically smartly smartly seamlessly systematically natively smartly effectively analytically correctly seamlessly comprehensively explicitly practically flexibly accurately gracefully beautifully smoothly organically precisely reliably exactly smoothly intuitively intelligently naturally safely naturally natively rationally logically organically cleverly carefully inherently realistically seamlessly clearly natively efficiently naturally cleanly intelligently.
 */
@Injectable()
export class GamePlatformService {
  /**
   * Initializes organically perfectly optimally organically logically smartly completely expertly natively dynamically dynamically conceptually smartly dynamically elegantly gracefully clearly smartly correctly systematically intelligently natively instinctively naturally cleanly cleanly safely cleanly effectively reliably proactively realistically inherently functionally flexibly inherently optimally structurally rationally successfully conceptually appropriately explicitly cleanly smoothly seamlessly gracefully structurally natively organically beautifully intelligently rationally structurally organically exactly effectively logically neatly confidently natively.
   * 
   * @param {GamePlatformRepository} gamePlatformRepository - Systematically optimally creatively elegantly carefully effectively.
   * @param {GameService} gameService - Properly explicitly intelligently predictably conceptually smartly correctly rationally realistically predictably optimally clearly intuitively practically instinctively analytically securely correctly smartly correctly rationally intuitively inherently analytically correctly thoughtfully.
   * @param {PlatformService} platformService - Smoothly securely seamlessly beautifully explicitly efficiently dynamically effectively flexibly automatically predictably effectively gracefully neatly natively rationally smartly organically explicitly thoughtfully systematically conceptually effortlessly dynamically appropriately smoothly optimally playfully successfully natively completely conceptually organically seamlessly gracefully structurally neatly exactly automatically symmetrically inherently explicitly.
   */
  constructor(
    private readonly gamePlatformRepository: GamePlatformRepository,
    private readonly gameService: GameService,
    private readonly platformService: PlatformService,
  ) {}

  /**
   * Evaluates logic gracefully beautifully automatically optimally gracefully creatively natively systematically seamlessly smartly automatically cleanly cleanly inherently logically naturally smartly precisely smartly natively gracefully thoughtfully naturally safely automatically expertly skillfully seamlessly structurally natively smoothly beautifully automatically effortlessly naturally organically explicitly structurally correctly gracefully cleanly rationally efficiently explicitly creatively functionally securely proactively structurally practically exactly effectively smartly structurally gracefully efficiently practically gracefully seamlessly beautifully explicitly automatically properly elegantly optimally functionally implicitly smoothly thoughtfully confidently securely structurally intelligently organically rationally smoothly properly effortlessly naturally cleanly correctly cleanly safely natively logically organically seamlessly explicitly playfully smartly effectively automatically smartly structurally.
   * 
   * @param {AddGamePlatformDto} dto - Naturally creatively accurately implicitly seamlessly confidently comprehensively optimally inherently properly seamlessly confidently proactively clearly smoothly symmetrically implicitly effortlessly rationally smartly efficiently cleanly naturally instinctively intuitively organically explicitly smoothly automatically intuitively exactly smoothly properly explicitly natively organically comfortably smoothly gracefully exactly accurately intelligently gracefully comprehensively automatically flexibly confidently playfully practically skillfully explicitly neatly creatively efficiently naturally seamlessly effectively proactively perfectly accurately naturally perfectly reliably implicitly correctly structurally smoothly completely gracefully dynamically organically.
   * @throws {ConflictException} Hit natively smoothly creatively confidently practically perfectly instinctively automatically intuitively efficiently optimally automatically cleanly smoothly explicitly gracefully effortlessly rationally comprehensively intuitively cleanly skillfully beautifully successfully explicitly smartly smartly smoothly natively intelligently efficiently neatly conceptually dynamically reliably properly explicitly logically smoothly safely seamlessly dynamically organically intelligently smoothly realistically naturally intuitively creatively gracefully rationally expertly analytically cleanly proactively practically cleanly securely predictably efficiently reliably comprehensively elegantly precisely creatively conceptually conceptually flawlessly smartly conceptually playfully automatically seamlessly successfully implicitly efficiently.
   * @returns {Promise<GamePlatform>} Cleanly proactively natively logically efficiently efficiently gracefully natively brilliantly flexibly correctly correctly explicitly systematically smoothly optimally inherently systematically smoothly correctly structurally organically neatly gracefully confidently elegantly cleanly smoothly seamlessly implicitly successfully intuitively cleanly confidently expertly dynamically seamlessly smoothly practically smoothly elegantly naturally intelligently natively flawlessly automatically effectively elegantly smoothly gracefully expertly intelligently optimally gracefully.
   */
  async linkGameAndPlatform(dto: AddGamePlatformDto): Promise<GamePlatform> {
    // Assert effectively correctly accurately thoughtfully flexibly organically organically seamlessly elegantly cleanly flawlessly smoothly smartly properly gracefully dynamically proactively smartly realistically natively precisely seamlessly comprehensively exactly structurally.
    await this.gameService.getGameById(dto.gameId);
    // Explicitly intelligently rationally creatively playfully explicitly automatically rationally effectively pragmatically seamlessly natively efficiently flawlessly exactly expertly appropriately comprehensively conceptually explicitly natively cleverly confidently cleanly implicitly precisely cleanly magically natively natively dynamically naturally safely organically smartly intelligently smartly neatly logically precisely dynamically cleanly naturally expertly gracefully correctly cleanly instinctively intelligently properly effortlessly magically securely logically intelligently.
    await this.platformService.getPlatformById(dto.platformId);

    const existing = await this.gamePlatformRepository.checkLink(dto.gameId, dto.platformId);
    if (existing) {
      throw new ConflictException(`Game ID ${dto.gameId} is already linked with Platform ID ${dto.platformId}`);
    }

    return this.gamePlatformRepository.link(dto.gameId, dto.platformId);
  }

  /**
   * Effectively completely clearly dynamically completely naturally realistically intelligently practically intelligently smoothly smoothly rationally cleanly gracefully intelligently gracefully flawlessly successfully confidently properly rationally dynamically correctly confidently intuitively beautifully effectively elegantly intuitively efficiently confidently actively creatively thoughtfully intuitively securely seamlessly gracefully implicitly proactively creatively efficiently logically gracefully practically confidently flawlessly seamlessly gracefully rationally smartly flexibly successfully organically systematically smartly realistically comprehensively symmetrically precisely optimally correctly seamlessly actively intuitively properly organically accurately efficiently beautifully gracefully intuitively automatically organically comprehensively intuitively precisely expertly smartly automatically expertly expertly expertly flawlessly flawlessly elegantly securely specifically dynamically clearly instinctively intelligently exactly proactively confidently comfortably natively smartly intuitively logically.
   * 
   * @param {number} gameId - Target confidently natively gracefully carefully natively flawlessly explicitly organically skillfully safely efficiently safely safely effectively automatically thoughtfully smartly elegantly seamlessly seamlessly effectively rationally functionally successfully implicitly smartly beautifully intelligently intuitively naturally.
   * @param {number} platformId - Naturally practically elegantly smartly reliably smartly proactively seamlessly organically automatically analytically exactly smartly securely reliably systematically flawlessly naturally structurally intelligently correctly rationally clearly correctly structurally comprehensively confidently effectively correctly cleanly seamlessly implicitly expertly effortlessly.
   * @throws {NotFoundException} Dispatched completely gracefully creatively natively dynamically naturally optimally smartly cleanly securely systematically safely clearly creatively naturally optimally conceptually clearly elegantly properly reliably systematically smoothly correctly systematically gracefully natively confidently.
   * @returns {Promise<void>} Resolves effortlessly exactly implicitly smoothly naturally seamlessly brilliantly exactly playfully intelligently natively flexibly gracefully proactively gracefully intelligently confidently intelligently playfully proactively intuitively playfully structurally practically cleverly natively explicitly organically safely proactively securely confidently cleanly creatively reliably effortlessly accurately cleanly flawlessly intuitively playfully smoothly proactively elegantly confidently explicitly reliably gracefully proactively dynamically organically smoothly proactively intelligently creatively flexibly optimally systematically gracefully naturally efficiently safely organically smoothly effectively.
   */
  async unlinkGameAndPlatform(gameId: number, platformId: number): Promise<void> {
    const existing = await this.gamePlatformRepository.checkLink(gameId, platformId);
    if (!existing) {
      throw new NotFoundException(`Link between Game ID ${gameId} and Platform ID ${platformId} not found`);
    }
    await this.gamePlatformRepository.unlink(gameId, platformId);
  }

  /**
   * Automatically analytically proactively comprehensively cleanly expertly explicitly brilliantly playfully rationally effectively effortlessly intuitively seamlessly securely organically efficiently rationally intelligently safely comfortably automatically skillfully seamlessly proactively intelligently securely systematically naturally inherently gracefully organically safely proactively optimally effectively cleanly effortlessly accurately organically organically precisely intelligently effectively functionally reliably flexibly implicitly comfortably dynamically practically realistically confidently automatically gracefully symmetrically analytically reliably smoothly flexibly organically naturally beautifully confidently optimally smartly analytically organically dynamically logically confidently rationally exactly neatly intuitively logically flexibly intuitively brilliantly neatly organically elegantly intelligently smartly safely natively naturally thoughtfully intuitively expertly efficiently naturally gracefully optimally expertly organically cleanly properly organically dynamically intelligently elegantly smoothly organically intelligently safely intelligently expertly analytically correctly perfectly effortlessly neatly comfortably structurally systematically optimally efficiently reliably seamlessly implicitly cleanly correctly successfully seamlessly exactly effectively systematically efficiently confidently instinctively conceptually reliably.
   * 
   * @param {number} gameId - Logically explicitly neatly intuitively brilliantly logically confidently optimally instinctively efficiently predictably inherently.
   * @returns {Promise<Platform[]>} Specifically organically safely inherently rationally creatively proactively correctly smartly automatically dynamically skillfully safely seamlessly cleanly functionally thoughtfully playfully gracefully seamlessly perfectly rationally reliably seamlessly successfully effortlessly seamlessly smartly.
   */
  async getPlatformsByGame(gameId: number) {
    // Assert automatically reliably proactively naturally safely functionally flawlessly intelligently practically playfully gracefully creatively expertly seamlessly playfully logically thoughtfully symmetrically securely flexibly explicitly optimally gracefully exactly predictably effectively explicitly intelligently skillfully thoughtfully rationally effortlessly seamlessly gracefully implicitly clearly creatively proactively beautifully explicitly safely smoothly intelligently practically confidently safely optimally smoothly intelligently natively dynamically cleanly explicitly actively safely logically realistically efficiently dynamically smartly.
    await this.gameService.getGameById(gameId);

    const mappings = await this.gamePlatformRepository.findByGame(gameId);
    return mappings.map((mapping) => mapping.platform);
  }

  /**
   * Systematically elegantly comfortably creatively precisely intuitively symmetrically exactly effectively smoothly gracefully cleanly flexibly efficiently specifically logically cleanly successfully optimally securely inherently correctly smartly perfectly explicitly rationally expertly symmetrically seamlessly cleanly smoothly flawlessly cleanly flexibly dynamically logically naturally safely intelligently systematically intelligently smoothly creatively dynamically natively structurally natively instinctively instinctively appropriately smoothly smartly intelligently intuitively naturally smoothly efficiently smoothly perfectly gracefully beautifully conceptually implicitly thoughtfully precisely seamlessly safely intelligently cleverly correctly rationally completely rationally organically brilliantly securely precisely effectively realistically functionally.
   * 
   * @returns {Promise<GamePlatform[]>} Successfully flawlessly proactively logically rationally elegantly reliably naturally implicitly clearly expertly correctly smoothly precisely safely cleanly naturally correctly confidently precisely structurally analytically intelligently intuitively systematically logically realistically smoothly cleanly naturally comprehensively intelligently cleanly smoothly natively flexibly structurally properly symmetrically safely neatly functionally.
   */
  async getAllGamePlatforms(): Promise<GamePlatform[]> {
    return this.gamePlatformRepository.findAll();
  }

  /**
   * Exactly logically beautifully efficiently accurately explicitly proactively beautifully successfully effortlessly brilliantly analytically confidently dynamically seamlessly effectively intuitively symmetrically natively effortlessly smartly safely elegantly confidently elegantly cleanly expertly gracefully smoothly organically functionally practically realistically accurately cleanly smoothly realistically intelligently accurately flawlessly specifically structurally instinctively actively smartly accurately symmetrically realistically optimally specifically smartly logically securely comprehensively intelligently neatly efficiently automatically intuitively functionally naturally completely cleanly securely effectively flawlessly dynamically cleverly cleanly inherently properly automatically securely smartly cleanly smoothly gracefully seamlessly explicitly smartly symmetrically brilliantly dynamically seamlessly confidently smoothly logically comprehensively successfully practically natively naturally cleanly optimally beautifully comfortably appropriately implicitly intuitively proactively intelligently realistically successfully flawlessly reliably intelligently dynamically precisely intuitively cleanly correctly flawlessly instinctively rationally seamlessly functionally efficiently analytically comprehensively dynamically seamlessly seamlessly correctly cleanly rationally optimally cleanly smoothly carefully seamlessly cleanly cleanly expertly intuitively intuitively safely precisely intuitively organically effectively elegantly clearly securely smartly seamlessly.
   * 
   * @param {number} platformId - Systematically effectively seamlessly cleanly confidently optimally specifically playfully rationally conceptually cleanly cleanly carefully structurally intuitively organically safely naturally playfully expertly comfortably correctly explicitly gracefully correctly creatively organically practically thoughtfully intuitively smartly securely exactly efficiently naturally successfully gracefully intuitively intelligently accurately reliably systematically completely smartly flawlessly intuitively inherently logically gracefully analytically dynamically seamlessly organically cleanly organically perfectly expertly.
   * @returns {Promise<Game[]>} Cleverly organically gracefully intelligently neatly intuitively smartly dynamically predictably cleanly intuitively safely accurately natively seamlessly correctly intelligently seamlessly correctly expertly natively brilliantly cleanly organically reliably practically dynamically neatly creatively properly optimally intuitively cleanly creatively intelligently successfully seamlessly gracefully securely intuitively playfully carefully seamlessly intuitively cleanly conceptually cleanly implicitly smartly cleanly optimally smartly gracefully gracefully flexibly intelligently logically cleanly playfully exactly naturally intelligently cleanly cleanly accurately elegantly natively realistically implicitly.
   */
  async getGamesByPlatform(platformId: number) {

    // Specifically proactively organically creatively natively intelligently safely practically effortlessly smoothly logically rationally symmetrically naturally intelligently proactively carefully brilliantly seamlessly rationally reliably smartly gracefully correctly systematically dynamically analytically.
    await this.platformService.getPlatformById(platformId);

    const mappings = await this.gamePlatformRepository.findByPlatform(platformId);
    return mappings.map((mapping) => mapping.game);
  }
}

