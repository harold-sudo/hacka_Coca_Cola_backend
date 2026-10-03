import { ConfigService } from '@nestjs/config';
import { WhatsappGateway, SentMessage } from '../application/ports/whatsapp.gateway.js';
export declare class TwilioWhatsappGateway implements WhatsappGateway {
    private readonly config;
    private readonly logger;
    private readonly accountSid;
    private readonly fromNumber;
    constructor(config: ConfigService);
    sendText(to: string, body: string): Promise<SentMessage>;
    sendButtons(to: string, body: string, buttons: {
        id: string;
        title: string;
    }[]): Promise<SentMessage>;
    sendImage(to: string, imageUrl: string, caption?: string): Promise<SentMessage>;
    downloadMedia(mediaId: string): Promise<{
        buffer: Buffer;
        mimeType: string;
    }>;
}
