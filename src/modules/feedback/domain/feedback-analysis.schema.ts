import { z } from 'zod';

export const FeedbackAnalysisSchema = z.object({
  isRelevant: z.boolean().describe('true si habla de la experiencia del evento o productos'),
  sentimentScore: z.number().int().min(1).max(5).describe('1 muy negativo, 3 neutral, 5 muy positivo'),
  likesProduct: z.boolean().describe('Le gustó el producto que probó'),
  purchaseIntent: z.boolean().describe('Expresa que lo compraría o consumiría en el futuro'),
  productsMentioned: z.array(z.string()).describe('Productos mencionados normalizados al catálogo'),
  flavorAttributes: z.array(z.string()).max(8).describe('Atributos de sabor detectados'),
  keyTopics: z.array(z.enum([
    'sabor', 'temperatura', 'dulzor', 'gas', 'precio', 'música', 'filas', 'staff',
    'ambiente', 'actividades', 'organización', 'otro'
  ])).max(6),
  experienceHighlights: z.array(z.string()).max(3),
  painPoints: z.array(z.string()).max(3),
  executiveQuote: z.string().max(200).describe('Cita breve y fiel'),
  language: z.string().describe('Código ISO 639-1'),
});

export type FeedbackAnalysis = z.infer<typeof FeedbackAnalysisSchema>;
