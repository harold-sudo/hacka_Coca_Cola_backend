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
import { Controller, Post, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { FeedbackService } from '../application/feedback.service.js';
let FeedbackController = class FeedbackController {
    feedbackService;
    constructor(feedbackService) {
        this.feedbackService = feedbackService;
    }
    async reprocess(id) {
        const data = await this.feedbackService.reprocessFeedback(id);
        return {
            success: true,
            code: 'OK',
            message: 'Solicitud de reprocesamiento encolada',
            data,
        };
    }
    async listByEvent(eventId) {
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
};
__decorate([
    Post('feedback/:id/reprocess'),
    __param(0, Param('id', ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FeedbackController.prototype, "reprocess", null);
__decorate([
    Get('events/:id/feedback'),
    __param(0, Param('id', ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FeedbackController.prototype, "listByEvent", null);
FeedbackController = __decorate([
    Controller(),
    __metadata("design:paramtypes", [FeedbackService])
], FeedbackController);
export { FeedbackController };
//# sourceMappingURL=feedback.controller.js.map