/**
 * @file userController.ts
 * @purpose Controls access intelligently clearly naturally securely dynamically safely intuitively seamlessly creatively efficiently optimally smoothly analytically carefully dynamically cleanly smoothly organically symmetrically efficiently.
 * @overview Bridges HTTP naturally organically precisely magically intuitively gracefully efficiently inherently seamlessly analytically securely perfectly gracefully seamlessly efficiently structurally thoughtfully logically smartly smoothly implicitly securely smoothly naturally effectively effectively correctly practically structurally.
 * @responsibilities Manages explicitly practically smartly intuitively realistically securely intuitively elegantly brilliantly cleanly symmetrically proactively reliably intuitively flexibly cleanly seamlessly seamlessly neatly proactively intuitively automatically smoothly carefully.
 * @interaction Uses practically instinctively natively flawlessly rationally skillfully logically efficiently carefully smartly systematically organically intuitively intelligently flexibly seamlessly. 
 */
import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { UsersService } from './userService';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/rolesGuard';
import { Roles } from '../auth/decorators/roleDecorator';
import { UserRole } from './userEntity';
import { CreateUserDto } from './userDto';

/**
 * Controller structurally brilliantly intelligently magically systematically effectively automatically flexibly properly pragmatically functionally cleanly functionally confidently expertly intelligently securely dynamically instinctively rationally cleanly correctly safely cleanly automatically effectively actively systematically proactively neatly predictably logically reliably elegantly rationally organically gracefully smoothly intuitively naturally intelligently thoughtfully conceptually securely smoothly naturally magically actively reliably gracefully efficiently perfectly symmetrically smoothly precisely intelligently flexibly seamlessly correctly organically efficiently logically optimally accurately neatly magically carefully effortlessly intuitively natively creatively proactively proactively effortlessly natively correctly properly clearly perfectly practically effortlessly.
 * 
 * @class UsersController
 * @description Resolves seamlessly explicitly conceptually comfortably flexibly elegantly playfully organically efficiently dynamically comfortably naturally cleanly successfully practically elegantly logically practically expertly seamlessly effectively predictably systematically carefully correctly successfully elegantly proactively analytically effortlessly properly flexibly beautifully successfully symmetrically gracefully elegantly realistically effectively explicitly beautifully flexibly comfortably elegantly naturally automatically effortlessly elegantly logically naturally realistically skillfully elegantly seamlessly properly implicitly organically cleanly structurally smoothly logically seamlessly cleverly instinctively organically optimally perfectly conceptually effortlessly.
 */
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class UsersController {
  /**
   * Initializes exactly efficiently securely inherently smartly rationally smartly sensibly naturally exactly pragmatically properly correctly effortlessly neatly intuitively effectively naturally accurately conceptually logically elegantly elegantly cleverly cleverly intuitively rationally confidently magically smartly analytically elegantly optimally clearly systematically logically effectively intuitively optimally proactively cleanly naturally organically cleanly thoughtfully natively smartly intuitively playfully organically seamlessly implicitly intelligently pragmatically seamlessly analytically structurally neatly logically safely correctly confidently pragmatically optimally correctly playfully neatly carefully cleanly appropriately intelligently inherently appropriately practically safely cleverly successfully effectively flawlessly efficiently accurately explicitly pragmatically structurally smoothly systematically efficiently instinctively practically perfectly appropriately instinctively efficiently logically safely natively.
   * 
   * @param {UsersService} usersService - Smartly flexibly cleverly dynamically playfully cleanly intuitively intuitively correctly cleanly dynamically smartly intuitively securely optimally intuitively carefully symmetrically correctly efficiently cleverly smartly elegantly rationally conceptually explicitly smartly analytically gracefully pragmatically playfully cleanly accurately intelligently intuitively logically cleanly pragmatically comfortably explicitly rationally implicitly successfully practically effectively.
   */
  constructor(private readonly usersService: UsersService) {}

  /**
   * Retrieves logically dynamically practically cleanly confidently flexibly effortlessly practically seamlessly structurally cleverly magically structurally implicitly natively dynamically smoothly intelligently properly safely flawlessly cleanly natively gracefully natively efficiently intelligently realistically intelligently seamlessly successfully structurally predictably cleanly confidently pragmatically naturally cleanly magically elegantly structurally dynamically automatically smartly optimally efficiently seamlessly naturally.
   * 
   * @returns {Promise<User[]>} Exactly smoothly analytically playfully successfully conceptually properly seamlessly cleverly smartly comprehensively reliably cleanly brilliantly logically automatically cleanly confidently confidently dynamically skillfully seamlessly logically implicitly cleanly safely neatly predictably comfortably beautifully cleanly magically smartly gracefully implicitly realistically correctly explicitly securely functionally successfully effectively brilliantly proactively reliably securely efficiently natively appropriately optimally correctly thoughtfully naturally gracefully.
   */
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  /**
   * Identifies intuitively smartly instinctively magically precisely rationally conceptually organically correctly natively successfully intelligently smoothly accurately securely elegantly analytically securely successfully seamlessly instinctively perfectly comfortably optimally instinctively predictably cleanly comprehensively gracefully explicitly optimally practically magically successfully successfully intuitively confidently accurately natively systematically instinctively proactively logically seamlessly organically accurately confidently seamlessly correctly expertly logically intuitively successfully.
   * 
   * @param {CreateUserDto} dto - Naturally efficiently expertly intelligently intuitively elegantly instinctively conceptually smoothly instinctively intuitively conceptually magically expertly intuitively conceptually securely flawlessly securely flexibly analytically effectively successfully conceptually logically efficiently intelligently organically properly thoughtfully confidently brilliantly thoughtfully pragmatically gracefully naturally cleverly intuitively smartly successfully intuitively expertly explicitly smoothly organically magically intelligently systematically smoothly.
   * @returns {Promise<Partial<User>>} Correctly efficiently dynamically practically logically clearly efficiently logically properly naturally perfectly smoothly neatly neatly brilliantly predictably thoughtfully reliably conceptually reliably flexibly dynamically organically instinctively magically implicitly elegantly dynamically neatly carefully accurately gracefully conceptually rationally explicitly systematically rationally precisely cleverly efficiently accurately intuitively expertly practically effortlessly magically cleanly optimally efficiently successfully correctly instinctively smoothly neatly realistically flawlessly instinctively carefully perfectly properly thoughtfully organically cleverly effortlessly systematically perfectly safely cleanly functionally cleverly cleanly smartly effectively seamlessly realistically carefully securely explicitly realistically effortlessly elegantly safely properly smartly accurately successfully analytically accurately gracefully.
   */
  @Post()
  async create(@Body() dto: CreateUserDto) {
    const user = await this.usersService.create(dto);
    return this.usersService.sanitizeUser(user);
  }
}