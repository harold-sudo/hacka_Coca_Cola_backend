import { Controller, Post, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { FeedbackService } from '../application/feedback.service.js';

@Controller()
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Post('feedback/:id/reprocess')
  async reprocess(@Param('id', ParseUUIDPipe) id: string) {
    const data = await this.feedbackService.reprocessFeedback(id);
    return {
      success: true,
      code: 'OK',
      message: 'Solicitud de reprocesamiento encolada',
      data,
    };
  }

  @Get('events/:id/feedback')
  async listByEvent(@Param('id', ParseUUIDPipe) eventId: string) {
    const feedbackList = await this.feedbackService.listFeedbackByEvent(eventId);
    return {
      success: true,
      code: 'OK',
      message: 'Feedback obtenido con éxito',
      data: feedbackList.map((f) => ({
        id: f.id,
        status: f.status,
        participant: {
          firstName: f.registration.participant.fullName.split(' ')[0],
          ageRange: f.registration.participant.ageRange,
          city: f.registration.participant.city,
          phoneLast4: f.registration.participant.phoneNumber.slice(-4),
        },
        inputType: f.inputType,
        audioDurationSec: f.audioDurationSec,
        transcription: f.transcription,
        sentimentScore: f.sentimentScore,
        likesProduct: f.likesProduct,
        purchaseIntent: f.purchaseIntent,
        keyTopics: f.keyTopics,
        executiveQuote: f.executiveQuote,
        receivedAt: f.receivedAt,
        processedAt: f.processedAt,
      })),
    };
  }
}
