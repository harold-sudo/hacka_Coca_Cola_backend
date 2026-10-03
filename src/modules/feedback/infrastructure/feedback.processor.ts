import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { QUEUES } from '../../../shared/infrastructure/queue/queue.constants.js';
import { PrismaService } from '../../../shared/infrastructure/prisma/prisma.service.js';
import { OpenAiService } from '../infrastructure/openai.service.js';
import { FeedbackStatus } from '@prisma/client';

export interface FeedbackJobData {
  feedbackId: string;
}

@Processor(QUEUES.FEEDBACK_PIPELINE)
export class FeedbackProcessor extends WorkerHost {
  private readonly logger = new Logger(FeedbackProcessor.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly openAiService: OpenAiService,
  ) {
    super();
  }

  async process(job: Job<FeedbackJobData>): Promise<void> {
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

      // Step 1: If audio and not yet transcribed, transcribe with Whisper
      if (feedback.audioKey && !transcriptionText) {
        await this.prisma.feedback.update({
          where: { id: feedbackId },
          data: { status: FeedbackStatus.TRANSCRIBING, attempts: { increment: 1 } },
        });

        // Simulating or fetching audio buffer
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

      // Step 2: Analyze with GPT-4o-mini
      await this.prisma.feedback.update({
        where: { id: feedbackId },
        data: { status: FeedbackStatus.ANALYZING },
      });

      const event = feedback.registration.event;
      const productCatalog = event.activities.flatMap((a) =>
        a.products.map((p) => p.product.name),
      );

      const { analysis, usage } = await this.openAiService.analyzeFeedback(
        transcriptionText,
        event.name,
        productCatalog.length > 0 ? productCatalog : ['Coca-Cola Original', 'Coca-Cola Zero Azúcar'],
      );

      // Step 3: Persist results
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
    } catch (error: any) {
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
}
