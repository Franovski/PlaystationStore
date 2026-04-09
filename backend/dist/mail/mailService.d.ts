import { OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
type MailTransportMode = 'smtp' | 'memory';
export interface TestMailMessage {
    to: string;
    from: string;
    subject: string;
    text: string;
    html: string;
    messageId: string;
    sentAt: Date;
    transport: MailTransportMode;
    metadata?: {
        resetMode?: 'otp' | 'link';
        resetToken?: string;
        resetUrl?: string;
        resetCode?: string;
    };
}
export declare class MailService implements OnModuleDestroy {
    private readonly configService;
    private transporter;
    private readonly testMessages;
    constructor(configService: ConfigService);
    sendPasswordResetLinkEmail(params: {
        to: string;
        resetToken: string;
    }): Promise<{
        messageId: string;
        resetUrl: string;
    }>;
    sendPasswordResetOtpEmail(params: {
        to: string;
        resetCode: string;
        expiresInMinutes: number;
    }): Promise<{
        messageId: string;
    }>;
    getTestMessages(): readonly TestMailMessage[];
    clearTestMessages(): void;
    onModuleDestroy(): void;
    private getTransporter;
    private getMailFrom;
    private buildResetPasswordUrl;
    private buildLegacyResetPasswordUrl;
    private getTransportMode;
    private isTestEnvironment;
    private getRequiredConfig;
}
export {};
