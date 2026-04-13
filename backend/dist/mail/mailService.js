"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const nodemailer = require("nodemailer");
let MailService = class MailService {
    constructor(configService) {
        this.configService = configService;
        this.transporter = null;
        this.testMessages = [];
    }
    async sendPasswordResetLinkEmail(params) {
        const from = this.getMailFrom();
        const resetUrl = this.buildResetPasswordUrl(params.resetToken);
        const subject = 'Reset your PlayStation Store password';
        const text = [
            'We received a request to reset your PlayStation Store password.',
            '',
            `Reset your password using this link: ${resetUrl}`,
            '',
            'If you did not request this, you can ignore this email.',
            'This link expires soon and can only be used once.',
        ].join('\n');
        const html = [
            '<p>We received a request to reset your PlayStation Store password.</p>',
            `<p><a href="${resetUrl}">Reset your password</a></p>`,
            `<p>If the button does not work, use this link:</p><p>${resetUrl}</p>`,
            '<p>If you did not request this, you can ignore this email.</p>',
            '<p>This link expires soon and can only be used once.</p>',
        ].join('');
        if (this.getTransportMode() === 'memory') {
            const messageId = `memory-${Date.now()}`;
            this.testMessages.push({
                to: params.to,
                from,
                subject,
                text,
                html,
                messageId,
                sentAt: new Date(),
                transport: 'memory',
                metadata: {
                    resetMode: 'link',
                    resetToken: params.resetToken,
                    resetUrl,
                },
            });
            return { messageId, resetUrl };
        }
        const transporter = this.getTransporter();
        const result = await transporter.sendMail({
            from,
            to: params.to,
            subject,
            text,
            html,
        });
        return {
            messageId: result.messageId,
            resetUrl,
        };
    }
    async sendPasswordResetOtpEmail(params) {
        const from = this.getMailFrom();
        const subject = 'Your PlayStation Store password reset code';
        const text = [
            'We received a request to reset your PlayStation Store password.',
            '',
            `Your password reset code is: ${params.resetCode}`,
            `This code expires in ${params.expiresInMinutes} minutes.`,
            '',
            'If you did not request this, you can ignore this email.',
        ].join('\n');
        const html = [
            '<p>We received a request to reset your PlayStation Store password.</p>',
            `<p>Your password reset code is: <strong>${params.resetCode}</strong></p>`,
            `<p>This code expires in ${params.expiresInMinutes} minutes.</p>`,
            '<p>If you did not request this, you can ignore this email.</p>',
        ].join('');
        if (this.getTransportMode() === 'memory') {
            const messageId = `memory-${Date.now()}`;
            this.testMessages.push({
                to: params.to,
                from,
                subject,
                text,
                html,
                messageId,
                sentAt: new Date(),
                transport: 'memory',
                metadata: {
                    resetMode: 'otp',
                    resetCode: params.resetCode,
                },
            });
            return { messageId };
        }
        const transporter = this.getTransporter();
        const result = await transporter.sendMail({
            from,
            to: params.to,
            subject,
            text,
            html,
        });
        return {
            messageId: result.messageId,
        };
    }
    async sendLoginOtpEmail(params) {
        const from = this.getMailFrom();
        const subject = 'Your PlayStation Store login verification code';
        const text = [
            'Use this code to complete your PlayStation Store login:',
            '',
            `${params.loginCode}`,
            '',
            `This code expires in ${params.expiresInMinutes} minutes.`,
            'If you did not try to sign in, you can ignore this email.',
        ].join('\n');
        const html = [
            '<p>Use this code to complete your PlayStation Store login:</p>',
            `<p><strong>${params.loginCode}</strong></p>`,
            `<p>This code expires in ${params.expiresInMinutes} minutes.</p>`,
            '<p>If you did not try to sign in, you can ignore this email.</p>',
        ].join('');
        if (this.getTransportMode() === 'memory') {
            const messageId = `memory-${Date.now()}`;
            this.testMessages.push({
                to: params.to,
                from,
                subject,
                text,
                html,
                messageId,
                sentAt: new Date(),
                transport: 'memory',
                metadata: {
                    loginCode: params.loginCode,
                },
            });
            return { messageId };
        }
        const transporter = this.getTransporter();
        const result = await transporter.sendMail({
            from,
            to: params.to,
            subject,
            text,
            html,
        });
        return {
            messageId: result.messageId,
        };
    }
    getTestMessages() {
        return [...this.testMessages];
    }
    clearTestMessages() {
        this.testMessages.length = 0;
    }
    onModuleDestroy() {
        this.transporter?.close();
    }
    getTransporter() {
        if (this.transporter) {
            return this.transporter;
        }
        const host = this.getRequiredConfig('SMTP_HOST');
        const port = Number(this.getRequiredConfig('SMTP_PORT'));
        const user = this.getRequiredConfig('SMTP_USER');
        const pass = this.getRequiredConfig('SMTP_PASS');
        this.transporter = nodemailer.createTransport({
            host,
            port,
            secure: port === 465,
            auth: {
                user,
                pass,
            },
        });
        return this.transporter;
    }
    getMailFrom() {
        const mailFrom = this.configService.get('MAIL_FROM') ??
            this.configService.get('SMTP_USER');
        if (!mailFrom) {
            throw new Error('MAIL_FROM or SMTP_USER must be configured.');
        }
        return mailFrom;
    }
    buildResetPasswordUrl(resetToken) {
        const configuredResetUrl = this.configService.get('FRONTEND_RESET_PASSWORD_URL') ??
            this.buildLegacyResetPasswordUrl();
        if (!configuredResetUrl) {
            throw new Error('FRONTEND_RESET_PASSWORD_URL or FRONTEND_URL must be configured.');
        }
        const url = new URL(configuredResetUrl);
        url.searchParams.set('token', resetToken);
        return url.toString();
    }
    buildLegacyResetPasswordUrl() {
        const frontendUrl = this.configService.get('FRONTEND_URL');
        if (!frontendUrl) {
            return null;
        }
        return `${frontendUrl.replace(/\/+$/, '')}/auth/reset-password`;
    }
    getTransportMode() {
        const configuredMode = this.configService
            .get('MAIL_TRANSPORT')
            ?.toLowerCase();
        if (configuredMode === 'smtp' || configuredMode === 'memory') {
            return configuredMode;
        }
        return this.isTestEnvironment() ? 'memory' : 'smtp';
    }
    isTestEnvironment() {
        return (this.configService.get('NODE_ENV') === 'test' ||
            Boolean(process.env.JEST_WORKER_ID));
    }
    getRequiredConfig(key) {
        const value = this.configService.get(key);
        if (!value) {
            throw new Error(`${key} is not configured.`);
        }
        return value;
    }
};
exports.MailService = MailService;
exports.MailService = MailService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], MailService);
//# sourceMappingURL=mailService.js.map