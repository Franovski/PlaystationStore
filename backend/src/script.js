
const fs = require("fs");
const authController = `
import { Controller, Post, Body, HttpCode, HttpStatus, UseGuards, Req, UnauthorizedException } from "@nestjs/common";
import { AuthService } from "./authService";
import { RegisterDto } from "./dto/register";
import { LoginDto } from "./dto/login";
import { ResetPasswordDto } from "./dto/resetPassword";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post("login")
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDto) {
    const user = await this.authService.validateUser(dto.email, dto.password);
    if (!user) {
      throw new UnauthorizedException("Invalid credentials");
    }
    return this.authService.login(user);
  }

  @Post("refresh")
  @HttpCode(HttpStatus.OK)
  async refreshTokens(
    @Body("userId") userId: string,
    @Body("refreshToken") refreshToken: string,
  ) {
    return this.authService.refreshTokens(userId, refreshToken);
  }

  @Post("logout")
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async logout(@Req() req: any) {
    return this.authService.logout(req.user.sub);
  }

  @Post("forgot-password")
  @HttpCode(HttpStatus.OK)
  async forgotPassword(@Body("email") email: string) {
    return this.authService.forgotPassword(email);
  }

  @Post("reset-password")
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto);
  }

  @Post("totp/generate")
  @UseGuards(JwtAuthGuard)
  async generateTotpSecret(@Req() req: any) {
    return this.authService.generateTotpSecret(req.user.sub);
  }

  @Post("totp/enable")
  @UseGuards(JwtAuthGuard)
  async enableTotp(@Req() req: any, @Body("code") code: string) {
    return this.authService.enableTotp(req.user.sub, code);
  }

  @Post("totp/verify")
  @HttpCode(HttpStatus.OK)
  async verifyTotpAndLogin(
    @Body("tempToken") tempToken: string,
    @Body("code") code: string,
  ) {
    return this.authService.verifyTotpAndLogin(tempToken, code);
  }

  @Post("totp/disable")
  @UseGuards(JwtAuthGuard)
  async disableTotp(@Req() req: any) {
    return this.authService.disableTotp(req.user.sub);
  }
}
`;

const authModule = `
import { Module } from "@nestjs/common";
import { AuthService } from "./authService";
import { AuthController } from "./authController";
import { UsersModule } from "../users/userModule";
import { MailModule } from "../mail/mailModule";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { PasswordResetService } from "./resetPassword/reset-password.service";
import { PasswordResetOtpService } from "./resetPassword/reset-password-otp.service";
import { PasswordResetLinkService } from "./resetPassword/reset-password-link.service";

@Module({
  imports: [
    UsersModule,
    MailModule,
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>("JWT_ACCESS_SECRET"),
        signOptions: { expiresIn: "15m" },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService, 
    PasswordResetService,
    PasswordResetOtpService,
    PasswordResetLinkService
  ],
  exports: [AuthService],
})
export class AuthModule {}
`;

fs.writeFileSync("c:/Users/georg/OneDrive/Desktop/PlaystationStoreProject/backend/src/auth/authController.ts", authController);
fs.writeFileSync("c:/Users/georg/OneDrive/Desktop/PlaystationStoreProject/backend/src/auth/authModule.ts", authModule);

