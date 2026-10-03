import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../../shared/infrastructure/prisma/prisma.service.js';
import { MetaCloudWhatsappGateway } from '../infrastructure/meta-cloud-whatsapp.gateway.js';
export interface InboundMessageDto {
    waMessageId: string;
    from: string;
    type: string;
    text?: string;
    mediaId?: string;
}
export declare class ConversationsService {
    private readonly prisma;
    private readonly whatsappGateway;
    private readonly configService;
    private readonly logger;
    private readonly qrSecret;
    constructor(prisma: PrismaService, whatsappGateway: MetaCloudWhatsappGateway, configService: ConfigService);
    handleInbound(msg: InboundMessageDto): Promise<{
        status: string;
        handled?: undefined;
    } | {
        handled: boolean;
        status?: undefined;
    }>;
}
