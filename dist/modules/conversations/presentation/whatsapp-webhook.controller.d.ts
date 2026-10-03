import { ConfigService } from '@nestjs/config';
import { ConversationsService } from '../application/conversations.service.js';
export declare class WhatsappWebhookController {
    private readonly conversationsService;
    private readonly configService;
    private readonly logger;
    constructor(conversationsService: ConversationsService, configService: ConfigService);
    verifyWebhook(mode: string, token: string, challenge: string): string;
    handleInbound(body: any): Promise<{
        status: string;
    }>;
}
