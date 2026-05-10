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
import { CreateUserDto, UpdateUserDto, UpdateUserSettingsDto } from './userDto';
import { RegisterDto } from '../auth/dto/register';

@Injectable()
export class UsersService {
  private static readonly SALT_ROUNDS = 12;

  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

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

  async findAll(): Promise<Partial<User>[]> {
    return this.usersRepository.find({
      select: {
        userId: true,
        username: true,
        email: true,
        password: true,
        firstName: true,
        lastName: true,
        country: true,
        dateOfBirth: true,
        role: true,
        isEmailVerified: true,
        totpSecret: true,
        isTotpEnabled: true,
        refreshToken: true,
        passwordResetToken: true,
        passwordResetExpires: true,
        passwordResetMethod: true,
        passwordResetAttempts: true,
        createdAt: true,
        updatedAt: true,
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findById(userId: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { userId },
    });
  }

  async findSafeById(userId: string): Promise<Partial<User> | null> {
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

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository
      .createQueryBuilder('user')
      .where('LOWER(user.email) = LOWER(:email)', {
        email: email.trim(),
      })
      .getOne();
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.usersRepository
      .createQueryBuilder('user')
      .where('LOWER(user.username) = LOWER(:username)', {
        username: username.trim(),
      })
      .getOne();
  }

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

  async update(
    userId: string,
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
      existingUser.country = this.normalizeRequiredString(
        dto.country,
        'country',
      );
    }

    if (dto.dateOfBirth !== undefined) {
      existingUser.dateOfBirth = this.parseDateOfBirth(dto.dateOfBirth);
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

  async updateUserSettings(
    userId: string,
    dto: UpdateUserSettingsDto,
    actorUserId?: string,
  ): Promise<Partial<User>> {
    const existingUser = await this.findById(userId);

    if (!existingUser) {
      throw new NotFoundException('User not found');
    }

    if (Object.keys(dto).length === 0) {
      const dbUser = await this.usersRepository.findOne({
        where: { userId },
        select: {
          userId: true,
          username: true,
          email: true,
          password: true,
          firstName: true,
          lastName: true,
          country: true,
          dateOfBirth: true,
          role: true,
          isEmailVerified: true,
          totpSecret: true,
          isTotpEnabled: true,
          refreshToken: true,
          passwordResetToken: true,
          passwordResetExpires: true,
          passwordResetMethod: true,
          passwordResetAttempts: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      return dbUser as Partial<User>;
    }

    if (dto.role !== undefined) {
      if (actorUserId === userId && dto.role !== existingUser.role) {
        throw new BadRequestException(
          'Admins cannot change their own role from Settings.',
        );
      }

      existingUser.role = dto.role;
    }

    if (dto.isEmailVerified !== undefined) {
      existingUser.isEmailVerified = dto.isEmailVerified;
    }

    if (dto.isTotpEnabled !== undefined) {
      existingUser.isTotpEnabled = dto.isTotpEnabled;
    }

    if (dto.password && dto.password.trim()) {
      existingUser.password = await bcrypt.hash(
        dto.password,
        UsersService.SALT_ROUNDS,
      );
    }

    if (dto.totpSecret !== undefined) {
      existingUser.totpSecret = dto.totpSecret;
    }

    if (dto.refreshToken !== undefined) {
      existingUser.refreshToken = dto.refreshToken;
    }

    if (dto.passwordResetToken !== undefined) {
      existingUser.passwordResetToken = dto.passwordResetToken;
    }

    if (dto.passwordResetExpires !== undefined) {
      existingUser.passwordResetExpires = dto.passwordResetExpires
        ? new Date(dto.passwordResetExpires)
        : null;
    }

    if (dto.passwordResetMethod !== undefined) {
      existingUser.passwordResetMethod = dto.passwordResetMethod;
    }

    if (dto.passwordResetAttempts !== undefined) {
      existingUser.passwordResetAttempts = dto.passwordResetAttempts;
    }

    await this.usersRepository.save(existingUser);

    // We should return all fields in Admin Settings, so we shouldn't use findSafeById
    const updatedUser = await this.usersRepository.findOne({
      where: { userId },
      select: {
        userId: true,
        username: true,
        email: true,
        password: true,
        firstName: true,
        lastName: true,
        country: true,
        dateOfBirth: true,
        role: true,
        isEmailVerified: true,
        totpSecret: true,
        isTotpEnabled: true,
        refreshToken: true,
        passwordResetToken: true,
        passwordResetExpires: true,
        passwordResetMethod: true,
        passwordResetAttempts: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!updatedUser) {
      throw new NotFoundException('User not found');
    }

    return updatedUser;
  }

  async remove(userId: string): Promise<void> {
    const user = await this.findById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.usersRepository.remove(user);
  }

  async setRefreshToken(
    userId: string,
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

  async clearRefreshToken(userId: string): Promise<void> {
    await this.usersRepository.update(userId, {
      refreshToken: null,
    });
  }

  async storePasswordResetToken(
    userId: string,
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

  async incrementPasswordResetAttempts(userId: string): Promise<void> {
    const user = await this.findById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.usersRepository.update(userId, {
      passwordResetAttempts: (user.passwordResetAttempts ?? 0) + 1,
    });
  }

  async clearPasswordResetState(userId: string): Promise<void> {
    await this.usersRepository.update(userId, {
      passwordResetToken: null,
      passwordResetExpires: null,
      passwordResetMethod: null,
      passwordResetAttempts: 0,
    });
  }

  sanitizeUser(
    user: User,
  ): Omit<
    User,
    | 'password'
    | 'refreshToken'
    | 'totpSecret'
    | 'passwordResetToken'
    | 'passwordResetExpires'
    | 'passwordResetMethod'
    | 'passwordResetAttempts'
  > {
    type SensitiveUserFields =
      | 'password'
      | 'refreshToken'
      | 'totpSecret'
      | 'passwordResetToken'
      | 'passwordResetExpires'
      | 'passwordResetMethod'
      | 'passwordResetAttempts';

    type SanitizedUser = Omit<User, SensitiveUserFields>;
    type MutableUser = SanitizedUser & Partial<Pick<User, SensitiveUserFields>>;

    const safeUser: MutableUser = { ...user };
    delete safeUser.password;
    delete safeUser.refreshToken;
    delete safeUser.totpSecret;
    delete safeUser.passwordResetToken;
    delete safeUser.passwordResetExpires;
    delete safeUser.passwordResetMethod;
    delete safeUser.passwordResetAttempts;

    return safeUser;
  }

  private async ensureEmailAvailable(email: string): Promise<void> {
    const existingUser = await this.findByEmail(email);

    if (existingUser) {
      throw new ConflictException('Email already registered');
    }
  }

  private async ensureUsernameAvailable(username: string): Promise<void> {
    const existingUser = await this.findByUsername(username);

    if (existingUser) {
      throw new ConflictException('Username already taken');
    }
  }

  private normalizeEmail(email: string): string {
    const normalized = email.trim().toLowerCase();

    if (!normalized) {
      throw new BadRequestException('Email is required');
    }

    return normalized;
  }

  private normalizeUsername(username: string): string {
    const normalized = username.trim().toLowerCase();

    if (!normalized) {
      throw new BadRequestException('Username is required');
    }

    return normalized;
  }

  private normalizeRequiredString(value: string, fieldName: string): string {
    const normalized = value.trim();

    if (!normalized) {
      throw new BadRequestException(`${fieldName} is required`);
    }

    return normalized;
  }

  private normalizeOptionalString(value?: string): string | undefined {
    if (value === undefined || value === null) {
      return undefined;
    }

    return value.trim();
  }

  private parseDateOfBirth(value: string): string {
    const parsed = new Date(value);

    if (Number.isNaN(parsed.getTime())) {
      throw new BadRequestException('Invalid dateOfBirth');
    }

    if (parsed > new Date()) {
      throw new BadRequestException('dateOfBirth cannot be in the future');
    }

    // Convert valid Date back to string YYYY-MM-DD
    return parsed.toISOString().split('T')[0];
  }
}
