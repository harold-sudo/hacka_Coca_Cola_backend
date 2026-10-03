var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var TwilioWhatsappGateway_1;
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
let TwilioWhatsappGateway = TwilioWhatsappGateway_1 = class TwilioWhatsappGateway {
    config;
    logger = new Logger(TwilioWhatsappGateway_1.name);
    accountSid;
    fromNumber;
    constructor(config) {
        this.config = config;
        this.accountSid = this.config.get('TWILIO_ACCOUNT_SID', '');
        this.fromNumber = this.config.get('TWILIO_WHATSAPP_FROM', 'whatsapp:+14155238886');
    }
    async sendText(to, body) {
        this.logger.log(`[Twilio Gateway] Sending WhatsApp text from ${this.fromNumber} to ${to}: ${body}`);
        return {
            messageId: `SM${Date.now()}`,
            recipient: to,
            status: 'sent',
        };
    }
    async sendButtons(to, body, buttons) {
        const listText = buttons.map((b, i) => `${i + 1}. ${b.title}`).join('\n');
        return this.sendText(to, `${body}\n\n${listText}`);
    }
    async sendImage(to, imageUrl, caption) {
        this.logger.log(`[Twilio Gateway] Sending media to ${to}: ${imageUrl} (${caption})`);
        return {
            messageId: `MM${Date.now()}`,
            recipient: to,
            status: 'sent',
        };
    }
    async downloadMedia(mediaId) {
        return {
            buffer: Buffer.from('twilio audio mock'),
            mimeType: 'audio/mpeg',
        };
    }
};
TwilioWhatsappGateway = TwilioWhatsappGateway_1 = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [ConfigService])
], TwilioWhatsappGateway);
export { TwilioWhatsappGateway };
//# sourceMappingURL=twilio-whatsapp.gateway.js.map