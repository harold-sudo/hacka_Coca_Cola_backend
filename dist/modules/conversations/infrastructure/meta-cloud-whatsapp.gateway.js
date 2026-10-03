var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var MetaCloudWhatsappGateway_1;
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
let MetaCloudWhatsappGateway = MetaCloudWhatsappGateway_1 = class MetaCloudWhatsappGateway {
    config;
    logger = new Logger(MetaCloudWhatsappGateway_1.name);
    apiUrl;
    phoneNumberId;
    accessToken;
    constructor(config) {
        this.config = config;
        this.apiUrl = this.config.get('WHATSAPP_API_URL', 'https://graph.facebook.com/v21.0');
        this.phoneNumberId = this.config.get('WHATSAPP_PHONE_NUMBER_ID', '');
        this.accessToken = this.config.get('WHATSAPP_ACCESS_TOKEN', '');
    }
    async sendText(to, body) {
        this.logger.log(`[Meta Cloud] Sending WhatsApp text to ${to}: ${body}`);
        return {
            messageId: `wamid.mock_${Date.now()}`,
            recipient: to,
            status: 'sent',
        };
    }
    async sendButtons(to, body, buttons) {
        this.logger.log(`[Meta Cloud] Sending interactive buttons to ${to}: ${JSON.stringify(buttons)}`);
        return {
            messageId: `wamid.mock_${Date.now()}`,
            recipient: to,
            status: 'sent',
        };
    }
    async sendImage(to, imageUrl, caption) {
        this.logger.log(`[Meta Cloud] Sending WhatsApp image to ${to}: ${imageUrl} (caption: ${caption})`);
        return {
            messageId: `wamid.mock_${Date.now()}`,
            recipient: to,
            status: 'sent',
        };
    }
    async downloadMedia(mediaId) {
        this.logger.log(`[Meta Cloud] Downloading WhatsApp media: ${mediaId}`);
        return {
            buffer: Buffer.from('mock media bytes'),
            mimeType: 'audio/ogg',
        };
    }
};
MetaCloudWhatsappGateway = MetaCloudWhatsappGateway_1 = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [ConfigService])
], MetaCloudWhatsappGateway);
export { MetaCloudWhatsappGateway };
//# sourceMappingURL=meta-cloud-whatsapp.gateway.js.map