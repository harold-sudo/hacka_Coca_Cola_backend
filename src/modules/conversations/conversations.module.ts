import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ConversationsService } from './application/conversations.service.js';
import { WhatsappWebhookController } from './presentation/whatsapp-webhook.controller.js';
import { MetaCloudWhatsappGateway } from './infrastructure/meta-cloud-whatsapp.gateway.js';
import { TwilioWhatsappGateway } from './infrastructure/twilio-whatsapp.gateway.js';

@Module({
  imports: [ConfigModule],
  controllers: [WhatsappWebhookController],
  providers: [
    ConversationsService,
    MetaCloudWhatsappGateway,
    TwilioWhatsappGateway,
  ],
  exports: [ConversationsService, MetaCloudWhatsappGateway],
})
export class ConversationsModule {}
