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
var AuthService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const bcrypt = require("bcryptjs");
const otplib_1 = require("otplib");
const QRCode = require("qrcode");
const userService_1 = require("../users/userService");
const mailService_1 = require("../mail/mailService");
const reset_password_service_1 = require("./resetPassword/reset-password.service");
let AuthService = AuthService_1 = class AuthService {
    constructor(usersService, passwordResetService, jwtService, configService, mailService) {
        this.usersService = usersService;
        this.passwordResetService = passwordResetService;
        this.jwtService = jwtService;
        this.configService = configService;
        this.mailService = mailService;
        this.pendingLoginOtps = new Map();
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
        if (dto.role === 'admin' &&
            (process.env.NODE_ENV !== 'development' ||
                process.env.ENABLE_DEV_ADMIN_SIGNUP !== 'true')) {
            dto.role = 'playstation_user';
        }
        const user = await this.usersService.create(dto);
        const tokens = await this.generateTokens(user);
        await this.usersService.setRefreshToken(user.userId, tokens.refreshToken);
        return {
            user: this.sanitizeUser(user),
            ...tokens,
        };
    }
    async login(user) {
        const tempToken = this.jwtService.sign({
            sub: user.userId,
            requiresTwoFactor: true,
            otpMethod: user.isTotpEnabled ? 'totp' : 'email-otp',
        }, {
            secret: this.configService.get('JWT_ACCESS_SECRET'),
            expiresIn: '5m',
        });
        if (user.isTotpEnabled) {
            return {
                requiresTwoFactor: true,
                tempToken,
                otpMethod: 'totp',
            };
        }
        const loginCode = this.generateNumericOtp();
        this.storePendingLoginOtp(tempToken, user.userId, loginCode);
        try {
            await this.sendLoginOtp(user.email, loginCode);
        }
        catch (error) {
            throw new common_1.BadRequestException('Failed to send verification code. Please try again.');
        }
        return {
            requiresTwoFactor: true,
            tempToken,
            otpMethod: 'email-otp',
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
        if (!user) {
            throw new common_1.UnauthorizedException();
        }
        const normalizedCode = code.trim();
        const isEmailOtpFlow = payload.otpMethod === 'email-otp' || this.pendingLoginOtps.has(tempToken);
        if (isEmailOtpFlow) {
            this.verifyPendingLoginOtp(tempToken, user.userId, normalizedCode);
        }
        else {
            if (!user.totpSecret) {
                throw new common_1.UnauthorizedException();
            }
            const valid = otplib_1.authenticator.verify({
                token: normalizedCode,
                secret: user.totpSecret,
            });
            if (!valid) {
                throw new common_1.UnauthorizedException('Invalid TOTP code');
            }
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
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(payload, {
                secret: this.configService.get('JWT_ACCESS_SECRET'),
                expiresIn: this.configService.get('JWT_ACCESS_EXPIRATION', '15m'),
            }),
            this.jwtService.signAsync(payload, {
                secret: this.configService.get('JWT_REFRESH_SECRET'),
                expiresIn: this.configService.get('JWT_REFRESH_EXPIRATION', '7d'),
            }),
        ]);
        return { accessToken, refreshToken };
    }
    sanitizeUser(user) {
        const { password, refreshToken, totpSecret, passwordResetToken, passwordResetExpires, passwordResetMethod, passwordResetAttempts, ...safe } = user;
        return safe;
    }
    storePendingLoginOtp(tempToken, userId, code) {
        const expiresAt = Date.now() + AuthService_1.LOGIN_OTP_TTL_MINUTES * 60000;
        this.pendingLoginOtps.set(tempToken, {
            userId,
            code,
            expiresAt,
        });
        this.cleanupExpiredPendingOtps();
    }
    verifyPendingLoginOtp(tempToken, userId, code) {
        const pending = this.pendingLoginOtps.get(tempToken);
        if (!pending || pending.userId !== userId) {
            throw new common_1.UnauthorizedException('Invalid or expired login verification session');
        }
        if (Date.now() > pending.expiresAt) {
            this.pendingLoginOtps.delete(tempToken);
            throw new common_1.UnauthorizedException('Login verification code expired');
        }
        if (pending.code !== code) {
            throw new common_1.UnauthorizedException('Invalid login verification code');
        }
        this.pendingLoginOtps.delete(tempToken);
    }
    cleanupExpiredPendingOtps() {
        const now = Date.now();
        for (const [token, pending] of this.pendingLoginOtps.entries()) {
            if (now > pending.expiresAt) {
                this.pendingLoginOtps.delete(token);
            }
        }
    }
    generateNumericOtp() {
        return String(Math.floor(100000 + Math.random() * 900000));
    }
    async sendLoginOtp(email, code) {
        try {
            await this.mailService.sendLoginOtpEmail({
                to: email,
                loginCode: code,
                expiresInMinutes: AuthService_1.LOGIN_OTP_TTL_MINUTES,
            });
        }
        catch (error) {
            throw new common_1.BadRequestException('Failed to send verification code. Please try again.');
        }
    }
};
exports.AuthService = AuthService;
AuthService.LOGIN_OTP_TTL_MINUTES = 5;
exports.AuthService = AuthService = AuthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [userService_1.UsersService,
        reset_password_service_1.PasswordResetService,
        jwt_1.JwtService,
        config_1.ConfigService,
        mailService_1.MailService])
], AuthService);
//# sourceMappingURL=authService.js.map