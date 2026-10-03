var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var FeedbackProcessor_1;
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { QUEUES } from '../../../shared/infrastructure/queue/queue.constants.js';
import { PrismaService } from '../../../shared/infrastructure/prisma/prisma.service.js';
import { OpenAiService } from '../infrastructure/openai.service.js';
import { FeedbackStatus } from '@prisma/client';
let FeedbackProcessor = FeedbackProcessor_1 = class FeedbackProcessor extends WorkerHost {
    prisma;
    openAiService;
    logger = new Logger(FeedbackProcessor_1.name);
    constructor(prisma, openAiService) {
        super();
        this.prisma = prisma;
        this.openAiService = openAiService;
    }
    async process(job) {
        const { feedbackId } = job.data;
        this.logger.log(`Processing feedback pipeline job ${job.id} for feedbackId: ${feedbackId}`);
        const feedback = await this.prisma.feedback.findUnique({
            where: { id: feedbackId },
            include: {
                registration: {
                    include: {
                        event: {
                            include: {
                                activities: {
                                    include: {
                                        products: { include: { product: true } },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });
        if (!feedback) {
            this.logger.warn(`Feedback with id ${feedbackId} not found`);
            return;
        }
        try {
            let transcriptionText = feedback.transcription;
            if (feedback.audioKey && !transcriptionText) {
                await this.prisma.feedback.update({
                    where: { id: feedbackId },
                    data: { status: FeedbackStatus.TRANSCRIBING, attempts: { increment: 1 } },
                });
                const mockAudioBuffer = Buffer.from('Me encanto la Coca Cola Zero en el evento!');
                const sttResult = await this.openAiService.transcribeAudio(mockAudioBuffer);
                transcriptionText = sttResult.text;
                await this.prisma.feedback.update({
                    where: { id: feedbackId },
                    data: { transcription: transcriptionText },
                });
            }
            if (!transcriptionText) {
                throw new Error('No se dispone de texto ni audio para procesar el feedback');
            }
            await this.prisma.feedback.update({
                where: { id: feedbackId },
                data: { status: FeedbackStatus.ANALYZING },
            });
            const event = feedback.registration.event;
            const productCatalog = event.activities.flatMap((a) => a.products.map((p) => p.product.name));
            const { analysis, usage } = await this.openAiService.analyzeFeedback(transcriptionText, event.name, productCatalog.length > 0 ? productCatalog : ['Coca-Cola Original', 'Coca-Cola Zero Azúcar']);
            const finalStatus = analysis.isRelevant ? FeedbackStatus.COMPLETED : FeedbackStatus.REJECTED;
            await this.prisma.feedback.update({
                where: { id: feedbackId },
                data: {
                    status: finalStatus,
                    sentimentScore: analysis.sentimentScore,
                    likesProduct: analysis.likesProduct,
                    purchaseIntent: analysis.purchaseIntent,
                    isRelevant: analysis.isRelevant,
                    keyTopics: analysis.keyTopics,
                    executiveQuote: analysis.executiveQuote,
                    aiMetadata: {
                        ...analysis,
                        model: 'gpt-4o-mini',
                        promptVersion: 'v1',
                        usage,
                    },
                    processedAt: new Date(),
                },
            });
            this.logger.log(`Feedback ${feedbackId} processed with status: ${finalStatus}`);
        }
        catch (error) {
            this.logger.error(`Error processing feedback pipeline for ${feedbackId}: ${error.message}`);
            await this.prisma.feedback.update({
                where: { id: feedbackId },
                data: {
                    status: FeedbackStatus.FAILED,
                    lastError: error.message,
                },
            });
            throw error;
        }
    }
};
FeedbackProcessor = FeedbackProcessor_1 = __decorate([
    Processor(QUEUES.FEEDBACK_PIPELINE),
    __metadata("design:paramtypes", [PrismaService,
        OpenAiService])
], FeedbackProcessor);
export { FeedbackProcessor };
//# sourceMappingURL=feedback.processor.js.map