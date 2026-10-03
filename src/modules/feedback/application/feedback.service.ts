import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { PrismaService } from '../../../shared/infrastructure/prisma/prisma.service.js';
import { QUEUES } from '../../../shared/infrastructure/queue/queue.constants.js';
import { FeedbackNotReprocessableError } from '../../../shared/domain/errors/domain.error.js';
import { FeedbackStatus } from '@prisma/client';

@Injectable()
export class FeedbackService {
  constructor(
    private readonly prisma: PrismaService,
    @InjectQueue(QUEUES.FEEDBACK_PIPELINE) private readonly feedbackQueue: Queue,
  ) {}

  async reprocessFeedback(feedbackId: string) {
    const feedback = await this.prisma.feedback.findUnique({
      where: { id: feedbackId },
    });

    if (!feedback) {
      throw new Error('Feedback no encontrado');
    }

    if (feedback.status !== FeedbackStatus.FAILED) {
      throw new FeedbackNotReprocessableError();
    }

    await this.prisma.feedback.update({
      where: { id: feedbackId },
      data: {
        status: FeedbackStatus.RECEIVED,
        lastError: null,
      },
    });

    await this.feedbackQueue.add('reprocess', { feedbackId });

    return {
      message: 'Feedback re-encolado para procesamiento con éxito',
      feedbackId,
    };
  }

  async listFeedbackByEvent(eventId: string) {
    return this.prisma.feedback.findMany({
      where: { registration: { eventId } },
      include: {
        registration: {
          include: { participant: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }
}
