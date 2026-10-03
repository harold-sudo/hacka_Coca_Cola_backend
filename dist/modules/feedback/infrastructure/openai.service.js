var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var OpenAiService_1;
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { zodResponseFormat } from 'openai/helpers/zod';
import { FeedbackAnalysisSchema } from '../domain/feedback-analysis.schema.js';
let OpenAiService = OpenAiService_1 = class OpenAiService {
    configService;
    openai;
    logger = new Logger(OpenAiService_1.name);
    sttModel;
    llmModel;
    constructor(configService) {
        this.configService = configService;
        const apiKey = this.configService.get('OPENAI_API_KEY', 'dummy-key');
        this.openai = new OpenAI({ apiKey });
        this.sttModel = this.configService.get('STT_MODEL', 'whisper-1');
        this.llmModel = this.configService.get('LLM_MODEL', 'gpt-4o-mini');
    }
    async transcribeAudio(audioBuffer, filename = 'feedback.mp3') {
        try {
            const file = new File([new Uint8Array(audioBuffer)], filename, { type: 'audio/mpeg' });
            const response = await this.openai.audio.transcriptions.create({
                file,
                model: this.sttModel,
                language: 'es',
            });
            return { text: response.text };
        }
        catch (error) {
            this.logger.error('Error during OpenAI Whisper transcription', error);
            throw error;
        }
    }
    async analyzeFeedback(transcription, eventName, productCatalog) {
        const systemPrompt = `
Eres un analista experto de Consumer Insights de The Coca-Cola Company.
Recibirás la transcripción de una nota de voz o mensaje espontáneo de un asistente al evento "${eventName}".
Catálogo de productos disponibles en el evento: ${productCatalog.join(', ')}.

Reglas estrictas:
- Analiza SOLO lo que el usuario expresa; no inventes datos.
- sentimentScore: Escala 1 (muy negativo) a 5 (muy positivo).
- purchaseIntent: true únicamente si manifiesta explícita o implícitamente intención de comprarlo o consumirlo.
- Normaliza productsMentioned según el catálogo provisto; descarta marcas de competidores.
- executiveQuote: frase literal representativa de la transcripción, sin PII (datos personales).
- Si no habla de la experiencia del evento o de bebidas, marca isRelevant = false.
- Acepta modismos locales (chilenismos, etc.): "bacán", "la raja" son positivos; "fome" es negativo.
    `.trim();
        try {
            const completion = await this.openai.chat.completions.parse({
                model: this.llmModel,
                temperature: 0,
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: transcription },
                ],
                response_format: zodResponseFormat(FeedbackAnalysisSchema, 'feedback_analysis'),
            });
            const parsed = completion.choices[0].message.parsed;
            if (!parsed) {
                throw new Error('No se pudo estructurar el resultado de análisis del modelo');
            }
            return {
                analysis: parsed,
                usage: completion.usage,
            };
        }
        catch (error) {
            this.logger.error('Error during OpenAI feedback analysis', error);
            throw error;
        }
    }
};
OpenAiService = OpenAiService_1 = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [ConfigService])
], OpenAiService);
export { OpenAiService };
//# sourceMappingURL=openai.service.js.map