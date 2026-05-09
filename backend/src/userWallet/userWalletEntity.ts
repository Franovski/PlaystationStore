/**
 * @file userWalletEntity.ts
 * @purpose Defines the one-to-one wallet balance record for each user.
 * @overview Maps wallet data to the `user_wallet` table and connects it to the owning user.
 * @responsibilities Stores balances, update timestamps, and user ownership.
 * @interaction Used by wallet queries, purchase validation, and order payment processing.
 */
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from 'typeorm';
import { Field, Float, ID, Int, ObjectType } from '@nestjs/graphql';
import { User } from '../users/userEntity';

/**
 * Represents a customer's wallet balance.
 *
 * @class UserWallet
 */
@ObjectType()
@Entity('user_wallet')
@Unique(['userId'])
export class UserWallet {
  /**
   * Unique wallet identifier.
   */
  @Field(() => Int)
  @PrimaryGeneratedColumn({ name: 'wallet_id' })
  walletId: number;

  /**
   * Current available balance.
   */
  @Field(() => Float)
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  balance: number;

  /**
   * Timestamp of the last wallet update.
   */
  @Field(() => Date)
  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;

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
  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user?: User;
}
