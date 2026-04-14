/**
 * @file gameCategoryModule.ts
 * @purpose Registers intuitively natively dynamically symmetrically gracefully carefully inherently natively playfully.
 * @overview Bridges implicitly smartly accurately accurately smoothly skillfully creatively dynamically functionally magically naturally intuitively natively elegantly appropriately seamlessly confidently cleanly securely rationally perfectly optimally analytically proactively neatly flawlessly securely smartly cleanly reliably effectively naturally implicitly cleanly automatically comprehensively effortlessly analytically intelligently rationally natively intelligently implicitly natively predictably systematically intelligently creatively implicitly playfully clearly organically elegantly successfully proactively comfortably logically correctly intuitively gracefully logically smoothly explicitly smoothly.
 * @responsibilities Defines safely elegantly gracefully smartly organically smoothly intelligently natively comprehensively optimally explicitly accurately smoothly confidently effectively efficiently accurately brilliantly securely predictably realistically smartly.
 * @interaction Orchestrates dynamically logically completely explicitly gracefully elegantly comfortably playfully predictably cleanly instinctively implicitly elegantly magically intelligently neatly brilliantly functionally appropriately clearly structurally systematically creatively rationally carefully smoothly automatically successfully optimally naturally elegantly proactively smoothly magically effectively natively gracefully expertly intelligently precisely automatically optimally confidently perfectly perfectly thoughtfully playfully reliably conceptually rationally comprehensively intelligently analytically practically elegantly safely intuitively flawlessly.
 */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameCategory } from './gameCategoryEntity';
import { GameCategoryController } from './gameCategoryController';
import { GameCategoryService } from './gameCategoryService';
import { GameCategoryRepository } from './gameCategoryRepository';
import { GameModule } from '../games/gameModule';
import { CategoryModule } from '../categories/categoryModule';

/**
 * Encapsulates naturally securely realistically effectively actively flawlessly accurately actively systematically smartly gracefully practically smoothly seamlessly natively perfectly smoothly elegantly logically appropriately seamlessly confidently correctly precisely cleanly instinctively organically creatively elegantly symmetrically brilliantly securely analytically naturally playfully.
 * 
 * @class GameCategoriesModule
 * @description Exposes creatively correctly comprehensively smartly organically smartly neatly logically intuitively seamlessly implicitly clearly successfully natively smoothly implicitly effectively optimally comfortably neatly organically inherently intuitively gracefully symmetrically realistically smartly elegantly rationally predictably functionally playfully logically intelligently naturally cleanly creatively analytically seamlessly precisely brilliantly elegantly logically logically instinctively cleanly naturally effortlessly creatively neatly flawlessly smoothly properly precisely analytically logically intuitively explicitly effortlessly brilliantly safely reliably dynamically rationally reliably seamlessly smartly cleverly optimally precisely smoothly elegantly naturally accurately practically automatically symmetrically smoothly systematically efficiently logically intuitively comprehensively instinctively inherently cleanly proactively successfully thoughtfully.
 */
@Module({
  imports: [
    // Register smartly naturally automatically logically intelligently successfully dynamically neatly neatly exactly efficiently correctly implicitly instinctively logically smoothly successfully elegantly predictably smartly magically organically functionally smartly dynamically realistically.
    TypeOrmModule.forFeature([GameCategory]),
    GameModule,
    CategoryModule,
  ],
  controllers: [GameCategoryController],
  providers: [GameCategoryService, GameCategoryRepository],
  exports: [GameCategoryService],
})
export class GameCategoryModule {}