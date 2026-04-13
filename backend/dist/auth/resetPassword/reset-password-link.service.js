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
var PasswordResetLinkService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PasswordResetLinkService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const crypto = require("crypto");
const mailService_1 = require("../../mail/mailService");
const userEntity_1 = require("../../users/userEntity");
const userService_1 = require("../../users/userService");
let PasswordResetLinkService = PasswordResetLinkService_1 = class PasswordResetLinkService {
    constructor(usersService, mailService, configService) {
        this.usersService = usersService;
        this.mailService = mailService;
        this.configService = configService;
        this.logger = new common_1.Logger(PasswordResetLinkService_1.name);
    }
    async createReset(userId, email) {
        const resetToken = crypto.randomBytes(32).toString('base64url');
        const hashedResetToken = this.hashResetToken(resetToken);
        await this.usersService.update(userId, {
            passwordResetToken: hashedResetToken,
            passwordResetExpires: new Date(Date.now() + this.getResetTokenTtlMs()),
            passwordResetMethod: userEntity_1.PasswordResetMethod.LINK,
            passwordResetAttempts: 0,
        });
        try {
            await this.mailService.sendPasswordResetLinkEmail({
                to: email,
                resetToken,
            });
        }
        catch (error) {
            this.logger.error('Failed to send password reset link email.');
            throw new common_1.InternalServerErrorException('Unable to process password reset request.');
        }
    }
    async resetPassword(resetToken, newPassword) {
        const user = await this.usersService.findByResetToken(this.hashResetToken(resetToken), userEntity_1.PasswordResetMethod.LINK);
        if (!user ||
            !user.passwordResetExpires ||
            user.passwordResetExpires.getTime() <= Date.now()) {
            if (user) {
                await this.clearResetState(user.userId);
            }
            throw new common_1.BadRequestException('Invalid or expired reset token');
        }
        await this.usersService.update(user.userId, {
            password: newPassword,
            refreshToken: null,
            passwordResetToken: null,
            passwordResetExpires: null,
            passwordResetMethod: null,
            passwordResetAttempts: 0,
        });
        return { message: 'Password reset successful' };
    }
    hashResetToken(token) {
        return crypto.createHash('sha256').update(token).digest('hex');
    }
    async clearResetState(userId) {
        await this.usersService.update(userId, {
            passwordResetToken: null,
            passwordResetExpires: null,
            passwordResetMethod: null,
            passwordResetAttempts: 0,
        });
    }
    getResetTokenTtlMs() {
        const ttlMinutes = Number(this.configService.get('PASSWORD_RESET_TOKEN_TTL_MINUTES', '60'));
        return Number.isFinite(ttlMinutes) && ttlMinutes > 0
            ? ttlMinutes * 60000
            : 60 * 60000;
    }
};
exports.PasswordResetLinkService = PasswordResetLinkService;
exports.PasswordResetLinkService = PasswordResetLinkService = PasswordResetLinkService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [userService_1.UsersService,
        mailService_1.MailService,
        config_1.ConfigService])
], PasswordResetLinkService);
//# sourceMappingURL=reset-password-link.service.js.map