import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WhatsappGateway, SentMessage } from '../application/ports/whatsapp.gateway.js';

@Injectable()
export class TwilioWhatsappGateway implements WhatsappGateway {
  private readonly logger = new Logger(TwilioWhatsappGateway.name);
  private readonly accountSid: string;
  private readonly fromNumber: string;

  constructor(private readonly config: ConfigService) {
    this.accountSid = this.config.get<string>('TWILIO_ACCOUNT_SID', '');
    this.fromNumber = this.config.get<string>('TWILIO_WHATSAPP_FROM', 'whatsapp:+14155238886');
  }

  async sendText(to: string, body: string): Promise<SentMessage> {
    this.logger.log(`[Twilio Gateway] Sending WhatsApp text from ${this.fromNumber} to ${to}: ${body}`);
    return {
      messageId: `SM${Date.now()}`,
      recipient: to,
      status: 'sent',
    };
  }

  async sendButtons(to: string, body: string, buttons: { id: string; title: string }[]): Promise<SentMessage> {
    const listText = buttons.map((b, i) => `${i + 1}. ${b.title}`).join('\n');
    return this.sendText(to, `${body}\n\n${listText}`);
  }

  async sendImage(to: string, imageUrl: string, caption?: string): Promise<SentMessage> {
    this.logger.log(`[Twilio Gateway] Sending media to ${to}: ${imageUrl} (${caption})`);
    return {
      messageId: `MM${Date.now()}`,
      recipient: to,
      status: 'sent',
    };
  }

  async downloadMedia(mediaId: string): Promise<{ buffer: Buffer; mimeType: string }> {
    return {
      buffer: Buffer.from('twilio audio mock'),
      mimeType: 'audio/mpeg',
    };
  }
}
