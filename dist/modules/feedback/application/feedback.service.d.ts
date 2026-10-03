import { Queue } from 'bullmq';
import { PrismaService } from '../../../shared/infrastructure/prisma/prisma.service.js';
export declare class FeedbackService {
    private readonly prisma;
    private readonly feedbackQueue;
    constructor(prisma: PrismaService, feedbackQueue: Queue);
    reprocessFeedback(feedbackId: string): Promise<{
        message: string;
        feedbackId: string;
    }>;
    listFeedbackByEvent(eventId: string): Promise<({
        registration: {
            participant: {
                id: string;
                fullName: string;
                createdAt: Date;
                city: string;
                updatedAt: Date;
                phoneNumber: string;
                ageRange: import("@prisma/client").$Enums.AgeRange;
                dataConsent: boolean;
                marketingConsent: boolean;
                consentAt: Date;
                consentVersion: string;
                isRecurrent: boolean;
                lastInboundAt: Date | null;
                anonymizedAt: Date | null;
            };
        } & {
            status: import("@prisma/client").$Enums.RegistrationStatus;
            checkInAt: Date | null;
            id: string;
            createdAt: Date;
            eventId: string;
            qrHash: string;
            checkInClientScanId: string | null;
            participantId: string;
            checkInMethod: import("@prisma/client").$Enums.CheckInMethod | null;
            checkInStaffAccessId: string | null;
            lastActivityAt: Date | null;
            cancelledAt: Date | null;
            qrImageKey: string | null;
        };
    } & {
        status: import("@prisma/client").$Enums.FeedbackStatus;
        id: string;
        createdAt: Date;
        registrationId: string;
        isRelevant: boolean | null;
        sentimentScore: number | null;
        likesProduct: boolean | null;
        purchaseIntent: boolean | null;
        keyTopics: string[];
        executiveQuote: string | null;
        inputType: import("@prisma/client").$Enums.FeedbackInputType | null;
        requestedAt: Date;
        receivedAt: Date | null;
        processedAt: Date | null;
        waMediaId: string | null;
        audioKey: string | null;
        audioDurationSec: number | null;
        transcription: string | null;
        aiMetadata: import("@prisma/client/runtime/library").JsonValue | null;
        attempts: number;
        lastError: string | null;
    })[]>;
}
