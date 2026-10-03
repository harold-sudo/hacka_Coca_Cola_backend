import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WhatsappGateway, SentMessage } from '../application/ports/whatsapp.gateway.js';

@Injectable()
export class MetaCloudWhatsappGateway implements WhatsappGateway {
  private readonly logger = new Logger(MetaCloudWhatsappGateway.name);
  private readonly apiUrl: string;
  private readonly phoneNumberId: string;
  private readonly accessToken: string;

  constructor(private readonly config: ConfigService) {
    this.apiUrl = this.config.get<string>('WHATSAPP_API_URL', 'https://graph.facebook.com/v21.0');
    this.phoneNumberId = this.config.get<string>('WHATSAPP_PHONE_NUMBER_ID', '');
    this.accessToken = this.config.get<string>('WHATSAPP_ACCESS_TOKEN', '');
  }

  async sendText(to: string, body: string): Promise<SentMessage> {
    this.logger.log(`[Meta Cloud] Sending WhatsApp text to ${to}: ${body}`);
    // En entorno real realiza llamada fetch a Graph API:
    // POST https://graph.facebook.com/v21.0/{phone_number_id}/messages
    return {
      messageId: `wamid.mock_${Date.now()}`,
      recipient: to,
      status: 'sent',
    };
  }

  async sendButtons(to: string, body: string, buttons: { id: string; title: string }[]): Promise<SentMessage> {
    this.logger.log(`[Meta Cloud] Sending interactive buttons to ${to}: ${JSON.stringify(buttons)}`);
    return {
      messageId: `wamid.mock_${Date.now()}`,
      recipient: to,
      status: 'sent',
    };
  }

  async sendImage(to: string, imageUrl: string, caption?: string): Promise<SentMessage> {
    this.logger.log(`[Meta Cloud] Sending WhatsApp image to ${to}: ${imageUrl} (caption: ${caption})`);
    return {
      messageId: `wamid.mock_${Date.now()}`,
      recipient: to,
      status: 'sent',
    };
  }

  async downloadMedia(mediaId: string): Promise<{ buffer: Buffer; mimeType: string }> {
    this.logger.log(`[Meta Cloud] Downloading WhatsApp media: ${mediaId}`);
    return {
      buffer: Buffer.from('mock media bytes'),
      mimeType: 'audio/ogg',
    };
  }
}
