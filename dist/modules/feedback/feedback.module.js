var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ConfigModule } from '@nestjs/config';
import { QUEUES } from '../../shared/infrastructure/queue/queue.constants.js';
import { OpenAiService } from './infrastructure/openai.service.js';
import { FeedbackProcessor } from './infrastructure/feedback.processor.js';
import { FeedbackService } from './application/feedback.service.js';
import { FeedbackController } from './presentation/feedback.controller.js';
let FeedbackModule = class FeedbackModule {
};
FeedbackModule = __decorate([
    Module({
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
], FeedbackModule);
export { FeedbackModule };
//# sourceMappingURL=feedback.module.js.map