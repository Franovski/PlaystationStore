/**
 * @file userWalletRepository.ts
 * @purpose Provides direct database access for user wallets.
 * @overview Wraps TypeORM wallet operations for use by business services.
 * @responsibilities Finds, creates, and persists wallet balances.
 * @interaction Used by UserWalletService and purchase payment processing.
 */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserWallet } from './userWalletEntity';

/**
 * Repository wrapper for user wallets.
 *
 * @class UserWalletRepository
 */
@Injectable()
export class UserWalletRepository {
  constructor(
    @InjectRepository(UserWallet)
    private readonly repository: Repository<UserWallet>,
  ) {}

  /**
   * Finds a wallet by its owning user.
   */
  async findByUserId(userId: string): Promise<UserWallet | null> {
    return this.repository.findOne({ where: { userId } });
  }

  /**
   * Finds all wallets with their owners for admin management.
   */
  async findAll(): Promise<UserWallet[]> {
    return this.repository.find({
      relations: ['user'],
      order: { updatedAt: 'DESC' },
    });
  }

  /**
   * Creates a wallet with the provided starting balance.
   */
  async create(userId: string, balance = 0): Promise<UserWallet> {
    const wallet = this.repository.create({ userId, balance });
    return this.repository.save(wallet);
  }

  /**
   * Saves a wallet entity after balance mutation.
   */
  async save(wallet: UserWallet): Promise<UserWallet> {
    return this.repository.save(wallet);
  }
}
