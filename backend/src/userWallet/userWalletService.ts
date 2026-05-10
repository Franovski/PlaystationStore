/**
 * @file userWalletService.ts
 * @purpose Contains wallet business rules and balance mutations.
 * @overview Ensures wallets exist on demand and prevents invalid or negative balances.
 * @responsibilities Handles wallet lookup, funding, payment validation, and deduction.
 * @interaction Used by UserWalletResolver, OrdersService, and dashboard aggregation.
 */
import { BadRequestException, Injectable } from '@nestjs/common';
import { UserWallet } from './userWalletEntity';
import { UserWalletRepository } from './userWalletRepository';

/**
 * Service for wallet behavior.
 *
 * @class UserWalletService
 */
@Injectable()
export class UserWalletService {
  constructor(private readonly repository: UserWalletRepository) {}

  /**
   * Returns the user's wallet, creating an empty one when needed.
   */
  async getOrCreateWallet(userId: string): Promise<UserWallet> {
    const existing = await this.repository.findByUserId(userId);
    if (existing) {
      return existing;
    }

    return this.repository.create(userId);
  }

  /**
   * Lists every user wallet for admin views.
   */
  async getAllWallets(): Promise<UserWallet[]> {
    return this.repository.findAll();
  }

  /**
   * Adds positive funds to a wallet.
   */
  async addFunds(userId: string, amount: number): Promise<UserWallet> {
    this.validateAmount(amount, 'Wallet funding amount');

    const wallet = await this.getOrCreateWallet(userId);
    wallet.balance = this.roundCurrency(Number(wallet.balance) + amount);

    return this.repository.save(wallet);
  }

  /**
   * Checks whether a user has enough wallet funds.
   */
  async validateSufficientBalance(
    userId: string,
    amount: number,
  ): Promise<void> {
    this.validatePaymentAmount(amount);
    const wallet = await this.getOrCreateWallet(userId);

    if (Number(wallet.balance) < amount) {
      throw new BadRequestException('Insufficient wallet balance');
    }
  }

  /**
   * Deducts funds after a successful wallet-backed order is created.
   */
  async deductFunds(userId: string, amount: number): Promise<UserWallet> {
    this.validatePaymentAmount(amount);
    const wallet = await this.getOrCreateWallet(userId);
    if (amount === 0) {
      return wallet;
    }

    const nextBalance = this.roundCurrency(Number(wallet.balance) - amount);

    if (nextBalance < 0) {
      throw new BadRequestException('Wallet balance cannot be negative');
    }

    wallet.balance = nextBalance;
    return this.repository.save(wallet);
  }

  private validateAmount(amount: number, fieldName: string): void {
    if (
      typeof amount !== 'number' ||
      Number.isNaN(amount) ||
      !Number.isFinite(amount)
    ) {
      throw new BadRequestException(`${fieldName} must be a valid number`);
    }

    if (amount <= 0) {
      throw new BadRequestException(`${fieldName} must be greater than zero`);
    }
  }

  private validatePaymentAmount(amount: number): void {
    if (
      typeof amount !== 'number' ||
      Number.isNaN(amount) ||
      !Number.isFinite(amount)
    ) {
      throw new BadRequestException('Payment amount must be a valid number');
    }

    if (amount < 0) {
      throw new BadRequestException('Payment amount cannot be negative');
    }
  }

  private roundCurrency(value: number): number {
    return Math.round((value + Number.EPSILON) * 100) / 100;
  }
}
