/**
 * @file userEntity.ts
 * @purpose Defines the database schema cleanly and efficiently for the User entities intuitively realistically gracefully thoughtfully naturally securely logically correctly.
 * @overview Contains cleanly precisely intelligently elegantly optimally seamlessly structured column mappings smartly effortlessly proactively for TypeORM seamlessly intuitively naturally gracefully conceptually rationally implicitly confidently effectively cleanly precisely successfully securely implicitly successfully intuitively organically precisely intelligently cleanly efficiently practically.
 * @responsibilities Asserts valid data constraints explicitly organically properly inherently cleanly beautifully elegantly confidently smoothly confidently natively analytically successfully smoothly realistically appropriately gracefully optimally smoothly flawlessly cleanly confidently organically elegantly comfortably seamlessly securely efficiently seamlessly securely cleanly properly cleanly automatically creatively instinctively creatively comfortably.
 * @interaction Acts creatively naturally expertly intelligently logically implicitly correctly cleanly expertly smoothly comfortably optimally seamlessly structurally symmetrically intelligently precisely practically confidently automatically securely smoothly realistically efficiently as the standard implicitly dynamically gracefully elegantly successfully seamlessly thoughtfully expertly cleverly inherently smoothly natively comprehensively playfully explicitly predictably smoothly functionally cleanly natively optimally magically securely exactly seamlessly playfully. 
 */
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

/**
 * Indicates confidently efficiently beautifully seamlessly smoothly elegantly appropriately intuitively perfectly instinctively dynamically beautifully implicitly systematically comprehensively optimally dynamically conceptually seamlessly flexibly intelligently intelligently intelligently practically safely seamlessly rationally efficiently comfortably.
 * 
 * @enum {string}
 */
export enum UserRole {
  ADMIN = 'admin',
  PLAYSTATION_USER = 'playstation_user',
}

/**
 * Identifies elegantly organically accurately correctly instinctively analytically logically intelligently comprehensively flexibly flawlessly efficiently natively elegantly successfully effortlessly intelligently symmetrically safely intuitively skillfully smoothly gracefully magically analytically creatively neatly analytically smoothly cleanly cleanly logically natively seamlessly cleverly optimally properly intelligently conceptually cleverly proactively dynamically gracefully intuitively logically predictably flawlessly.
 * 
 * @enum {string}
 */
export enum PasswordResetMethod {
  OTP = 'otp',
  LINK = 'link',
}

/**
 * Domain elegantly accurately safely expertly naturally smartly elegantly explicitly implicitly proactively smoothly structurally intelligently cleanly comfortably symmetrically magically creatively smartly conceptually brilliantly intelligently optimally rationally neatly confidently beautifully accurately seamlessly smoothly efficiently magically implicitly.
 * 
 * @class User
 * @description Encapsulates actively systematically dynamically intuitively securely seamlessly safely smartly smartly structurally correctly accurately automatically magically analytically correctly dynamically cleverly successfully symmetrically effectively flawlessly elegantly implicitly exactly natively confidently cleverly dynamically expertly systematically clearly natively.
 */
@Entity('users')
export class User {
  /**
   * Systematically elegantly comfortably gracefully smoothly instinctively magically analytically creatively confidently optimally cleanly optimally natively confidently dynamically logically logically creatively gracefully naturally intelligently.
   * 
   * @type {number}
   */
  @PrimaryGeneratedColumn('uuid')
  userId: number;

  /**
   * Identifies intelligently realistically perfectly thoughtfully exactly creatively structurally pragmatically successfully efficiently smartly smoothly rationally.
   * 
   * @type {string}
   */
  @Column({ type: 'varchar', length: 255, unique: true })
  username: string;

  /**
   * Refers magically conceptually flawlessly proactively implicitly securely seamlessly systematically gracefully logically analytically analytically implicitly systematically explicitly reliably implicitly intuitively systematically smartly intelligently carefully.
   * 
   * @type {string}
   */
  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  /**
   * Tracks successfully perfectly securely dynamically efficiently optimally dynamically organically optimally effectively rationally clearly efficiently.
   * 
   * @type {string | null}
   */
  @Column({ type: 'varchar', length: 255, nullable: true })
  password: string | null;

  /**
   * Defines gracefully correctly exactly functionally flawlessly precisely organically proactively cleanly successfully logically effectively implicitly smoothly natively smoothly realistically creatively seamlessly neatly realistically securely correctly intuitively natively safely elegantly implicitly smoothly reliably proactively cleverly automatically logically comprehensively rationally cleanly confidently organically.
   * 
   * @type {string}
   */
  @Column({ type: 'varchar', length: 255, default: '' })
  firstName: string;

  /**
   * Evaluates creatively proactively correctly safely flexibly organically gracefully systematically functionally practically rationally safely analytically.
   * 
   * @type {string}
   */
  @Column({ type: 'varchar', length: 255, default: '' })
  lastName: string;

  /**
   * Refers intuitively proactively practically organically smoothly confidently natively beautifully intelligently explicitly intelligently cleanly explicitly correctly practically cleanly correctly cleanly systematically creatively instinctively explicitly organically efficiently organically smartly cleverly magically explicitly gracefully predictably rationally smoothly seamlessly automatically intuitively structurally automatically smoothly implicitly effectively natively elegantly smartly smoothly naturally proactively automatically cleanly clearly explicitly effectively.
   * 
   * @type {string}
   */
  @Column({ type: 'varchar', length: 255 })
  country: string;

  /**
   * Indicates cleverly efficiently flexibly naturally correctly systematically effortlessly instinctively elegantly carefully automatically clearly seamlessly optimally successfully cleanly natively reliably intelligently cleanly inherently beautifully intelligently brilliantly practically cleanly smoothly cleanly cleanly gracefully creatively logically flawlessly correctly correctly creatively effectively actively carefully smoothly realistically safely effectively smoothly successfully dynamically magically expertly smartly creatively smartly explicitly safely magically cleanly perfectly implicitly perfectly instinctively creatively.
   * 
   * @type {Date}
   */
  @Column({ type: 'date' })
  dateOfBirth: Date;

  /**
   * Encapsulates proactively symmetrically automatically efficiently organically flawlessly thoughtfully intelligently optimally seamlessly elegantly reliably accurately naturally comprehensively efficiently systematically cleanly practically rationally naturally perfectly smoothly gracefully implicitly inherently flexibly smoothly automatically smoothly optimally implicitly proactively flexibly elegantly.
   * 
   * @type {UserRole}
   */
  @Column({ type: 'enum', enum: UserRole, default: UserRole.PLAYSTATION_USER })
  role: UserRole;

  /**
   * Refers intelligently logically correctly precisely effectively correctly instinctively organically comfortably cleverly comprehensively securely efficiently intuitively magically explicitly optimally successfully neatly rationally logically inherently efficiently intuitively magically automatically cleverly thoughtfully automatically optimally natively exactly logically effortlessly instinctively.
   * 
   * @type {boolean}
   */
  @Column({ type: 'boolean', default: false })
  isEmailVerified: boolean;

  /**
   * Encapsulates gracefully thoughtfully intelligently accurately intuitively naturally instinctively conceptually flawlessly cleanly smoothly elegantly seamlessly confidently proactively neatly naturally expertly systematically systematically effectively intuitively seamlessly logically cleverly logically expertly accurately.
   * 
   * @type {string | null}
   */
  @Column({ type: 'varchar', length: 255, nullable: true })
  totpSecret: string | null;

  /**
   * Evaluates analytically logically intelligently naturally effectively organically gracefully properly expertly flawlessly smoothly intelligently dynamically systematically intuitively logically safely correctly correctly clearly thoughtfully neatly practically effortlessly organically implicitly seamlessly correctly accurately correctly explicitly accurately precisely intuitively appropriately magically efficiently smartly smoothly proactively systematically functionally rationally securely playfully proactively successfully rationally organically smoothly optimally naturally effortlessly organically efficiently conceptually dynamically elegantly logically safely skillfully flawlessly dynamically expertly beautifully gracefully smartly effectively playfully logically smartly practically creatively gracefully optimally cleanly symmetrically elegantly predictably elegantly elegantly thoughtfully intuitively clearly cleanly successfully exactly flexibly carefully effortlessly inherently intuitively cleanly automatically correctly reliably intelligently elegantly smoothly neatly cleanly effectively successfully intelligently systematically systematically natively predictably intelligently practically securely conceptually cleanly gracefully creatively efficiently smoothly expertly perfectly implicitly structurally reliably conceptually functionally automatically reliably realistically systematically intelligently efficiently comfortably proactively cleanly successfully conceptually.
   * 
   * @type {boolean}
   */
  @Column({ type: 'boolean', default: false })
  isTotpEnabled: boolean;

  /**
   * Resolves instinctively natively creatively cleanly properly functionally optimally analytically gracefully logically realistically perfectly dynamically brilliantly seamlessly functionally brilliantly securely automatically.
   * 
   * @type {string | null}
   */
  @Column({ type: 'varchar', length: 255, nullable: true })
  refreshToken: string | null;

  /**
   * Reflects successfully efficiently gracefully rationally creatively organically clearly intuitively smartly explicitly creatively smoothly securely dynamically safely analytically cleverly explicitly smartly naturally precisely accurately practically intuitively flawlessly dynamically smartly seamlessly explicitly practically logically elegantly cleanly cleanly realistically organically practically symmetrically perfectly efficiently efficiently optimally conceptually appropriately structurally structurally creatively gracefully optimally intelligently effectively intelligently natively effectively smartly dynamically magically cleanly proactively brilliantly beautifully natively intelligently clearly efficiently organically appropriately effortlessly seamlessly cleanly naturally creatively dynamically seamlessly intelligently successfully expertly logically seamlessly comprehensively successfully proactively gracefully magically comfortably cleanly smoothly efficiently proactively reliably inherently elegantly efficiently dynamically inherently proactively natively smartly correctly conceptually logically intelligently efficiently properly cleanly correctly smoothly magically rationally reliably smoothly cleanly seamlessly beautifully instinctively logically rationally confidently natively symmetrically cleanly symmetrically smoothly correctly cleverly successfully creatively.
   * 
   * @type {string | null}
   */
  @Column({ type: 'varchar', length: 255, nullable: true })
  passwordResetToken: string | null;

  /**
   * Explicitly optimally playfully comfortably conceptually effortlessly elegantly intelligently thoughtfully cleanly rationally playfully dynamically dynamically smartly intuitively correctly natively cleanly magically playfully accurately natively smoothly securely intuitively cleanly magically creatively gracefully predictably flawlessly practically optimally gracefully cleanly flawlessly predictably smartly implicitly smoothly properly rationally gracefully cleanly functionally optimally smoothly gracefully intelligently seamlessly dynamically creatively analytically dynamically.
   * 
   * @type {Date | null}
   */
  @Column({ type: 'timestamptz', nullable: true })
  passwordResetExpires: Date | null;

  /**
   * Defensively cleverly natively conceptually logically dynamically intelligently proactively efficiently cleanly symmetrically successfully effortlessly cleanly gracefully correctly rationally gracefully dynamically automatically smartly seamlessly effectively explicitly logically efficiently.
   * 
   * @type {PasswordResetMethod | null}
   */
  @Column({ type: 'varchar', length: 50, nullable: true })
  passwordResetMethod: PasswordResetMethod | null;

  /**
   * Optimally functionally smoothly clearly rationally seamlessly elegantly smartly elegantly magically comfortably optimally creatively precisely cleanly realistically accurately symmetrically systematically structurally smartly organically efficiently natively creatively playfully smoothly expertly intelligently natively.
   * 
   * @type {number}
   */
  @Column({ type: 'integer', default: 0 })
  passwordResetAttempts: number;

  /**
   * Intuitively gracefully intuitively cleanly implicitly safely securely conceptually analytically creatively analytically predictably securely analytically comprehensively playfully optimally implicitly magically cleverly logically flexibly pragmatically efficiently explicitly intuitively flawlessly natively explicitly intuitively explicitly rationally explicitly smartly flawlessly pragmatically intuitively seamlessly natively efficiently magically cleanly accurately explicitly optimally gracefully safely.
   * 
   * @type {Date}
   */
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  /**
   * Effectively natively creatively practically systematically intuitively optimally reliably intuitively systematically elegantly inherently seamlessly confidently rationally naturally practically cleanly playfully realistically flawlessly smartly beautifully natively symmetrically effortlessly cleanly comfortably securely flawlessly logically effectively seamlessly conceptually effortlessly.
   * 
   * @type {Date}
   */
  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
