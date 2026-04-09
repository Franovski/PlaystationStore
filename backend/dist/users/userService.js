"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var UsersService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bcrypt = require("bcryptjs");
const userEntity_1 = require("./userEntity");
let UsersService = UsersService_1 = class UsersService {
    constructor(usersRepository) {
        this.usersRepository = usersRepository;
    }
    async create(dto) {
        const email = this.normalizeEmail(dto.email);
        const username = this.normalizeUsername(dto.username);
        const firstName = this.normalizeOptionalString(dto.firstName) ?? '';
        const lastName = this.normalizeOptionalString(dto.lastName) ?? '';
        const country = this.normalizeRequiredString(dto.country, 'country');
        const dateOfBirth = this.parseDateOfBirth(dto.dateOfBirth);
        await this.ensureEmailAvailable(email);
        await this.ensureUsernameAvailable(username);
        if (!dto.password || !dto.password.trim()) {
            throw new common_1.BadRequestException('Password is required');
        }
        const hashedPassword = await bcrypt.hash(dto.password, UsersService_1.SALT_ROUNDS);
        const user = this.usersRepository.create({
            username,
            email,
            password: hashedPassword,
            firstName,
            lastName,
            country,
            dateOfBirth,
            role: dto.role ?? userEntity_1.UserRole.PLAYSTATION_USER,
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
    async createPublicUser(dto) {
        const email = this.normalizeEmail(dto.email);
        const username = this.normalizeUsername(dto.username);
        const firstName = this.normalizeOptionalString(dto.firstName) ?? '';
        const lastName = this.normalizeOptionalString(dto.lastName) ?? '';
        const country = this.normalizeRequiredString(dto.country, 'country');
        const dateOfBirth = this.parseDateOfBirth(dto.dateOfBirth);
        await this.ensureEmailAvailable(email);
        await this.ensureUsernameAvailable(username);
        if (!dto.password || !dto.password.trim()) {
            throw new common_1.BadRequestException('Password is required');
        }
        const hashedPassword = await bcrypt.hash(dto.password, UsersService_1.SALT_ROUNDS);
        const user = this.usersRepository.create({
            username,
            email,
            password: hashedPassword,
            firstName,
            lastName,
            country,
            dateOfBirth,
            role: userEntity_1.UserRole.PLAYSTATION_USER,
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
    async findAll() {
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
    async findById(userId) {
        return this.usersRepository.findOne({
            where: { userId },
        });
    }
    async findSafeById(userId) {
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
    async findByEmail(email) {
        return this.usersRepository
            .createQueryBuilder('user')
            .where('LOWER(user.email) = LOWER(:email)', {
            email: email.trim(),
        })
            .getOne();
    }
    async findByUsername(username) {
        return this.usersRepository
            .createQueryBuilder('user')
            .where('LOWER(user.username) = LOWER(:username)', {
            username: username.trim(),
        })
            .getOne();
    }
    async findByResetToken(hashedToken, method) {
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
    async update(userId, dto, options) {
        const existingUser = await this.findById(userId);
        if (!existingUser) {
            throw new common_1.NotFoundException('User not found');
        }
        if (dto.email !== undefined) {
            const normalizedEmail = this.normalizeEmail(dto.email);
            const userWithSameEmail = await this.findByEmail(normalizedEmail);
            if (userWithSameEmail && userWithSameEmail.userId !== userId) {
                throw new common_1.ConflictException('Email already registered');
            }
            existingUser.email = normalizedEmail;
        }
        if (dto.username !== undefined) {
            const normalizedUsername = this.normalizeUsername(dto.username);
            const userWithSameUsername = await this.findByUsername(normalizedUsername);
            if (userWithSameUsername && userWithSameUsername.userId !== userId) {
                throw new common_1.ConflictException('Username already taken');
            }
            existingUser.username = normalizedUsername;
        }
        if (dto.password !== undefined) {
            if (dto.password !== null && !dto.password.trim()) {
                throw new common_1.BadRequestException('Password cannot be empty');
            }
            existingUser.password =
                dto.password === null
                    ? null
                    : await bcrypt.hash(dto.password, UsersService_1.SALT_ROUNDS);
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
                throw new common_1.BadRequestException('Role change is not allowed here');
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
    async remove(userId) {
        const user = await this.findById(userId);
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        await this.usersRepository.remove(user);
    }
    async setRefreshToken(userId, refreshToken) {
        const user = await this.findById(userId);
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const hashedToken = refreshToken
            ? await bcrypt.hash(refreshToken, UsersService_1.SALT_ROUNDS)
            : null;
        await this.usersRepository.update(userId, {
            refreshToken: hashedToken,
        });
    }
    async clearRefreshToken(userId) {
        await this.usersRepository.update(userId, {
            refreshToken: null,
        });
    }
    async storePasswordResetToken(userId, hashedToken, expiresAt, method) {
        await this.usersRepository.update(userId, {
            passwordResetToken: hashedToken,
            passwordResetExpires: expiresAt,
            passwordResetMethod: method,
            passwordResetAttempts: 0,
        });
    }
    async incrementPasswordResetAttempts(userId) {
        const user = await this.findById(userId);
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        await this.usersRepository.update(userId, {
            passwordResetAttempts: (user.passwordResetAttempts ?? 0) + 1,
        });
    }
    async clearPasswordResetState(userId) {
        await this.usersRepository.update(userId, {
            passwordResetToken: null,
            passwordResetExpires: null,
            passwordResetMethod: null,
            passwordResetAttempts: 0,
        });
    }
    sanitizeUser(user) {
        const { password, refreshToken, totpSecret, passwordResetToken, passwordResetExpires, passwordResetMethod, passwordResetAttempts, ...safeUser } = user;
        return safeUser;
    }
    async ensureEmailAvailable(email) {
        const existingUser = await this.findByEmail(email);
        if (existingUser) {
            throw new common_1.ConflictException('Email already registered');
        }
    }
    async ensureUsernameAvailable(username) {
        const existingUser = await this.findByUsername(username);
        if (existingUser) {
            throw new common_1.ConflictException('Username already taken');
        }
    }
    normalizeEmail(email) {
        const normalized = email.trim().toLowerCase();
        if (!normalized) {
            throw new common_1.BadRequestException('Email is required');
        }
        return normalized;
    }
    normalizeUsername(username) {
        const normalized = username.trim().toLowerCase();
        if (!normalized) {
            throw new common_1.BadRequestException('Username is required');
        }
        return normalized;
    }
    normalizeRequiredString(value, fieldName) {
        const normalized = value.trim();
        if (!normalized) {
            throw new common_1.BadRequestException(`${fieldName} is required`);
        }
        return normalized;
    }
    normalizeOptionalString(value) {
        if (value === undefined || value === null) {
            return undefined;
        }
        return value.trim();
    }
    parseDateOfBirth(value) {
        const parsed = new Date(value);
        if (Number.isNaN(parsed.getTime())) {
            throw new common_1.BadRequestException('Invalid dateOfBirth');
        }
        if (parsed > new Date()) {
            throw new common_1.BadRequestException('dateOfBirth cannot be in the future');
        }
        return parsed;
    }
};
exports.UsersService = UsersService;
UsersService.SALT_ROUNDS = 12;
exports.UsersService = UsersService = UsersService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(userEntity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UsersService);
//# sourceMappingURL=userService.js.map