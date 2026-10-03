import { Controller, Post, Get, Body, Query, Headers, HttpCode, HttpStatus, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ConversationsService } from '../application/conversations.service.js';

@Controller('webhooks/whatsapp')
export class WhatsappWebhookController {
  private readonly logger = new Logger(WhatsappWebhookController.name);

  constructor(
    private readonly conversationsService: ConversationsService,
    private readonly configService: ConfigService,
  ) {}

  @Get()
  verifyWebhook(
    @Query('hub.mode') mode: string,
    @Query('hub.verify_token') token: string,
    @Query('hub.challenge') challenge: string,
  ) {
    const expectedToken = this.configService.get<string>('WHATSAPP_VERIFY_TOKEN', 'cocacola_webhook_verify_token_2026');
    if (mode === 'subscribe' && token === expectedToken) {
      this.logger.log('Meta WhatsApp Webhook subscription verified');
      return challenge;
    }
    return 'Forbidden';
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  async handleInbound(@Body() body: any) {
    // Standard Meta Cloud Webhook payload structure
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

    // Direct custom test payload support
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
}
