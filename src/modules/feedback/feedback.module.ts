import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ConfigModule } from '@nestjs/config';
import { QUEUES } from '../../shared/infrastructure/queue/queue.constants.js';
import { OpenAiService } from './infrastructure/openai.service.js';
import { FeedbackProcessor } from './infrastructure/feedback.processor.js';
import { FeedbackService } from './application/feedback.service.js';
import { FeedbackController } from './presentation/feedback.controller.js';

@Module({
  imports: [
    BullModule.registerQueue({
      name: QUEUES.FEEDBACK_PIPELINE,
    }),
    ConfigModule,
  ],
  controllers: [FeedbackController],
  providers: [OpenAiService, FeedbackService, FeedbackProcessor],
  exports: [OpenAiService, FeedbackService],
})
export class FeedbackModule {}
