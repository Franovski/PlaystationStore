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
exports.PasswordResetService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const userService_1 = require("../../users/userService");
const reset_password_types_1 = require("./reset-password.types");
const reset_password_link_service_1 = require("./reset-password-link.service");
const reset_password_otp_service_1 = require("./reset-password-otp.service");
let PasswordResetService = class PasswordResetService {
    constructor(usersService, otpService, linkService, configService) {
        this.usersService = usersService;
        this.otpService = otpService;
        this.linkService = linkService;
        this.configService = configService;
    }
    async forgotPassword(email) {
        const mode = this.getResetMode();
        const response = {
            message: reset_password_types_1.PASSWORD_RESET_REQUEST_MESSAGE,
            mode,
        };
        const user = await this.usersService.findByEmail(email);
        if (!user) {
            return response;
        }
        if (mode === 'otp') {
            await this.otpService.createReset(user.userId, user.email);
            return response;
        }
        await this.linkService.createReset(user.userId, user.email);
        return response;
    }
    async resetPassword(dto) {
        if (this.getResetMode() === 'otp') {
            if (!dto.email) {
                throw new common_1.BadRequestException('Email is required for OTP password reset');
            }
            return this.otpService.resetPassword(dto.email, dto.token, dto.newPassword);
        }
        return this.linkService.resetPassword(dto.token, dto.newPassword);
    }
    getResetMode() {
        const configuredMode = this.configService
            .get('PASSWORD_RESET_MODE')
            ?.toLowerCase();
        if (configuredMode === 'otp' || configuredMode === 'link') {
            return configuredMode;
        }
        return this.configService.get('NODE_ENV') === 'production'
            ? 'link'
            : 'otp';
    }
};
exports.PasswordResetService = PasswordResetService;
exports.PasswordResetService = PasswordResetService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [userService_1.UsersService,
        reset_password_otp_service_1.PasswordResetOtpService,
        reset_password_link_service_1.PasswordResetLinkService,
        config_1.ConfigService])
], PasswordResetService);
//# sourceMappingURL=reset-password.service.js.map