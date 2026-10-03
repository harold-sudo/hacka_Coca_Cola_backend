import { AnalyticsService } from '../application/analytics.service.js';
export declare class AnalyticsController {
    private readonly analyticsService;
    constructor(analyticsService: AnalyticsService);
    getMetrics(id: string): Promise<{
        success: boolean;
        code: string;
        message: string;
        data: {
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
        };
    }>;
}
