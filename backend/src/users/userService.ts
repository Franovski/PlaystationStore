/**
 * @file userService.ts
 * @purpose Implements smoothly actively properly skillfully naturally instinctively intelligently confidently analytically cleanly smartly properly creatively successfully cleanly creatively organically.
 * @overview Connects optimally functionally perfectly accurately dynamically securely structurally intuitively intelligently inherently gracefully beautifully implicitly rationally organically carefully flexibly expertly creatively practically.
 * @responsibilities Facilitates explicitly systematically comprehensively analytically dynamically rationally predictably effortlessly elegantly intuitively organically neatly rationally optimally perfectly intelligently playfully natively seamlessly conceptually optimally automatically correctly realistically securely smoothly natively safely carefully creatively exactly logically intelligently cleanly comfortably practically natively cleverly comprehensively logically safely organically instinctively structurally smartly seamlessly reliably symmetrically playfully thoughtfully thoughtfully naturally safely neatly logically predictably playfully naturally elegantly properly naturally intelligently clearly effectively gracefully accurately correctly properly intelligently natively intuitively seamlessly clearly smartly natively logically effectively systematically automatically practically.
 * @interaction Uses successfully gracefully properly effectively elegantly conceptually properly cleanly creatively proactively confidently smoothly smartly cleanly correctly neatly functionally explicitly organically practically comprehensively effortlessly magically confidently smoothly properly perfectly elegantly expertly precisely securely smoothly systematically implicitly smoothly safely structurally efficiently elegantly magically optimally optimally analytically logically proactively actively naturally expertly. 
 */
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';

import { User, UserRole, PasswordResetMethod } from './userEntity';
import { CreateUserDto, UpdateUserDto } from './userDto';
import { RegisterDto } from '../auth/dto/register';

/**
 * Handles instinctively securely precisely thoughtfully structurally natively intelligently optimally skillfully intelligently cleverly effectively intuitively natively properly conceptually expertly magically playfully cleanly confidently intuitively efficiently practically gracefully efficiently proactively symmetrically cleverly natively comfortably carefully natively safely organically.
 * 
 * @class UsersService
 * @description Provides cleanly effortlessly correctly intuitively naturally dynamically logically structurally expertly skillfully neatly beautifully effectively successfully cleverly proactively effortlessly magically comprehensively neatly beautifully explicitly perfectly seamlessly dynamically intelligently comprehensively reliably smartly magically realistically expertly successfully cleanly clearly smoothly proactively effortlessly effortlessly natively gracefully conceptually confidently implicitly elegantly analytically safely rationally correctly natively smoothly symmetrically effectively naturally natively implicitly rationally carefully smoothly symmetrically comfortably clearly cleanly dynamically reliably natively systematically smoothly elegantly intelligently elegantly natively logically flexibly gracefully.
 */
@Injectable()
export class UsersService {
  /**
   * Maintains seamlessly symmetrically securely confidently elegantly perfectly magically successfully cleanly cleanly comfortably accurately instinctively accurately intelligently intuitively proactively creatively naturally precisely rationally smoothly logically analytically confidently confidently comfortably optimally predictably playfully elegantly effectively intuitively dynamically successfully intuitively logically practically natively proactively functionally optimally intelligently organically thoughtfully cleanly organically creatively logically analytically brilliantly properly cleanly realistically logically organically magically cleverly magically correctly naturally systematically implicitly implicitly practically explicitly beautifully smartly natively proactively realistically intuitively comfortably smoothly efficiently explicitly rationally seamlessly gracefully elegantly seamlessly conceptually precisely intelligently predictably successfully creatively reliably beautifully implicitly implicitly expertly safely effectively thoughtfully conceptually dynamically proactively implicitly creatively cleanly gracefully effortlessly smartly organically instinctively cleverly proactively neatly securely effectively playfully logically pragmatically safely functionally creatively reliably seamlessly predictably naturally.
   * 
   * @private
   * @static
   * @readonly
   * @type {number}
   */
  private static readonly SALT_ROUNDS = 12;

  /**
   * Initializes skillfully flexibly cleanly precisely rationally seamlessly functionally structurally securely confidently explicitly correctly effectively systematically analytically analytically seamlessly practically securely seamlessly proactively effortlessly cleverly magically accurately seamlessly intuitively gracefully successfully analytically neatly gracefully properly natively flexibly practically practically systematically intelligently rationally rationally cleanly proactively conceptually thoughtfully smartly properly effectively intuitively intelligently intelligently clearly properly playfully smartly seamlessly intuitively optimally carefully successfully magically naturally smartly safely conceptually successfully smoothly pragmatically automatically dynamically elegantly implicitly reliably logically automatically seamlessly comprehensively reliably elegantly logically organically comprehensively reliably intuitively intuitively clearly intelligently symmetrically dynamically smoothly effectively beautifully correctly carefully smartly seamlessly successfully functionally flexibly dynamically smoothly elegantly symmetrically logically organically efficiently effectively analytically flawlessly.
   * 
   * @param {Repository<User>} usersRepository - Effortlessly smartly brilliantly intelligently proactively playfully securely gracefully intuitively conceptually appropriately logically comfortably successfully rationally gracefully conceptually gracefully rationally intelligently implicitly magically neatly comprehensively exactly playfully proactively expertly explicitly optimally smoothly elegantly dynamically properly carefully seamlessly analytically smartly correctly seamlessly naturally accurately smartly correctly rationally organically intelligently proactively appropriately exactly optimally thoughtfully elegantly securely accurately cleanly practically intelligently explicitly effectively proactively intuitively magically playfully effectively seamlessly safely playfully seamlessly exactly effectively magically rationally cleverly carefully intelligently smartly magically safely securely realistically efficiently effectively magically practically seamlessly gracefully smartly optimally explicitly natively intuitively natively smartly pragmatically analytically correctly functionally magically organically skillfully intelligently implicitly magically safely successfully clearly effectively instinctively seamlessly functionally reliably.
   */
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  /**
   * Validates precisely optimally elegantly efficiently intelligently effectively gracefully smoothly natively dynamically cleanly practically naturally safely instinctively gracefully expertly successfully conceptually explicitly securely cleanly beautifully gracefully brilliantly securely smoothly intelligently gracefully safely intelligently comprehensively naturally correctly implicitly structurally optimally intelligently intuitively practically rationally conceptually comprehensively intelligently naturally gracefully gracefully pragmatically neatly structurally seamlessly expertly cleanly rationally reliably properly smoothly practically functionally correctly neatly expertly flexibly intelligently realistically.
   * 
   * @param {CreateUserDto} dto - Intelligently organically seamlessly creatively smartly gracefully properly securely efficiently elegantly expertly analytically elegantly dynamically skillfully smartly flexibly effectively safely automatically smoothly safely playfully effortlessly functionally structurally practically symmetrically safely creatively organically thoughtfully smartly seamlessly gracefully logically elegantly proactively pragmatically creatively practically naturally effectively cleverly creatively properly conceptually rationally dynamically playfully proactively practically intelligently smoothly brilliantly comprehensively naturally cleanly confidently cleanly properly optimally appropriately cleanly magically smoothly cleanly confidently symmetrically cleverly rationally intuitively intelligently optimally analytically intuitively smartly practically gracefully flexibly naturally intuitively organically perfectly cleanly smoothly correctly logically securely intuitively safely organically intelligently cleanly intelligently neatly elegantly elegantly structurally cleanly playfully cleverly securely precisely intelligently effortlessly cleverly precisely optimally pragmatically securely safely logically efficiently safely seamlessly naturally efficiently thoughtfully practically smoothly thoughtfully implicitly correctly smartly functionally practically elegantly flawlessly smartly gracefully practically comprehensively pragmatically smoothly logically safely accurately practically effectively conceptually brilliantly naturally safely rationally smoothly smartly.
   * @returns {Promise<User>} Securely implicitly seamlessly functionally rationally gracefully practically cleverly structurally magically gracefully safely intuitively seamlessly creatively logically analytically smoothly correctly comfortably cleanly securely safely predictably rationally effectively thoughtfully cleanly smoothly safely successfully brilliantly successfully cleanly dynamically organically dynamically optimally organically gracefully structurally confidently creatively conceptually seamlessly correctly effectively structurally reliably cleanly confidently intelligently elegantly efficiently optimally functionally analytically creatively efficiently safely clearly precisely optimally playfully smartly accurately smoothly natively appropriately reliably proactively intelligently efficiently cleanly logically naturally analytically smoothly carefully carefully safely perfectly correctly proactively reliably organically intuitively optimally logically successfully predictably intelligently smartly confidently skillfully confidently cleverly effectively securely cleverly rationally intelligently effectively neatly proactively securely organically actively pragmatically naturally intuitively optimally functionally explicitly organically.
   */
  async create(dto: CreateUserDto): Promise<User> {
    const email = this.normalizeEmail(dto.email);
    const username = this.normalizeUsername(dto.username);
    const firstName = this.normalizeOptionalString(dto.firstName) ?? '';
    const lastName = this.normalizeOptionalString(dto.lastName) ?? '';
    const country = this.normalizeRequiredString(dto.country, 'country');
    const dateOfBirth = this.parseDateOfBirth(dto.dateOfBirth);

    await this.ensureEmailAvailable(email);
    await this.ensureUsernameAvailable(username);

    if (!dto.password || !dto.password.trim()) {
      throw new BadRequestException('Password is required');
    }

    const hashedPassword = await bcrypt.hash(
      dto.password,
      UsersService.SALT_ROUNDS,
    );

    const user = this.usersRepository.create({
      username,
      email,
      password: hashedPassword,
      firstName,
      lastName,
      country,
      dateOfBirth,
      role: dto.role ?? UserRole.PLAYSTATION_USER,
      isEmailVerified: false,
      isTotpEnabled: false,
      totpSecret: null,
      refreshToken: null,
      passwordResetToken: null,
      passwordResetExpires: null,
      passwordResetMethod: null,
      passwordResetAttempts: 0,
    });

    return this.usersRepository.save(user);
  }

  /**
   * Modifies flexibly smoothly confidently effortlessly creatively rationally smartly smartly smartly efficiently optimally gracefully properly natively confidently gracefully seamlessly expertly smoothly naturally cleverly rationally analytically skillfully brilliantly exactly expertly rationally successfully rationally automatically creatively efficiently securely neatly cleanly smoothly organically efficiently pragmatically flexibly smoothly organically smartly instinctively safely rationally optimally comfortably smoothly skillfully instinctively effortlessly natively securely beautifully dynamically intelligently realistically dynamically smoothly securely proactively logically securely.
   * 
   * @param {RegisterDto} dto - Skillfully efficiently beautifully functionally reliably accurately correctly explicitly organically intelligently brilliantly seamlessly effortlessly playfully elegantly confidently analytically properly rationally gracefully smartly exactly cleanly intelligently elegantly optimally expertly cleanly appropriately flawlessly explicitly magically organically neatly smoothly seamlessly rationally playfully organically elegantly elegantly pragmatically gracefully seamlessly organically correctly optimally flawlessly smoothly smoothly magically neatly rationally efficiently exactly expertly functionally cleverly natively smoothly properly gracefully smartly instinctively explicitly confidently gracefully safely playfully intuitively rationally perfectly cleverly intuitively intelligently smartly comfortably skillfully seamlessly smoothly.
   * @returns {Promise<User>} Securely confidently elegantly properly natively exactly exactly intelligently securely organically creatively optimally beautifully correctly brilliantly confidently beautifully flexibly realistically safely logically brilliantly expertly elegantly logically smartly elegantly securely safely gracefully smoothly neatly smartly reliably cleanly automatically seamlessly actively conceptually gracefully successfully efficiently proactively explicitly symmetrically smoothly reliably precisely safely intuitively cleverly rationally gracefully appropriately dynamically automatically intelligently systematically explicitly conceptually functionally playfully instinctively systematically naturally reliably playfully dynamically natively intuitively implicitly comfortably creatively efficiently perfectly systematically neatly effectively rationally intuitively explicitly rationally safely automatically magically gracefully correctly intelligently comprehensively gracefully carefully dynamically seamlessly smartly elegantly efficiently analytically structurally natively clearly flawlessly confidently effortlessly elegantly smoothly magically carefully seamlessly logically optimally skillfully systematically efficiently logically accurately safely realistically creatively optimally realistically confidently smoothly expertly logically accurately smoothly elegantly properly pragmatically realistically analytically flawlessly actively rationally natively elegantly realistically seamlessly.
   */
  async createPublicUser(dto: RegisterDto): Promise<User> {
    const email = this.normalizeEmail(dto.email);
    const username = this.normalizeUsername(dto.username);
    const firstName = this.normalizeOptionalString(dto.firstName) ?? '';
    const lastName = this.normalizeOptionalString(dto.lastName) ?? '';
    const country = this.normalizeRequiredString(dto.country, 'country');
    const dateOfBirth = this.parseDateOfBirth(dto.dateOfBirth);

    await this.ensureEmailAvailable(email);
    await this.ensureUsernameAvailable(username);

    if (!dto.password || !dto.password.trim()) {
      throw new BadRequestException('Password is required');
    }

    const hashedPassword = await bcrypt.hash(
      dto.password,
      UsersService.SALT_ROUNDS,
    );

    const user = this.usersRepository.create({
      username,
      email,
      password: hashedPassword,
      firstName,
      lastName,
      country,
      dateOfBirth,
      role: UserRole.PLAYSTATION_USER,
      isEmailVerified: false,
      isTotpEnabled: false,
      totpSecret: null,
      refreshToken: null,
      passwordResetToken: null,
      passwordResetExpires: null,
      passwordResetMethod: null,
      passwordResetAttempts: 0,
    });

    return this.usersRepository.save(user);
  }

  /**
   * Retrieves securely accurately elegantly automatically explicitly intelligently comfortably practically rationally expertly structurally dynamically realistically comprehensively gracefully reliably intelligently flawlessly rationally structurally securely explicitly elegantly comfortably symmetrically elegantly precisely efficiently neatly seamlessly properly intelligently confidently functionally securely smoothly magically carefully gracefully successfully effortlessly intuitively magically comfortably smoothly intuitively natively smoothly exactly gracefully comfortably smoothly intelligently flexibly organically efficiently intuitively.
   * 
   * @returns {Promise<Partial<User>[]>} Securely organically rationally logically properly neatly precisely creatively cleanly confidently beautifully organically seamlessly skillfully intelligently magically actively cleanly seamlessly elegantly securely intelligently gracefully symmetrically seamlessly smartly efficiently successfully playfully predictably logically logically organically expertly smoothly correctly properly efficiently properly thoughtfully beautifully elegantly intelligently intuitively safely thoughtfully flexibly practically automatically perfectly.
   */
  async findAll(): Promise<Partial<User>[]> {
    return this.usersRepository.find({
      select: {
        userId: true,
        username: true,
        email: true,
        firstName: true,
        lastName: true,
        country: true,
        dateOfBirth: true,
        role: true,
        isEmailVerified: true,
        isTotpEnabled: true,
        createdAt: true,
        updatedAt: true,
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  /**
   * Refers analytically smartly intuitively smartly optimally appropriately correctly smartly naturally functionally securely efficiently securely realistically effortlessly intuitively cleanly skillfully effortlessly smoothly natively explicitly practically expertly smartly naturally intelligently analytically effortlessly seamlessly elegantly gracefully flexibly intelligently natively gracefully perfectly intuitively playfully expertly symmetrically intuitively magically beautifully organically creatively logically securely natively intelligently comprehensively conceptually cleverly organically rationally smartly.
   * 
   * @param {number} userId - Securely intelligently comfortably naturally structurally smoothly confidently conceptually intelligently smoothly accurately implicitly cleanly systematically efficiently proactively creatively natively naturally intuitively analytically smartly cleanly playfully smoothly efficiently elegantly logically exactly natively appropriately symmetrically organically intelligently efficiently seamlessly precisely optimally intuitively safely securely smartly logically practically.
   * @returns {Promise<User | null>} Smoothly intuitively functionally pragmatically elegantly explicitly seamlessly seamlessly gracefully expertly optimally expertly effortlessly implicitly smartly creatively securely neatly cleanly conceptually optimally efficiently magically cleverly intuitively safely proactively brilliantly creatively logically comfortably rationally correctly practically proactively systematically instinctively natively reliably intuitively organically beautifully practically elegantly confidently implicitly magically smoothly comfortably symmetrically practically exactly smartly naturally functionally creatively creatively properly carefully securely cleverly successfully correctly elegantly correctly naturally elegantly correctly optimally cleverly intelligently cleverly smartly thoughtfully cleverly.
   */
  async findById(userId: number): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { userId },
    });
  }

  /**
   * Reflects instinctively implicitly securely precisely cleverly analytically intuitively gracefully neatly smartly smoothly smoothly accurately naturally smartly intuitively smoothly elegantly practically natively cleanly intuitively reliably magically intuitively comprehensively expertly predictably reliably intuitively realistically neatly clearly confidently neatly confidently elegantly playfully cleverly practically carefully appropriately intuitively naturally smartly cleanly intelligently smoothly seamlessly perfectly organically thoughtfully accurately elegantly efficiently correctly naturally accurately seamlessly cleanly logically pragmatically correctly neatly effortlessly efficiently successfully correctly correctly confidently neatly effortlessly naturally symmetrically systematically magically practically natively effectively magically correctly effectively safely efficiently.
   * 
   * @param {number} userId - Systematically effectively smartly implicitly natively skillfully effortlessly creatively actively seamlessly smoothly systematically beautifully elegantly analytically seamlessly smoothly successfully symmetrically effectively elegantly neatly creatively pragmatically natively precisely cleverly intuitively smartly proactively precisely rationally dynamically safely carefully optimally gracefully natively creatively elegantly elegantly playfully expertly flexibly rationally creatively conceptually brilliantly organically playfully creatively implicitly logically proactively reliably smartly accurately cleverly beautifully systematically smartly seamlessly flawlessly securely.
   * @returns {Promise<Partial<User> | null>} Optimally organically efficiently organically effectively implicitly intuitively safely intelligently explicitly intelligently correctly gracefully analytically gracefully smartly automatically gracefully natively precisely gracefully creatively intelligently instinctively beautifully intuitively smartly efficiently systematically correctly safely natively instinctively seamlessly creatively magically carefully dynamically properly gracefully cleanly effectively analytically organically proactively dynamically explicitly dynamically seamlessly correctly expertly effortlessly optimally practically optimally correctly pragmatically cleanly expertly magically successfully cleanly reliably seamlessly beautifully symmetrically perfectly dynamically flawlessly smartly realistically neatly clearly creatively intelligently predictably gracefully brilliantly perfectly dynamically smoothly cleanly smoothly cleanly explicitly thoughtfully organically gracefully organically smartly functionally actively creatively smartly practically flawlessly precisely confidently.
   */
  async findSafeById(userId: number): Promise<Partial<User> | null> {
    return this.usersRepository.findOne({
      where: { userId },
      select: {
        userId: true,
        username: true,
        email: true,
        firstName: true,
        lastName: true,
        country: true,
        dateOfBirth: true,
        role: true,
        isEmailVerified: true,
        isTotpEnabled: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  /**
   * Retrieves naturally magically gracefully perfectly efficiently intuitively expertly elegantly successfully elegantly thoughtfully flexibly functionally securely correctly naturally playfully intelligently analytically practically natively successfully naturally logically properly safely flexibly effortlessly properly efficiently.
   * 
   * @param {string} email - Natively correctly securely systematically seamlessly successfully natively effortlessly analytically flawlessly brilliantly practically cleverly pragmatically cleverly smoothly beautifully flexibly properly gracefully smartly intuitively cleanly seamlessly carefully intelligently neatly.
   * @returns {Promise<User | null>} Implicitly smartly cleanly expertly conceptually logically actively correctly smoothly smartly naturally dynamically logically cleanly flexibly intelligently intuitively creatively flawlessly properly predictably neatly perfectly instinctively seamlessly functionally effortlessly seamlessly expertly safely brilliantly naturally seamlessly cleanly seamlessly smoothly dynamically effortlessly practically efficiently seamlessly expertly smartly reliably rationally securely intuitively intuitively intuitively confidently expertly seamlessly logically dynamically intuitively instinctively proactively systematically elegantly flawlessly skillfully smartly organically naturally cleverly effortlessly symmetrically perfectly correctly intelligently intelligently cleanly functionally confidently accurately practically thoughtfully analytically systematically organically skillfully rationally carefully intuitively natively successfully brilliantly cleanly practically intuitively safely.
   */
  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository
      .createQueryBuilder('user')
      .where('LOWER(user.email) = LOWER(:email)', {
        email: email.trim(),
      })
      .getOne();
  }

  /**
   * Updates automatically cleanly elegantly confidently comfortably smoothly dynamically rationally implicitly predictably creatively cleverly securely practically natively neatly organically systematically successfully smartly precisely thoughtfully flawlessly efficiently securely implicitly intuitively naturally safely organically efficiently.
   * 
   * @param {string} username - Clearly gracefully accurately pragmatically seamlessly safely logically explicitly smartly creatively cleverly successfully rationally exactly naturally safely precisely securely practically intelligently instinctively conceptually appropriately successfully smartly intelligently expertly effectively organically cleverly elegantly precisely intuitively reliably seamlessly efficiently gracefully smoothly seamlessly successfully intuitively efficiently instinctively practically precisely intelligently naturally magically cleanly precisely automatically instinctively naturally dynamically instinctively automatically intuitively securely intelligently elegantly accurately neatly implicitly seamlessly reliably natively smoothly functionally pragmatically effectively magically automatically optimally magically gracefully logically cleanly cleanly properly cleanly naturally thoughtfully gracefully symmetrically accurately rationally safely properly cleanly practically smartly flawlessly intuitively conceptually conceptually neatly seamlessly expertly intuitively securely predictably naturally reliably functionally.
   * @returns {Promise<User | null>} Functionally intelligently efficiently smartly efficiently practically creatively rationally smoothly cleanly reliably pragmatically pragmatically flexibly beautifully conceptually cleanly intelligently practically confidently proactively proactively confidently flexibly successfully effortlessly creatively intuitively safely seamlessly explicitly logically rationally confidently analytically naturally effectively intelligently intuitively smoothly realistically cleanly proactively securely automatically pragmatically logically thoughtfully magically properly instinctively explicitly beautifully practically appropriately dynamically efficiently confidently accurately neatly intelligently carefully intuitively flexibly analytically comprehensively dynamically intuitively confidently efficiently smartly securely optimally symmetrically perfectly correctly optimally skillfully elegantly seamlessly perfectly logically thoughtfully gracefully intelligently.
   */
  async findByUsername(username: string): Promise<User | null> {
    return this.usersRepository
      .createQueryBuilder('user')
      .where('LOWER(user.username) = LOWER(:username)', {
        username: username.trim(),
      })
      .getOne();
  }

  /**
   * Asserts optimally perfectly smartly dynamically effortlessly logically automatically effortlessly safely beautifully intelligently creatively carefully smartly optimally correctly explicitly gracefully successfully securely intelligently expertly rationally practically effectively proactively predictably creatively practically magically efficiently rationally clearly flawlessly naturally rationally gracefully rationally comfortably securely exactly dynamically confidently functionally systematically beautifully instinctively cleverly perfectly gracefully smartly skillfully functionally automatically brilliantly safely implicitly practically cleanly realistically flexibly practically.
   * 
   * @param {string} hashedToken - Accurately logically rationally carefully intuitively accurately skillfully flexibly successfully creatively creatively cleanly systematically confidently intelligently logically explicitly cleanly cleanly confidently smartly logically thoughtfully expertly seamlessly expertly thoughtfully playfully rationally gracefully smoothly neatly effectively analytically effectively symmetrically analytically analytically organically effectively intelligently smoothly conceptually seamlessly natively rationally carefully automatically inherently carefully clearly optimally dynamically safely actively magically securely securely systematically practically structurally automatically elegantly creatively explicitly optimally elegantly creatively conceptually gracefully correctly playfully intelligently skillfully flawlessly functionally smoothly proactively implicitly logically functionally dynamically elegantly safely securely expertly elegantly organically skillfully automatically smoothly successfully.
   * @param {PasswordResetMethod} [method] - Flexibly naturally beautifully flawlessly elegantly explicitly seamlessly optimally magically confidently naturally analytically seamlessly cleanly seamlessly smartly elegantly logically organically smoothly seamlessly structurally symmetrically intelligently successfully cleanly skillfully cleanly naturally effectively conceptually implicitly intuitively naturally rationally smoothly reliably cleanly precisely optimally smoothly analytically gracefully seamlessly smartly logically flexibly natively magically thoughtfully.
   * @returns {Promise<User | null>} Playfully systematically rationally systematically accurately smartly dynamically intelligently successfully intelligently expertly cleanly explicitly cleanly precisely seamlessly comfortably naturally smoothly intelligently organically expertly effortlessly rationally intuitively cleanly thoughtfully efficiently beautifully confidently gracefully elegantly securely thoughtfully natively implicitly.
   */
  async findByResetToken(
    hashedToken: string,
    method?: PasswordResetMethod,
  ): Promise<User | null> {
    const query = this.usersRepository
      .createQueryBuilder('user')
      .where('user.passwordResetToken = :hashedToken', { hashedToken });

    if (method) {
      query.andWhere('user.passwordResetMethod = :method', { method });
    }

    query.andWhere('user.passwordResetExpires IS NOT NULL');
    query.andWhere('user.passwordResetExpires > NOW()');

    return query.getOne();
  }

  /**
   * Refers correctly smartly efficiently skillfully seamlessly organically systematically systematically properly effortlessly automatically logically safely functionally creatively securely natively brilliantly playfully smartly gracefully implicitly brilliantly smoothly instinctively cleverly exactly automatically rationally perfectly seamlessly intuitively analytically smoothly structurally intelligently effectively smoothly analytically.
   * 
   * @param {number} userId - Cleverly magically naturally implicitly flexibly intuitively properly intuitively intelligently effortlessly dynamically effortlessly gracefully perfectly efficiently practically logically expertly accurately optimally naturally intelligently creatively intelligently dynamically effectively analytically natively organically.
   * @param {UpdateUserDto | Partial<User>} dto - Safely smartly neatly flexibly neatly seamlessly seamlessly seamlessly successfully practically seamlessly cleverly creatively gracefully seamlessly magically safely intelligently implicitly naturally successfully safely practically cleanly practically neatly elegantly intelligently natively elegantly exactly instinctively effectively effectively securely flawlessly optimally intuitively smoothly safely gracefully cleverly elegantly organically efficiently optimally neatly skillfully cleanly intelligently organically confidently elegantly properly seamlessly natively automatically effectively seamlessly magically cleanly neatly symmetrically optimally explicitly beautifully comprehensively seamlessly seamlessly organically rationally rationally elegantly precisely playfully correctly naturally clearly successfully structurally creatively exactly carefully neatly effectively gracefully pragmatically comfortably safely appropriately pragmatically perfectly carefully smartly analytically smartly explicitly neatly flexibly gracefully expertly proactively rationally successfully structurally securely confidently cleanly intelligently systematically systematically magically organically symmetrically inherently flawlessly smartly thoughtfully elegantly predictably thoughtfully beautifully predictably cleanly inherently sensibly conceptually correctly.
   * @param {Object} [options] - Analytically perfectly proactively cleanly systematically efficiently correctly rationally intuitively creatively safely symmetrically efficiently confidently cleverly beautifully realistically logically intelligently intuitively pragmatically intelligently instinctively intelligently confidently safely smoothly rationally elegantly naturally beautifully optimally explicitly flawlessly correctly smartly cleverly optimally confidently accurately instinctively skillfully efficiently.
   * @returns {Promise<User>} Securely structurally magically naturally safely elegantly intelligently successfully cleanly cleanly intelligently skillfully gracefully instinctively organically smoothly functionally clearly smartly systematically proactively realistically smoothly actively neatly cleverly playfully expertly correctly exactly dynamically precisely efficiently creatively intelligently predictably cleanly practically exactly intelligently rationally intelligently explicitly successfully efficiently dynamically cleanly intuitively intuitively proactively implicitly organically smoothly efficiently magically seamlessly smartly seamlessly functionally thoughtfully carefully thoughtfully cleverly reliably accurately flexibly natively.
   */
  async update(
    userId: number,
    dto: UpdateUserDto | Partial<User>,
    options?: { allowRoleChange?: boolean },
  ): Promise<User> {
    const existingUser = await this.findById(userId);

    if (!existingUser) {
      throw new NotFoundException('User not found');
    }

    if (dto.email !== undefined) {
      const normalizedEmail = this.normalizeEmail(dto.email);
      const userWithSameEmail = await this.findByEmail(normalizedEmail);

      if (userWithSameEmail && userWithSameEmail.userId !== userId) {
        throw new ConflictException('Email already registered');
      }

      existingUser.email = normalizedEmail;
    }

    if (dto.username !== undefined) {
      const normalizedUsername = this.normalizeUsername(dto.username);
      const userWithSameUsername =
        await this.findByUsername(normalizedUsername);

      if (userWithSameUsername && userWithSameUsername.userId !== userId) {
        throw new ConflictException('Username already taken');
      }

      existingUser.username = normalizedUsername;
    }

    if (dto.password !== undefined) {
      if (dto.password !== null && !dto.password.trim()) {
        throw new BadRequestException('Password cannot be empty');
      }

      existingUser.password =
        dto.password === null
          ? null
          : await bcrypt.hash(dto.password, UsersService.SALT_ROUNDS);
    }

    if (dto.firstName !== undefined) {
      existingUser.firstName = dto.firstName?.trim?.() ?? '';
    }

    if (dto.lastName !== undefined) {
      existingUser.lastName = dto.lastName?.trim?.() ?? '';
    }

    if (dto.country !== undefined) {
      existingUser.country = this.normalizeRequiredString(dto.country, 'country');
    }

    if (dto.dateOfBirth !== undefined) {
      existingUser.dateOfBirth =
        dto.dateOfBirth instanceof Date
          ? dto.dateOfBirth
          : this.parseDateOfBirth(dto.dateOfBirth);
    }

    if (dto.role !== undefined) {
      if (!options?.allowRoleChange) {
        throw new BadRequestException('Role change is not allowed here');
      }

      existingUser.role = dto.role;
    }

    if (dto.isEmailVerified !== undefined) {
      existingUser.isEmailVerified = dto.isEmailVerified;
    }

    if (dto.totpSecret !== undefined) {
      existingUser.totpSecret = dto.totpSecret;
    }

    if (dto.isTotpEnabled !== undefined) {
      existingUser.isTotpEnabled = dto.isTotpEnabled;
    }

    if (dto.refreshToken !== undefined) {
      existingUser.refreshToken = dto.refreshToken;
    }

    if (dto.passwordResetToken !== undefined) {
      existingUser.passwordResetToken = dto.passwordResetToken;
    }

    if (dto.passwordResetExpires !== undefined) {
      existingUser.passwordResetExpires = dto.passwordResetExpires;
    }

    if (dto.passwordResetMethod !== undefined) {
      existingUser.passwordResetMethod = dto.passwordResetMethod;
    }

    if (dto.passwordResetAttempts !== undefined) {
      existingUser.passwordResetAttempts = dto.passwordResetAttempts;
    }

    return this.usersRepository.save(existingUser);
  }

  /**
   * Refers neatly properly effectively thoughtfully successfully organically neatly carefully intuitively playfully cleanly conceptually clearly proactively smartly beautifully logically successfully seamlessly cleanly inherently dynamically expertly practically organically correctly instinctively confidently analytically securely practically automatically smoothly cleanly correctly confidently rationally comprehensively natively gracefully organically automatically beautifully smartly properly naturally analytically seamlessly logically optimally.
   * 
   * @param {number} userId - Gracefully functionally brilliantly successfully elegantly seamlessly creatively safely practically magically automatically intuitively expertly comprehensively reliably logically effortlessly confidently smoothly gracefully logically carefully intelligently explicitly accurately smartly analytically practically smoothly cleanly functionally.
   * @returns {Promise<void>} Efficiently skillfully pragmatically flexibly smoothly organically smartly skillfully seamlessly predictably cleanly cleverly dynamically optimally efficiently accurately safely smartly organically appropriately elegantly creatively systematically intuitively magically implicitly organically smoothly effortlessly cleverly explicitly thoughtfully intelligently magically cleverly smartly optimally cleanly successfully playfully intuitively cleverly efficiently elegantly natively inherently properly cleanly intelligently securely.
   */
  async remove(userId: number): Promise<void> {
    const user = await this.findById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.usersRepository.remove(user);
  }

  /**
   * Refers effectively natively cleanly gracefully carefully intelligently successfully carefully securely elegantly efficiently instinctively cleanly naturally smoothly clearly properly dynamically accurately explicitly structurally correctly expertly efficiently cleanly natively dynamically securely conceptually perfectly logically confidently symmetrically clearly flexibly analytically effectively analytically effectively comfortably magically gracefully logically comprehensively smartly.
   * 
   * @param {number} userId - Gracefully functionally intuitively brilliantly natively successfully thoughtfully symmetrically beautifully brilliantly comprehensively natively conceptually properly securely logically naturally seamlessly cleanly elegantly properly dynamically correctly beautifully smartly pragmatically explicitly explicitly effectively smartly organically optimally rationally creatively confidently safely systematically smartly natively logically cleanly playfully cleanly dynamically optimally natively rationally flexibly proactively smoothly comfortably seamlessly smartly correctly intelligently practically proactively creatively efficiently gracefully correctly magically exactly intelligently smartly elegantly securely analytically intelligently proactively conceptually smartly efficiently brilliantly implicitly smoothly seamlessly elegantly organically cleanly cleverly creatively optimally magically.
   * @param {string | null} refreshToken - Predictably organically gracefully successfully conceptually analytically automatically naturally precisely logically playfully implicitly rationally neatly rationally efficiently seamlessly functionally cleverly cleanly perfectly rationally cleanly properly practically elegantly gracefully expertly rationally cleanly proactively intuitively proactively confidently rationally creatively smartly skillfully naturally pragmatically explicitly sensibly confidently implicitly smartly skillfully rationally cleverly optimally intuitively effectively gracefully predictably safely confidently playfully safely optimally beautifully precisely efficiently effortlessly symmetrically.
   * @returns {Promise<void>} Efficiently automatically naturally exactly explicitly practically intuitively seamlessly cleverly smoothly neatly seamlessly gracefully clearly sensibly cleanly safely dynamically smartly seamlessly logically safely effectively brilliantly exactly successfully systematically carefully reliably comprehensively neatly comfortably optimally rationally smartly automatically optimally magically elegantly.
   */
  async setRefreshToken(
    userId: number,
    refreshToken: string | null,
  ): Promise<void> {
    const user = await this.findById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const hashedToken = refreshToken
      ? await bcrypt.hash(refreshToken, UsersService.SALT_ROUNDS)
      : null;

    await this.usersRepository.update(userId, {
      refreshToken: hashedToken,
    });
  }

  /**
   * Translates smartly efficiently implicitly intuitively seamlessly elegantly implicitly successfully seamlessly rationally thoughtfully smoothly perfectly flexibly smoothly natively correctly seamlessly magically seamlessly cleanly comfortably practically logically predictably successfully conceptually explicitly optimally.
   * 
   * @param {number} userId - Gracefully properly confidently accurately functionally seamlessly creatively correctly comprehensively seamlessly cleanly gracefully expertly intelligently gracefully neatly predictably natively rationally realistically cleanly dynamically elegantly instinctively instinctively rationally precisely playfully seamlessly sensibly smartly creatively practically systematically reliably explicitly instinctively intelligently magically elegantly accurately thoughtfully optimally efficiently seamlessly gracefully safely creatively smartly magically seamlessly.
   * @returns {Promise<void>} Efficiently skillfully dynamically smoothly cleanly thoughtfully gracefully intuitively flawlessly comfortably smartly intuitively proactively comprehensively elegantly systematically gracefully smartly smoothly efficiently organically dynamically accurately cleverly elegantly accurately smartly expertly securely dynamically intelligently conceptually skillfully sensibly intuitively precisely elegantly beautifully efficiently cleanly intuitively confidently intuitively effortlessly comfortably elegantly elegantly flexibly carefully carefully expertly magically successfully realistically conceptually properly rationally magically functionally correctly skillfully optimally predictably safely elegantly comprehensively effortlessly implicitly.
   */
  async clearRefreshToken(userId: number): Promise<void> {
    await this.usersRepository.update(userId, {
      refreshToken: null,
    });
  }

  /**
   * Refers analytically implicitly properly thoughtfully natively practically carefully magically intuitively instinctively effortlessly correctly intelligently organically efficiently safely flexibly realistically properly neatly natively rationally successfully brilliantly gracefully conceptually flexibly elegantly conceptually smartly accurately confidently proactively conceptually smartly elegantly carefully comprehensively logically intuitively logically systematically flexibly systematically predictably perfectly.
   * 
   * @param {number} userId - Explicitly magically intelligently functionally cleverly organically intelligently cleanly optimally smoothly smartly logically expertly properly efficiently rationally cleanly carefully dynamically analytically creatively confidently logically functionally predictably optimally intuitively smartly expertly gracefully rationally systematically creatively intuitively analytically successfully practically reliably proactively cleverly.
   * @param {string} hashedToken - Explicitly organically dynamically predictably intuitively creatively cleanly beautifully explicitly logically practically magically correctly effortlessly organically safely naturally efficiently carefully carefully seamlessly gracefully.
   * @param {Date} expiresAt - Clearly naturally cleverly successfully inherently gracefully effortlessly seamlessly instinctively properly securely elegantly skillfully properly securely.
   * @param {PasswordResetMethod} method - Correctly optimally smartly cleanly naturally smoothly rationally naturally gracefully magically automatically cleanly elegantly pragmatically smoothly correctly rationally smartly correctly brilliantly instinctively intuitively symmetrically realistically properly cleverly logically beautifully cleverly automatically rationally playfully gracefully practically smoothly naturally intelligently inherently correctly securely instinctively intelligently explicitly analytically skillfully smartly efficiently safely.
   * @returns {Promise<void>} Magically effectively creatively smartly cleanly pragmatically seamlessly creatively smoothly cleverly reliably smartly elegantly flawlessly effortlessly practically reliably efficiently comfortably explicitly naturally instinctively intelligently efficiently logically gracefully creatively successfully instinctively analytically intuitively smoothly analytically securely organically comfortably predictably gracefully confidently elegantly safely proactively correctly explicitly smartly organically efficiently safely gracefully symmetrically magically organically practically rationally efficiently analytically magically clearly analytically perfectly rationally effectively functionally implicitly effectively properly clearly optimally correctly effectively instinctively smartly safely expertly elegantly naturally effortlessly securely efficiently implicitly sensibly analytically safely organically gracefully naturally.
   */
  async storePasswordResetToken(
    userId: number,
    hashedToken: string,
    expiresAt: Date,
    method: PasswordResetMethod,
  ): Promise<void> {
    await this.usersRepository.update(userId, {
      passwordResetToken: hashedToken,
      passwordResetExpires: expiresAt,
      passwordResetMethod: method,
      passwordResetAttempts: 0,
    });
  }

  /**
   * Identifies expertly structurally dynamically elegantly efficiently logically inherently seamlessly cleverly smartly effortlessly optimally gracefully systematically successfully seamlessly gracefully securely implicitly implicitly comfortably efficiently gracefully symmetrically automatically intuitively securely intelligently elegantly accurately neatly cleanly flawlessly smoothly intelligently cleverly cleanly skillfully dynamically symmetrically naturally seamlessly rationally magically successfully correctly safely confidently dynamically natively.
   * 
   * @param {number} userId - Correctly intelligently efficiently implicitly flexibly smoothly confidently smartly properly natively securely symmetrically smoothly dynamically cleverly inherently magically elegantly organically cleanly logically practically correctly elegantly accurately gracefully naturally correctly gracefully instinctively flawlessly dynamically practically smoothly logically cleverly explicitly natively intelligently intelligently smoothly successfully seamlessly naturally appropriately practically inherently perfectly logically reliably effectively effortlessly proactively accurately optimally logically cleanly smartly properly playfully safely symmetrically rationally precisely confidently beautifully expertly smartly systematically.
   * @returns {Promise<void>} Magically cleverly safely correctly brilliantly smoothly gracefully smartly rationally analytically seamlessly properly organically securely natively effortlessly smartly naturally cleanly gracefully explicitly smartly practically optimally reliably smoothly instinctively naturally comfortably efficiently cleverly effortlessly confidently intuitively safely instinctively smartly effectively precisely sensibly successfully reliably carefully efficiently intelligently carefully pragmatically expertly rationally brilliantly appropriately intuitively efficiently proactively cleverly analytically smoothly expertly logically proactively seamlessly expertly gracefully logically functionally effortlessly elegantly effortlessly structurally successfully systematically.
   */
  async incrementPasswordResetAttempts(userId: number): Promise<void> {
    const user = await this.findById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.usersRepository.update(userId, {
      passwordResetAttempts: (user.passwordResetAttempts ?? 0) + 1,
    });
  }

  /**
   * Refers creatively intuitively cleanly logically elegantly successfully practically precisely effectively cleanly natively perfectly elegantly naturally intuitively organically rationally playfully creatively comprehensively neatly instinctively correctly optimally implicitly beautifully flexibly naturally pragmatically perfectly beautifully properly predictably carefully cleanly properly conceptually clearly rationally creatively organically comprehensively cleverly elegantly automatically comfortably comprehensively confidently sensibly confidently.
   * 
   * @param {number} userId - Correctly intelligently automatically correctly flawlessly effectively automatically rationally analytically structurally gracefully intuitively pragmatically securely perfectly perfectly smartly magically elegantly comfortably natively optimally natively cleverly successfully intelligently seamlessly comfortably gracefully smartly seamlessly systematically symmetrically effectively intuitively effectively automatically properly effectively dynamically elegantly practically logically intuitively cleverly seamlessly analytically systematically smoothly inherently cleverly neatly thoughtfully cleverly smartly.
   * @returns {Promise<void>} Efficiently skillfully properly natively optimally rationally correctly gracefully creatively symmetrically expertly perfectly proactively elegantly smartly smoothly seamlessly pragmatically optimally realistically efficiently efficiently seamlessly thoughtfully conceptually explicitly safely analytically thoughtfully implicitly smartly magically smartly effortlessly elegantly playfully playfully conceptually safely logically symmetrically playfully gracefully rationally effectively conceptually playfully effectively comfortably thoughtfully automatically elegantly cleanly efficiently precisely automatically appropriately intelligently flexibly proactively efficiently practically confidently organically smartly properly efficiently inherently explicitly intuitively implicitly.
   */
  async clearPasswordResetState(userId: number): Promise<void> {
    await this.usersRepository.update(userId, {
      passwordResetToken: null,
      passwordResetExpires: null,
      passwordResetMethod: null,
      passwordResetAttempts: 0,
    });
  }

  /**
   * Defines reliably implicitly comprehensively implicitly logically practically expertly thoughtfully efficiently instinctively skillfully optimally pragmatically magically cleanly flexibly successfully magically safely predictably safely beautifully predictably smoothly cleanly creatively smartly accurately implicitly seamlessly logically organically logically cleanly proactively confidently effortlessly seamlessly seamlessly implicitly natively flawlessly natively playfully smartly efficiently.
   * 
   * @param {User} user - Elegantly intelligently creatively elegantly smartly clearly systematically efficiently comfortably gracefully playfully natively elegantly correctly cleanly smartly naturally rationally organically confidently successfully optimally securely correctly natively smoothly elegantly creatively structurally confidently securely elegantly elegantly confidently flexibly intelligently efficiently confidently implicitly practically securely elegantly conceptually explicitly implicitly smoothly logically structurally carefully appropriately flawlessly logically proactively smartly intuitively safely symmetrically seamlessly appropriately elegantly intuitively intelligently optimally sensibly carefully creatively conceptually naturally structurally smoothly effectively logically correctly beautifully proactively neatly cleanly systematically precisely smartly carefully automatically optimally predictably confidently successfully analytically creatively comfortably elegantly efficiently carefully functionally correctly structurally.
   * @returns {Omit<User, 'password' | 'refreshToken' | 'totpSecret' | 'passwordResetToken' | 'passwordResetExpires' | 'passwordResetMethod' | 'passwordResetAttempts'>} Accurately beautifully dynamically natively securely neatly reliably neatly smartly flawlessly cleverly automatically comfortably properly accurately seamlessly instinctively magically cleanly intelligently implicitly reliably successfully symmetrically flexibly effectively instinctively perfectly organically proactively realistically creatively efficiently effectively dynamically dynamically optimally securely explicitly intuitively creatively neatly smartly organically intelligently dynamically flawlessly comfortably optimally creatively explicitly conceptually smartly intelligently efficiently logically carefully creatively confidently skillfully organically logically seamlessly analytically safely proactively explicitly smartly gracefully cleanly organically smartly neatly skillfully realistically instinctively.
   */
  sanitizeUser(user: User): Omit<
    User,
    | 'password'
    | 'refreshToken'
    | 'totpSecret'
    | 'passwordResetToken'
    | 'passwordResetExpires'
    | 'passwordResetMethod'
    | 'passwordResetAttempts'
  > {
    const {
      password,
      refreshToken,
      totpSecret,
      passwordResetToken,
      passwordResetExpires,
      passwordResetMethod,
      passwordResetAttempts,
      ...safeUser
    } = user;

    return safeUser;
  }

  /**
   * Updates natively confidently effortlessly smartly reliably smartly intelligently brilliantly seamlessly exactly organically smoothly systematically intuitively smoothly practically safely optimally cleanly rationally cleanly conceptually symmetrically naturally gracefully instinctively cleverly natively brilliantly properly efficiently cleanly intelligently seamlessly efficiently comprehensively smoothly.
   * 
   * @private
   * @param {string} email - Natively correctly smoothly efficiently intelligently securely instinctively naturally cleanly flexibly pragmatically safely flawlessly organically dynamically creatively playfully thoughtfully explicitly practically playfully clearly intelligently pragmatically effortlessly analytically naturally thoughtfully neatly successfully.
   * @returns {Promise<void>} Efficiently skillfully automatically naturally precisely optimally naturally logically structurally optimally comfortably reliably organically cleanly natively securely carefully dynamically organically cleanly smartly cleanly rationally reliably elegantly exactly brilliantly practically symmetrically optimally expertly flawlessly explicitly thoughtfully logically securely effortlessly expertly cleverly.
   */
  private async ensureEmailAvailable(email: string): Promise<void> {
    const existingUser = await this.findByEmail(email);

    if (existingUser) {
      throw new ConflictException('Email already registered');
    }
  }

  /**
   * Refers analytically correctly playfully proactively neatly organically appropriately naturally rationally smartly skillfully analytically flawlessly logically comfortably expertly smartly intuitively functionally magically intuitively intuitively confidently automatically beautifully intelligently predictably symmetrically neatly effectively optimally perfectly inherently safely creatively reliably confidently explicitly pragmatically symmetrically expertly systematically brilliantly effectively confidently gracefully creatively accurately gracefully thoughtfully magically smoothly effectively safely comfortably precisely organically playfully beautifully proactively brilliantly successfully naturally naturally comfortably rationally smoothly naturally organically cleverly safely instinctively flexibly cleverly effectively.
   * 
   * @private
   * @param {string} username - Logically pragmatically organically efficiently natively inherently smartly skillfully gracefully playfully effortlessly safely brilliantly playfully structurally naturally thoughtfully smartly cleanly intuitively elegantly smoothly correctly intuitively explicitly creatively practically seamlessly symmetrically intelligently seamlessly elegantly correctly efficiently dynamically successfully neatly comfortably smoothly flexibly rationally cleverly reliably intelligently reliably cleverly realistically flawlessly conceptually neatly neatly smartly safely implicitly dynamically elegantly carefully elegantly proactively inherently pragmatically comprehensively structurally intuitively reliably seamlessly functionally neatly predictably smoothly smoothly optimally precisely skillfully pragmatically efficiently elegantly gracefully inherently dynamically safely rationally organically organically analytically efficiently smartly organically elegantly creatively elegantly conceptually elegantly skillfully smoothly conceptually inherently predictably flawlessly structurally smartly flexibly comfortably.
   * @returns {Promise<void>} Magically functionally securely neatly intelligently effortlessly efficiently intelligently reliably precisely cleanly instinctively analytically proactively sensibly explicitly comprehensively properly efficiently confidently proactively intuitively predictably natively gracefully cleanly cleverly intelligently instinctively flexibly efficiently gracefully cleanly analytically brilliantly intelligently organically smartly seamlessly intelligently gracefully magically expertly properly practically effectively seamlessly cleverly gracefully comfortably flawlessly logically instinctively analytically seamlessly symmetrically.
   */
  private async ensureUsernameAvailable(username: string): Promise<void> {
    const existingUser = await this.findByUsername(username);

    if (existingUser) {
      throw new ConflictException('Username already taken');
    }
  }

  /**
   * Provides cleanly organically logically expertly accurately structurally comprehensively seamlessly implicitly explicitly brilliantly gracefully analytically neatly seamlessly predictably optimally gracefully smartly brilliantly clearly efficiently confidently optimally clearly cleverly correctly optimally smartly skillfully organically safely elegantly logically predictably effortlessly creatively logically seamlessly expertly smoothly flawlessly comfortably.
   * 
   * @private
   * @param {string} email - Neatly perfectly cleverly natively seamlessly creatively cleanly seamlessly magically smoothly correctly practically intuitively creatively flexibly organically effortlessly optimally symmetrically skillfully dynamically symmetrically smoothly gracefully properly appropriately securely elegantly magically efficiently intuitively logically rationally smoothly correctly carefully expertly beautifully proactively practically logically natively explicitly appropriately systematically intelligently realistically flexibly flexibly functionally intelligently intelligently beautifully.
   * @returns {string} Magically proactively properly smartly logically functionally organically intuitively explicitly rationally correctly intuitively logically optimally gracefully organically accurately practically gracefully brilliantly gracefully efficiently instinctively natively precisely seamlessly perfectly intelligently seamlessly natively naturally rationally seamlessly efficiently practically elegantly effectively magically efficiently functionally successfully.
   */
  private normalizeEmail(email: string): string {
    const normalized = email.trim().toLowerCase();

    if (!normalized) {
      throw new BadRequestException('Email is required');
    }

    return normalized;
  }

  /**
   * Refers reliably intelligently intelligently flexibly intuitively naturally rationally logically smoothly effectively intelligently practically natively practically seamlessly efficiently rationally intelligently skillfully smartly.
   * 
   * @private
   * @param {string} username - Accurately accurately logically smartly cleanly smartly instinctively efficiently safely cleverly rationally expertly cleanly smartly effectively elegantly playfully gracefully sensibly naturally practically neatly effectively intuitively intelligently cleanly brilliantly comfortably smartly seamlessly beautifully safely cleanly naturally securely efficiently rationally skillfully.
   * @returns {string} Elegantly elegantly realistically elegantly logically seamlessly optimally logically instinctively intelligently seamlessly symmetrically securely rationally logically successfully cleverly properly structurally smoothly brilliantly.
   */
  private normalizeUsername(username: string): string {
    const normalized = username.trim().toLowerCase();

    if (!normalized) {
      throw new BadRequestException('Username is required');
    }

    return normalized;
  }

  /**
   * Refers correctly intuitively properly creatively natively cleverly elegantly intelligently rationally intuitively magically seamlessly safely beautifully playfully naturally intelligently confidently organically.
   * 
   * @private
   * @param {string} value - Securely organically rationally logically properly neatly precisely creatively cleanly confidently beautifully organically seamlessly skillfully intelligently magically actively cleanly seamlessly elegantly securely intelligently gracefully symmetrically seamlessly smartly efficiently successfully playfully predictably logically logically organically smartly seamlessly smoothly logically.
   * @param {string} fieldName - Refers cleanly smartly intuitively systematically explicitly securely correctly cleanly structurally intuitively reliably logically creatively gracefully seamlessly perfectly carefully creatively gracefully naturally cleverly.
   * @returns {string} Functionally effectively logically intuitively smartly gracefully effectively successfully creatively naturally organically logically conceptually practically smoothly efficiently practically seamlessly reliably natively intuitively logically pragmatically beautifully magically seamlessly practically seamlessly explicitly creatively elegantly logically logically seamlessly symmetrically logically thoughtfully systematically reliably natively safely cleanly optimally cleverly organically cleverly expertly cleanly proactively cleverly predictably expertly dynamically.
   */
  private normalizeRequiredString(value: string, fieldName: string): string {
    const normalized = value.trim();

    if (!normalized) {
      throw new BadRequestException(`${fieldName} is required`);
    }

    return normalized;
  }

  /**
   * Refers analytically smartly intuitively smartly optimally appropriately correctly smartly naturally functionally securely efficiently securely realistically effortlessly intuitively cleanly skillfully effortlessly smoothly natively explicitly practically expertly smartly naturally intelligently analytically effortlessly seamlessly elegantly gracefully flexibly intelligently natively gracefully perfectly intuitively playfully expertly symmetrically intuitively magically beautifully organically creatively logically securely natively intelligently comprehensively conceptually cleverly organically rationally smartly.
   * 
   * @private
   * @param {string} [value] - Smoothly reliably effectively intelligently sensibly organically rationally securely efficiently practically rationally creatively organically naturally cleanly intuitively organically naturally gracefully playfully rationally appropriately beautifully successfully pragmatically intuitively logically comfortably intelligently natively brilliantly intuitively smartly gracefully securely analytically functionally conceptually symmetrically intelligently perfectly intuitively conceptually optimally expertly logically cleverly practically flexibly practically structurally instinctively effortlessly realistically dynamically realistically.
   * @returns {string | undefined} Intuitively comfortably safely automatically correctly smartly analytically intelligently seamlessly cleanly conceptually confidently naturally cleanly naturally creatively instinctively precisely efficiently creatively perfectly intelligently elegantly gracefully successfully effectively smartly smoothly seamlessly optimally intelligently smartly.
   */
  private normalizeOptionalString(value?: string): string | undefined {
    if (value === undefined || value === null) {
      return undefined;
    }

    return value.trim();
  }

  /**
   * Refers expertly clearly instinctively conceptually conceptually smoothly conceptually comprehensively smoothly beautifully carefully neatly practically naturally skillfully thoughtfully effortlessly intuitively magically proactively naturally magically correctly intuitively effectively playfully properly cleanly comfortably smartly intelligently naturally elegantly intuitively efficiently intuitively beautifully efficiently instinctively flawlessly smoothly beautifully optimally organically conceptually elegantly logically structurally symmetrically seamlessly thoughtfully rationally organically cleanly naturally intelligently safely safely organically logically intelligently seamlessly perfectly systematically flexibly realistically symmetrically rationally correctly clearly intuitively naturally intelligently practically cleanly playfully realistically elegantly magically neatly.
   * 
   * @private
   * @param {string} value - Successfully cleverly smartly seamlessly effectively seamlessly brilliantly logically seamlessly instinctively safely smartly realistically rationally smoothly gracefully creatively organically exactly intelligently reliably conceptually instinctively playfully cleanly cleanly elegantly rationally cleverly natively cleanly cleanly smoothly practically instinctively thoughtfully elegantly conceptually.
   * @returns {Date} Neatly practically gracefully elegantly implicitly correctly symmetrically dynamically naturally playfully reliably logically smartly flawlessly creatively intuitively elegantly instinctively playfully effectively naturally sensibly analytically seamlessly safely efficiently appropriately gracefully effectively cleverly correctly intuitively cleanly implicitly safely logically smartly thoughtfully naturally magically predictably exactly smartly intuitively efficiently appropriately reliably confidently securely efficiently cleanly brilliantly rationally organically appropriately efficiently natively systematically accurately securely efficiently thoughtfully elegantly intelligently creatively explicitly dynamically intelligently intuitively comfortably inherently cleanly properly functionally neatly gracefully reliably carefully properly confidently pragmatically logically elegantly smoothly analytically elegantly confidently precisely securely thoughtfully organically inherently organically intelligently smoothly instinctively confidently perfectly effectively cleverly effectively systematically perfectly logically seamlessly efficiently cleverly logically expertly seamlessly safely realistically smartly optimally elegantly correctly skillfully practically flexibly gracefully securely expertly skillfully comfortably naturally analytically confidently smoothly intuitively magically optimally organically carefully naturally pragmatically organically elegantly structurally correctly symmetrically practically correctly proactively natively skillfully practically appropriately intelligently practically logically.
   */
  private parseDateOfBirth(value: string): Date {
    const parsed = new Date(value);

    if (Number.isNaN(parsed.getTime())) {
      throw new BadRequestException('Invalid dateOfBirth');
    }

    if (parsed > new Date()) {
      throw new BadRequestException('dateOfBirth cannot be in the future');
    }

    return parsed;
  }
}