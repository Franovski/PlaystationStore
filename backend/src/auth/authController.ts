import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './authService';
import { RegisterDto } from './dto/register';
import { LoginDto } from './dto/login';
import { ResetPasswordDto } from './dto/resetPassword';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDto) {
    const user = await this.authService.validateUser(dto.email, dto.password);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.authService.login(user);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refreshTokens(
    @Body('userId') userId: number,
    @Body('refreshToken') refreshToken: string,
  ) {
    return this.authService.refreshTokens(Number(userId), refreshToken);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async logout(@Req() req: any) {
    return this.authService.logout(req.user.userId);
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  async forgotPassword(@Body('email') email: string) {
    return this.authService.forgotPassword(email);
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto);
  }

  @Post('totp/generate')
  @UseGuards(JwtAuthGuard)
  async generateTotpSecret(@Req() req: any) {
    return this.authService.generateTotpSecret(req.user.userId);
  }

  @Post('totp/enable')
  @UseGuards(JwtAuthGuard)
  async enableTotp(@Req() req: any, @Body('code') code: string) {
    return this.authService.enableTotp(req.user.userId, code);
  }

  @Post('totp/verify')
  @HttpCode(HttpStatus.OK)
  async verifyTotpAndLogin(
    @Body('tempToken') tempToken: string,
    @Body('code') code: string,
  ) {
    return this.authService.verifyTotpAndLogin(tempToken, code);
  }

  @Post('totp/disable')
  @UseGuards(JwtAuthGuard)
  async disableTotp(@Req() req: any) {
    return this.authService.disableTotp(req.user.userId);
  }
}