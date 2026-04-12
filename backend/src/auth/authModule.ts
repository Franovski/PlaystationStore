import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { ConfigModule, ConfigService } from "@nestjs/config";

import { AuthService } from "./authService";
import { AuthController } from "./authController";
import { UsersModule } from "../users/userModule";
import { MailModule } from "../mail/mailModule";
import { PasswordResetService } from "./resetPassword/reset-password.service";
import { PasswordResetOtpService } from "./resetPassword/reset-password-otp.service";
import { PasswordResetLinkService } from "./resetPassword/reset-password-link.service";
import { JwtStrategy } from "./jwt.strategy";

@Module({
  imports: [
    UsersModule,
    MailModule,
    ConfigModule,
    PassportModule,

    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const secret = configService.get<string>("JWT_ACCESS_SECRET");

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
  controllers: [AuthController],
  providers: [
    AuthService,
    PasswordResetService,
    PasswordResetOtpService,
    PasswordResetLinkService,
    JwtStrategy,
  ],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}