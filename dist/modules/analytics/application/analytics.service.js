var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../shared/infrastructure/prisma/prisma.service.js';
let AnalyticsService = class AnalyticsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getEventMetrics(eventId) {
        const event = await this.prisma.event.findUnique({
            where: { id: eventId },
        });
        if (!event) {
            throw new Error('Evento no encontrado');
        }
        const [totalRegistered, totalAttended, recurrentAttendees, interactions, feedbackList, couponsCount,] = await Promise.all([
            this.prisma.registration.count({
                where: { eventId, status: { in: ['REGISTERED', 'ATTENDED'] } },
            }),
            this.prisma.registration.count({
                where: { eventId, status: 'ATTENDED' },
            }),
            this.prisma.registration.count({
                where: {
                    eventId,
                    status: 'ATTENDED',
                    participant: { isRecurrent: true },
                },
            }),
            this.prisma.interaction.findMany({
                where: { registration: { eventId } },
                include: { product: true },
            }),
            this.prisma.feedback.findMany({
                where: { registration: { eventId } },
            }),
            this.prisma.coupon.count({
                where: { registration: { eventId } },
            }),
        ]);
        const attendanceRate = totalRegistered > 0 ? (totalAttended / totalRegistered) * 100 : 0;
        const goalProgress = event.attendanceGoal > 0 ? (totalAttended / event.attendanceGoal) * 100 : 0;
        const recurrenceRate = totalAttended > 0 ? (recurrentAttendees / totalAttended) * 100 : 0;
        const uniqueEngagedAttendees = new Set(interactions.map((i) => i.registrationId)).size;
        const engagementRate = totalAttended > 0 ? (uniqueEngagedAttendees / totalAttended) * 100 : 0;
        const productClaimsMap = new Map();
        for (const inter of interactions) {
            if (!inter.productId || !inter.product)
                continue;
            const cur = productClaimsMap.get(inter.productId) || {
                productId: inter.productId,
                name: inter.product.name,
                claims: 0,
            };
            cur.claims += 1;
            productClaimsMap.set(inter.productId, cur);
        }
        const completedFeedback = feedbackList.filter((f) => f.status === 'COMPLETED');
        const feedbackRequested = feedbackList.length;
        const feedbackResponseRate = feedbackRequested > 0 ? (completedFeedback.length / feedbackRequested) * 100 : 0;
        const validSentiments = completedFeedback.map((f) => f.sentimentScore).filter((s) => s !== null);
        const avgSentiment = validSentiments.length > 0
            ? validSentiments.reduce((acc, curr) => acc + curr, 0) / validSentiments.length
            : 0;
        const purchaseIntentCount = completedFeedback.filter((f) => f.purchaseIntent).length;
        const purchaseIntentRate = completedFeedback.length > 0 ? (purchaseIntentCount / completedFeedback.length) * 100 : 0;
        return {
            registered: totalRegistered,
            attended: totalAttended,
            attendanceRate: Number(attendanceRate.toFixed(2)),
            attendanceGoal: event.attendanceGoal,
            goalProgress: Number(goalProgress.toFixed(2)),
            recurrentAttendees,
            recurrenceRate: Number(recurrenceRate.toFixed(2)),
            engagedAttendees: uniqueEngagedAttendees,
            engagementRate: Number(engagementRate.toFixed(2)),
            claimsByProduct: Array.from(productClaimsMap.values()),
            blockedFraudAttempts: 0,
            feedback: {
                requested: feedbackRequested,
                completed: completedFeedback.length,
                responseRate: Number(feedbackResponseRate.toFixed(2)),
                avgSentiment: Number(avgSentiment.toFixed(2)),
                purchaseIntentRate: Number(purchaseIntentRate.toFixed(2)),
            },
            couponsIssued: couponsCount,
            updatedAt: new Date(),
        };
    }
};
AnalyticsService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService])
], AnalyticsService);
export { AnalyticsService };
//# sourceMappingURL=analytics.service.js.map