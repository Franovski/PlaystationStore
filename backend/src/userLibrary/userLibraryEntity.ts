/**
 * @file userLibraryEntity.ts
 * @purpose Defines customer ownership records for games, DLCs, and editions.
 * @overview Maps purchases into the `user_library` table using a polymorphic item type and item ID pair.
 * @responsibilities Stores ownership dates and prevents duplicate ownership of the same item by the same user.
 * @interaction Used by purchase fulfillment, review eligibility, and customer dashboard library views.
 */
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { User } from '../users/userEntity';
import { Game } from '../games/gameEntity';
import { DLC } from '../dlc/dlcEntity';
import { Edition } from '../editions/editionEntity';

/**
 * Represents one item owned by a user.
 *
 * @class UserLibrary
 */
@ObjectType()
@Entity('user_library')
@Unique(['userId', 'itemType', 'itemId'])
export class UserLibrary {
  /**
   * Unique library row identifier.
   */
  @Field(() => Int)
  @PrimaryGeneratedColumn({ name: 'library_id' })
  libraryId: number;

  /**
   * Timestamp when the item entered the user's library.
   */
  @Field(() => Date)
  @CreateDateColumn({ name: 'purchase_date', type: 'timestamptz' })
  purchaseDate: Date;

  /**
   * Type of owned item: game, dlc, or edition.
   */
  @Field()
  @Column({ name: 'item_type', type: 'varchar', length: 50 })
  itemType: string;

  /**
   * Identifier of the owned item in its own table.
   */
  @Field(() => Int)
  @Column({ name: 'item_id' })
  itemId: number;

  /**
   * Owning user identifier.
   */
  @Field(() => ID)
  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  /**
   * Optional loaded user relation.
   */
  @Field(() => User, { nullable: true })
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user?: User;

  /**
   * Loaded game display data when itemType is game.
   */
  @Field(() => Game, { nullable: true })
  game?: Game | null;

  /**
   * Loaded DLC display data when itemType is dlc.
   */
  @Field(() => DLC, { nullable: true })
  dlc?: DLC | null;

  /**
   * Loaded edition display data when itemType is edition.
   */
  @Field(() => Edition, { nullable: true })
  edition?: Edition | null;
}
