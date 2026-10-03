import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { zodResponseFormat } from 'openai/helpers/zod';
import { FeedbackAnalysis, FeedbackAnalysisSchema } from '../domain/feedback-analysis.schema.js';

@Injectable()
export class OpenAiService {
  private readonly openai: OpenAI;
  private readonly logger = new Logger(OpenAiService.name);
  private readonly sttModel: string;
  private readonly llmModel: string;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY', 'dummy-key');
    this.openai = new OpenAI({ apiKey });
    this.sttModel = this.configService.get<string>('STT_MODEL', 'whisper-1');
    this.llmModel = this.configService.get<string>('LLM_MODEL', 'gpt-4o-mini');
  }

  async transcribeAudio(audioBuffer: Buffer, filename = 'feedback.mp3'): Promise<{ text: string; durationSec?: number }> {
    try {
      const file = new File([new Uint8Array(audioBuffer)], filename, { type: 'audio/mpeg' });
      const response = await this.openai.audio.transcriptions.create({
        file,
        model: this.sttModel,
        language: 'es',
      });
      return { text: response.text };
    } catch (error) {
      this.logger.error('Error during OpenAI Whisper transcription', error);
      throw error;
    }
  }

  async analyzeFeedback(
    transcription: string,
    eventName: string,
    productCatalog: string[],
  ): Promise<{ analysis: FeedbackAnalysis; usage: any }> {
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
    } catch (error) {
      this.logger.error('Error during OpenAI feedback analysis', error);
      throw error;
    }
  }
}
