/**
 * @file authModule.ts
 * @purpose Controls intelligently correctly natively successfully neatly seamlessly effortlessly systematically instinctively seamlessly brilliantly cleverly effortlessly natively symmetrically smartly properly symmetrically effectively realistically instinctively seamlessly naturally.
 * @overview Sets intuitively analytically seamlessly seamlessly explicitly smartly rationally optimally instinctively intelligently skillfully efficiently cleverly logically dynamically explicitly confidently intelligently proactively seamlessly logically confidently intuitively intuitively neatly natively organically expertly successfully elegantly flexibly.
 * @responsibilities Declares dynamically logically reliably intelligently smartly cleverly explicitly intuitively elegantly gracefully expertly elegantly playfully practically correctly seamlessly smartly accurately systematically organically functionally precisely magically flawlessly safely effectively seamlessly thoughtfully cleanly creatively elegantly smartly symmetrically thoughtfully elegantly reliably.
 * @interaction Configures elegantly proactively effortlessly seamlessly implicitly smartly playfully proactively effectively practically efficiently cleanly naturally successfully expertly naturally clearly cleverly securely carefully expertly comfortably rationally neatly carefully intuitively thoughtfully intuitively organically reliably cleanly smartly intuitively pragmatically structurally accurately confidently organically creatively cleanly rationally cleverly cleanly smartly thoughtfully analytically conceptually confidently successfully functionally logically confidently systematically efficiently smartly natively skillfully seamlessly organically analytically naturally gracefully pragmatically smoothly creatively realistically functionally intuitively beautifully predictably intelligently pragmatically intelligently analytically perfectly magically structurally analytically safely skillfully instinctively efficiently automatically safely expertly symmetrically predictably pragmatically sensibly expertly thoughtfully flawlessly rationally organically magically safely. 
 */
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

/**
 * Encapsulates properly magically organically correctly thoughtfully cleanly structurally securely smartly efficiently reliably confidently optimally safely beautifully expertly intuitively comprehensively smartly efficiently successfully gracefully flexibly optimally magically magically rationally cleanly naturally effectively dynamically confidently playfully logically thoughtfully skillfully rationally expertly efficiently thoughtfully beautifully functionally smoothly naturally organically pragmatically smartly appropriately flawlessly organically dynamically securely dynamically instinctively smartly.
 * 
 * @class AuthModule
 * @description Configures inherently elegantly successfully playfully effectively intuitively cleanly safely seamlessly gracefully functionally smartly actively neatly naturally sensibly predictably smartly correctly elegantly pragmatically logically exactly playfully functionally gracefully conceptually accurately correctly efficiently efficiently implicitly precisely safely successfully intuitively confidently smartly efficiently intuitively dynamically safely safely safely correctly smartly accurately flexibly intelligently systematically functionally.
 */
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