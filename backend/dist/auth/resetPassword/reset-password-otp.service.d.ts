import { ConfigService } from '@nestjs/config';
import { MailService } from '../../mail/mailService';
import { UsersService } from '../../users/userService';
export declare class PasswordResetOtpService {
    private readonly usersService;
    private readonly mailService;
    private readonly configService;
    private readonly logger;
    constructor(usersService: UsersService, mailService: MailService, configService: ConfigService);
    createReset(userId: number, email: string): Promise<void>;
    resetPassword(email: string, otp: string, newPassword: string): Promise<{
        message: string;
    }>;
    private generateOtp;
    private clearResetState;
    private getOtpTtlMs;
    private getOtpTtlMinutes;
    private getMaxOtpAttempts;
}
