"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PasswordResetModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const mailModule_1 = require("../../mail/mailModule");
const userModule_1 = require("../../users/userModule");
const reset_password_link_service_1 = require("./reset-password-link.service");
const reset_password_otp_service_1 = require("./reset-password-otp.service");
const reset_password_service_1 = require("./reset-password.service");
let PasswordResetModule = class PasswordResetModule {
};
exports.PasswordResetModule = PasswordResetModule;
exports.PasswordResetModule = PasswordResetModule = __decorate([
    (0, common_1.Module)({
        imports: [config_1.ConfigModule, userModule_1.UsersModule, mailModule_1.MailModule],
        providers: [
            reset_password_service_1.PasswordResetService,
            reset_password_otp_service_1.PasswordResetOtpService,
            reset_password_link_service_1.PasswordResetLinkService,
        ],
        exports: [reset_password_service_1.PasswordResetService],
    })
], PasswordResetModule);
//# sourceMappingURL=reset-password.module.js.map