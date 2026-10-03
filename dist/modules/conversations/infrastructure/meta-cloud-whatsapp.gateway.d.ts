import { ConfigService } from '@nestjs/config';
import { WhatsappGateway, SentMessage } from '../application/ports/whatsapp.gateway.js';
export declare class MetaCloudWhatsappGateway implements WhatsappGateway {
    private readonly config;
    private readonly logger;
    private readonly apiUrl;
    private readonly phoneNumberId;
    private readonly accessToken;
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
