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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const bcrypt = require("bcryptjs");
const otplib_1 = require("otplib");
const QRCode = require("qrcode");
const userService_1 = require("../users/userService");
const reset_password_service_1 = require("./resetPassword/reset-password.service");
let AuthService = class AuthService {
    constructor(usersService, passwordResetService, jwtService, configService) {
        this.usersService = usersService;
        this.passwordResetService = passwordResetService;
        this.jwtService = jwtService;
        this.configService = configService;
    }
    async validateUser(email, password) {
        const user = await this.usersService.findByEmail(email);
        if (!user || !user.password) {
            return null;
        }
        const valid = await bcrypt.compare(password, user.password);
        return valid ? user : null;
    }
    async register(dto) {
        const user = await this.usersService.create(dto);
        const tokens = await this.generateTokens(user);
        await this.usersService.setRefreshToken(user.userId, tokens.refreshToken);
        return {
            user: this.sanitizeUser(user),
            ...tokens,
        };
    }
    async login(user) {
        if (user.isTotpEnabled) {
            const tempToken = this.jwtService.sign({ sub: user.userId, requiresTwoFactor: true }, {
                secret: this.configService.get('JWT_ACCESS_SECRET'),
                expiresIn: '5m',
            });
            return {
                requiresTwoFactor: true,
                tempToken,
            };
        }
        const tokens = await this.generateTokens(user);
        await this.usersService.setRefreshToken(user.userId, tokens.refreshToken);
        return {
            user: this.sanitizeUser(user),
            ...tokens,
        };
    }
    async refreshTokens(userId, refreshToken) {
        const user = await this.usersService.findById(userId);
        if (!user || !user.refreshToken) {
            throw new common_1.UnauthorizedException();
        }
        const valid = await bcrypt.compare(refreshToken, user.refreshToken);
        if (!valid) {
            throw new common_1.UnauthorizedException();
        }
        const tokens = await this.generateTokens(user);
        await this.usersService.setRefreshToken(user.userId, tokens.refreshToken);
        return {
            user: this.sanitizeUser(user),
            ...tokens,
        };
    }
    decodeRefreshToken(token) {
        try {
            return this.jwtService.verify(token, {
                secret: this.configService.get('JWT_REFRESH_SECRET'),
            });
        }
        catch {
            throw new common_1.UnauthorizedException('Invalid refresh token');
        }
    }
    async logout(userId) {
        await this.usersService.setRefreshToken(userId, null);
        return { message: 'Logged out' };
    }
    async forgotPassword(email) {
        return this.passwordResetService.forgotPassword(email);
    }
    async resetPassword(dto) {
        return this.passwordResetService.resetPassword(dto);
    }
    async generateTotpSecret(userId) {
        const user = await this.usersService.findById(userId);
        if (!user) {
            throw new common_1.UnauthorizedException();
        }
        const secret = otplib_1.authenticator.generateSecret();
        await this.usersService.update(userId, { totpSecret: secret });
        const otpauthUrl = otplib_1.authenticator.keyuri(user.email, 'PlayStationStore', secret);
        const qrCode = await QRCode.toDataURL(otpauthUrl);
        return { secret, qrCode };
    }
    async enableTotp(userId, code) {
        const user = await this.usersService.findById(userId);
        if (!user || !user.totpSecret) {
            throw new common_1.BadRequestException('TOTP not set up');
        }
        const valid = otplib_1.authenticator.verify({
            token: code,
            secret: user.totpSecret,
        });
        if (!valid) {
            throw new common_1.BadRequestException('Invalid TOTP code');
        }
        await this.usersService.update(userId, { isTotpEnabled: true });
        return { message: 'Two-factor authentication enabled' };
    }
    async verifyTotpAndLogin(tempToken, code) {
        let payload;
        try {
            payload = this.jwtService.verify(tempToken, {
                secret: this.configService.get('JWT_ACCESS_SECRET'),
            });
        }
        catch {
            throw new common_1.UnauthorizedException('Invalid or expired token');
        }
        if (!payload.requiresTwoFactor) {
            throw new common_1.BadRequestException('Token is not a 2FA token');
        }
        const user = await this.usersService.findById(payload.sub);
        if (!user || !user.totpSecret) {
            throw new common_1.UnauthorizedException();
        }
        const valid = otplib_1.authenticator.verify({
            token: code,
            secret: user.totpSecret,
        });
        if (!valid) {
            throw new common_1.UnauthorizedException('Invalid TOTP code');
        }
        const tokens = await this.generateTokens(user);
        await this.usersService.setRefreshToken(user.userId, tokens.refreshToken);
        return {
            user: this.sanitizeUser(user),
            ...tokens,
        };
    }
    async disableTotp(userId) {
        await this.usersService.update(userId, {
            isTotpEnabled: false,
            totpSecret: null,
        });
        return { message: 'Two-factor authentication disabled' };
    }
    async generateTokens(user) {
        const payload = {
            sub: user.userId,
            email: user.email,
            role: user.role,
        };
        const accessSecret = this.configService.get('JWT_ACCESS_SECRET');
        const refreshSecret = this.configService.get('JWT_REFRESH_SECRET');
        const accessExpiration = this.configService.get('JWT_ACCESS_EXPIRATION')?.trim() || '15m';
        const refreshExpiration = this.configService.get('JWT_REFRESH_EXPIRATION')?.trim() || '7d';
        console.log('JWT_ACCESS_EXPIRATION =', accessExpiration);
        console.log('JWT_REFRESH_EXPIRATION =', refreshExpiration);
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(payload, {
                secret: accessSecret,
                expiresIn: accessExpiration,
            }),
            this.jwtService.signAsync(payload, {
                secret: refreshSecret,
                expiresIn: refreshExpiration,
            }),
        ]);
        return { accessToken, refreshToken };
    }
    sanitizeUser(user) {
        const { password, refreshToken, totpSecret, passwordResetToken, passwordResetExpires, passwordResetMethod, passwordResetAttempts, ...safe } = user;
        return safe;
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [userService_1.UsersService,
        reset_password_service_1.PasswordResetService,
        jwt_1.JwtService,
        config_1.ConfigService])
], AuthService);
//# sourceMappingURL=authService.js.map