var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { PrismaService } from '../../../shared/infrastructure/prisma/prisma.service.js';
import { QUEUES } from '../../../shared/infrastructure/queue/queue.constants.js';
import { FeedbackNotReprocessableError } from '../../../shared/domain/errors/domain.error.js';
import { FeedbackStatus } from '@prisma/client';
let FeedbackService = class FeedbackService {
    prisma;
    feedbackQueue;
    constructor(prisma, feedbackQueue) {
        this.prisma = prisma;
        this.feedbackQueue = feedbackQueue;
    }
    async reprocessFeedback(feedbackId) {
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
    async listFeedbackByEvent(eventId) {
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
};
FeedbackService = __decorate([
    Injectable(),
    __param(1, InjectQueue(QUEUES.FEEDBACK_PIPELINE)),
    __metadata("design:paramtypes", [PrismaService,
        Queue])
], FeedbackService);
export { FeedbackService };
//# sourceMappingURL=feedback.service.js.map