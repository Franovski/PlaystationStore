import { ConfigService } from '@nestjs/config';
import { MailService } from '../../mail/mailService';
import { UsersService } from '../../users/userService';
export declare class PasswordResetLinkService {
    private readonly usersService;
    private readonly mailService;
    private readonly configService;
    private readonly logger;
    constructor(usersService: UsersService, mailService: MailService, configService: ConfigService);
    createReset(userId: number, email: string): Promise<void>;
    resetPassword(resetToken: string, newPassword: string): Promise<{
        message: string;
    }>;
    private hashResetToken;
    private clearResetState;
    private getResetTokenTtlMs;
}
