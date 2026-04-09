"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const authService_1 = require("./authService");
const authController_1 = require("./authController");
const userModule_1 = require("../users/userModule");
const mailModule_1 = require("../mail/mailModule");
const reset_password_service_1 = require("./resetPassword/reset-password.service");
const reset_password_otp_service_1 = require("./resetPassword/reset-password-otp.service");
const reset_password_link_service_1 = require("./resetPassword/reset-password-link.service");
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            userModule_1.UsersModule,
            mailModule_1.MailModule,
            config_1.ConfigModule,
            jwt_1.JwtModule.registerAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: async (configService) => {
                    const secret = configService.get("JWT_ACCESS_SECRET");
                    console.log("JWT_ACCESS_SECRET:", secret);
                    if (!secret) {
                        throw new Error("JWT_ACCESS_SECRET is missing in .env");
                    }
                    return {
                        secret,
                        signOptions: {
                            expiresIn: "15m",
                        },
                    };
                },
            }),
        ],
        controllers: [authController_1.AuthController],
        providers: [
            authService_1.AuthService,
            reset_password_service_1.PasswordResetService,
            reset_password_otp_service_1.PasswordResetOtpService,
            reset_password_link_service_1.PasswordResetLinkService,
        ],
        exports: [authService_1.AuthService, jwt_1.JwtModule],
    })
], AuthModule);
//# sourceMappingURL=authModule.js.map