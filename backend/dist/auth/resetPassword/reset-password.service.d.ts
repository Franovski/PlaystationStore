import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../users/userService';
import { ResetPasswordDto } from '../dto/resetPassword';
import { PasswordResetMode, PasswordResetRequestResult } from './reset-password.types';
import { PasswordResetLinkService } from './reset-password-link.service';
import { PasswordResetOtpService } from './reset-password-otp.service';
export declare class PasswordResetService {
    private readonly usersService;
    private readonly otpService;
    private readonly linkService;
    private readonly configService;
    constructor(usersService: UsersService, otpService: PasswordResetOtpService, linkService: PasswordResetLinkService, configService: ConfigService);
    forgotPassword(email: string): Promise<PasswordResetRequestResult>;
    resetPassword(dto: ResetPasswordDto): Promise<{
        message: string;
    }>;
    getResetMode(): PasswordResetMode;
}
