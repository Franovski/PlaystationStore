import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthResolver } from './authResolver';
import { AuthService } from './authService';
import { JwtStrategy } from './jwt.strategy';
import { MailModule } from '../mail/mailModule';
import { UsersModule } from '../users/userModule';
import { PasswordResetLinkService } from './resetPassword/reset-password-link.service';
import { PasswordResetOtpService } from './resetPassword/reset-password-otp.service';
import { PasswordResetService } from './resetPassword/reset-password.service';

@Module({
  imports: [
    UsersModule,
    MailModule,
    ConfigModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const secret = configService.get<string>('JWT_ACCESS_SECRET');

        if (!secret) {
          throw new Error('JWT_ACCESS_SECRET is missing in .env');
        }

        return {
          secret,
          signOptions: {
            expiresIn: '15m',
          },
        };
      },
    }),
  ],
  providers: [
    AuthService,
    AuthResolver,
    PasswordResetService,
    PasswordResetOtpService,
    PasswordResetLinkService,
    JwtStrategy,
  ],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
