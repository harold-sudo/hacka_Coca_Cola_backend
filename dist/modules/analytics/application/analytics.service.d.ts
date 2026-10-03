import { PrismaService } from '../../../shared/infrastructure/prisma/prisma.service.js';
export declare class AnalyticsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getEventMetrics(eventId: string): Promise<{
        registered: number;
        attended: number;
        attendanceRate: number;
        attendanceGoal: number;
        goalProgress: number;
        recurrentAttendees: number;
        recurrenceRate: number;
        engagedAttendees: number;
        engagementRate: number;
        claimsByProduct: {
            productId: string;
            name: string;
            claims: number;
        }[];
        blockedFraudAttempts: number;
        feedback: {
            requested: number;
            completed: number;
            responseRate: number;
            avgSentiment: number;
            purchaseIntentRate: number;
        };
        couponsIssued: number;
        updatedAt: string;
    } | {
        registered: number;
        attended: number;
        attendanceRate: number;
        attendanceGoal: number;
        goalProgress: number;
        recurrentAttendees: number;
        recurrenceRate: number;
        engagedAttendees: number;
        engagementRate: number;
        claimsByProduct: {
            productId: string;
            name: string;
            claims: number;
        }[];
        blockedFraudAttempts: number;
        feedback: {
            requested: number;
            completed: number;
            responseRate: number;
            avgSentiment: number;
            purchaseIntentRate: number;
        };
        couponsIssued: number;
        updatedAt: Date;
    }>;
}
