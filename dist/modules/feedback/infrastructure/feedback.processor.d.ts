import { WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { PrismaService } from '../../../shared/infrastructure/prisma/prisma.service.js';
import { OpenAiService } from '../infrastructure/openai.service.js';
export interface FeedbackJobData {
    feedbackId: string;
}
export declare class FeedbackProcessor extends WorkerHost {
    private readonly prisma;
    private readonly openAiService;
    private readonly logger;
    constructor(prisma: PrismaService, openAiService: OpenAiService);
    process(job: Job<FeedbackJobData>): Promise<void>;
}
