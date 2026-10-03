var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var WhatsappWebhookController_1;
import { Controller, Post, Get, Body, Query, HttpCode, HttpStatus, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ConversationsService } from '../application/conversations.service.js';
let WhatsappWebhookController = WhatsappWebhookController_1 = class WhatsappWebhookController {
    conversationsService;
    configService;
    logger = new Logger(WhatsappWebhookController_1.name);
    constructor(conversationsService, configService) {
        this.conversationsService = conversationsService;
        this.configService = configService;
    }
    verifyWebhook(mode, token, challenge) {
        const expectedToken = this.configService.get('WHATSAPP_VERIFY_TOKEN', 'cocacola_webhook_verify_token_2026');
        if (mode === 'subscribe' && token === expectedToken) {
            this.logger.log('Meta WhatsApp Webhook subscription verified');
            return challenge;
        }
        return 'Forbidden';
    }
    async handleInbound(body) {
        const entry = body?.entry?.[0];
        const change = entry?.changes?.[0];
        const value = change?.value;
        const message = value?.messages?.[0];
        if (message) {
            const from = message.from;
            const waMessageId = message.id;
            const type = message.type;
            const text = message.text?.body || message.button?.text || message.interactive?.button_reply?.title;
            await this.conversationsService.handleInbound({
                waMessageId,
                from,
                type,
                text,
                mediaId: message.audio?.id || message.voice?.id,
            });
        }
        if (body?.from && body?.text) {
            await this.conversationsService.handleInbound({
                waMessageId: body.waMessageId || `manual_${Date.now()}`,
                from: body.from,
                type: 'text',
                text: body.text,
            });
        }
        return { status: 'EVENT_RECEIVED' };
    }
};
__decorate([
    Get(),
    __param(0, Query('hub.mode')),
    __param(1, Query('hub.verify_token')),
    __param(2, Query('hub.challenge')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], WhatsappWebhookController.prototype, "verifyWebhook", null);
__decorate([
    Post(),
    HttpCode(HttpStatus.OK),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WhatsappWebhookController.prototype, "handleInbound", null);
WhatsappWebhookController = WhatsappWebhookController_1 = __decorate([
    Controller('webhooks/whatsapp'),
    __metadata("design:paramtypes", [ConversationsService,
        ConfigService])
], WhatsappWebhookController);
export { WhatsappWebhookController };
//# sourceMappingURL=whatsapp-webhook.controller.js.map