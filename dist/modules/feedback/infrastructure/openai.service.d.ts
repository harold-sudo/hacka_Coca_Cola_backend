import { ConfigService } from '@nestjs/config';
import { FeedbackAnalysis } from '../domain/feedback-analysis.schema.js';
export declare class OpenAiService {
    private readonly configService;
    private readonly openai;
    private readonly logger;
    private readonly sttModel;
    private readonly llmModel;
    constructor(configService: ConfigService);
    transcribeAudio(audioBuffer: Buffer, filename?: string): Promise<{
        text: string;
        durationSec?: number;
    }>;
    analyzeFeedback(transcription: string, eventName: string, productCatalog: string[]): Promise<{
        analysis: FeedbackAnalysis;
        usage: any;
    }>;
}
