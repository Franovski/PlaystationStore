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
var PasswordResetOtpService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PasswordResetOtpService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const bcrypt = require("bcryptjs");
const mailService_1 = require("../../mail/mailService");
const userEntity_1 = require("../../users/userEntity");
const userService_1 = require("../../users/userService");
let PasswordResetOtpService = PasswordResetOtpService_1 = class PasswordResetOtpService {
    constructor(usersService, mailService, configService) {
        this.usersService = usersService;
        this.mailService = mailService;
        this.configService = configService;
        this.logger = new common_1.Logger(PasswordResetOtpService_1.name);
    }
    async createReset(userId, email) {
        const otp = this.generateOtp();
        const hashedOtp = await bcrypt.hash(otp, 12);
        await this.usersService.update(userId, {
            passwordResetToken: hashedOtp,
            passwordResetExpires: new Date(Date.now() + this.getOtpTtlMs()),
            passwordResetMethod: userEntity_1.PasswordResetMethod.OTP,
            passwordResetAttempts: 0,
        });
        try {
            await this.mailService.sendPasswordResetOtpEmail({
                to: email,
                resetCode: otp,
                expiresInMinutes: this.getOtpTtlMinutes(),
            });
        }
        catch (error) {
            this.logger.error('Failed to send password reset OTP email.');
            throw new common_1.InternalServerErrorException('Unable to process password reset request.');
        }
    }
    async resetPassword(email, otp, newPassword) {
        const user = await this.usersService.findByEmail(email);
        if (!user) {
            throw new common_1.BadRequestException('Invalid reset request');
        }
        if (!user.passwordResetToken ||
            !user.passwordResetExpires ||
            user.passwordResetMethod !== userEntity_1.PasswordResetMethod.OTP) {
            throw new common_1.BadRequestException('Invalid or expired OTP');
        }
        if (user.passwordResetExpires.getTime() <= Date.now()) {
            await this.clearResetState(user.userId);
            throw new common_1.BadRequestException('Invalid or expired OTP');
        }
        const maxAttempts = this.getMaxOtpAttempts();
        if ((user.passwordResetAttempts ?? 0) >= maxAttempts) {
            await this.clearResetState(user.userId);
            throw new common_1.BadRequestException('Maximum OTP attempts exceeded');
        }
        const isValidOtp = await bcrypt.compare(otp, user.passwordResetToken);
        if (!isValidOtp) {
            await this.usersService.incrementPasswordResetAttempts(user.userId);
            const refreshedUser = await this.usersService.findById(user.userId);
            if (refreshedUser &&
                (refreshedUser.passwordResetAttempts ?? 0) >= maxAttempts) {
                await this.clearResetState(user.userId);
            }
            throw new common_1.BadRequestException('Invalid OTP');
        }
        const hashedPassword = await bcrypt.hash(newPassword, 12);
        await this.usersService.update(user.userId, {
            password: hashedPassword,
            refreshToken: null,
            passwordResetToken: null,
            passwordResetExpires: null,
            passwordResetMethod: null,
            passwordResetAttempts: 0,
        });
        return { message: 'Password reset successful' };
    }
    generateOtp() {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }
    async clearResetState(userId) {
        await this.usersService.update(userId, {
            passwordResetToken: null,
            passwordResetExpires: null,
            passwordResetMethod: null,
            passwordResetAttempts: 0,
        });
    }
    getOtpTtlMs() {
        const ttlMinutes = Number(this.configService.get('PASSWORD_RESET_OTP_TTL_MINUTES', '10'));
        return Number.isFinite(ttlMinutes) && ttlMinutes > 0
            ? ttlMinutes * 60000
            : 10 * 60000;
    }
    getOtpTtlMinutes() {
        const ttlMinutes = Number(this.configService.get('PASSWORD_RESET_OTP_TTL_MINUTES', '10'));
        return Number.isFinite(ttlMinutes) && ttlMinutes > 0 ? ttlMinutes : 10;
    }
    getMaxOtpAttempts() {
        const maxAttempts = Number(this.configService.get('PASSWORD_RESET_OTP_MAX_ATTEMPTS', '5'));
        return Number.isFinite(maxAttempts) && maxAttempts > 0
            ? maxAttempts
            : 5;
    }
};
exports.PasswordResetOtpService = PasswordResetOtpService;
exports.PasswordResetOtpService = PasswordResetOtpService = PasswordResetOtpService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [userService_1.UsersService,
        mailService_1.MailService,
        config_1.ConfigService])
], PasswordResetOtpService);
//# sourceMappingURL=reset-password-otp.service.js.map