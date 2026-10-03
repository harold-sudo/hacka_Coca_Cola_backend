import { FeedbackService } from '../application/feedback.service.js';
export declare class FeedbackController {
    private readonly feedbackService;
    constructor(feedbackService: FeedbackService);
    reprocess(id: string): Promise<{
        success: boolean;
        code: string;
        message: string;
        data: {
            message: string;
            feedbackId: string;
        };
    }>;
    listByEvent(eventId: string): Promise<{
        success: boolean;
        code: string;
        message: string;
        data: {
            id: string;
            status: import("@prisma/client").$Enums.FeedbackStatus;
            participant: {
                firstName: string;
                ageRange: import("@prisma/client").$Enums.AgeRange;
                city: string;
                phoneLast4: string;
            };
            inputType: import("@prisma/client").$Enums.FeedbackInputType | null;
            audioDurationSec: number | null;
            transcription: string | null;
            sentimentScore: number | null;
            likesProduct: boolean | null;
            purchaseIntent: boolean | null;
            keyTopics: string[];
            executiveQuote: string | null;
            receivedAt: Date | null;
            processedAt: Date | null;
        }[];
    }>;
}
