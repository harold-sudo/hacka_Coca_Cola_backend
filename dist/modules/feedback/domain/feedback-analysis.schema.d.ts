import { z } from 'zod';
export declare const FeedbackAnalysisSchema: z.ZodObject<{
    isRelevant: z.ZodBoolean;
    sentimentScore: z.ZodNumber;
    likesProduct: z.ZodBoolean;
    purchaseIntent: z.ZodBoolean;
    productsMentioned: z.ZodArray<z.ZodString>;
    flavorAttributes: z.ZodArray<z.ZodString>;
    keyTopics: z.ZodArray<z.ZodEnum<{
        sabor: "sabor";
        temperatura: "temperatura";
        dulzor: "dulzor";
        gas: "gas";
        precio: "precio";
        música: "música";
        filas: "filas";
        staff: "staff";
        ambiente: "ambiente";
        actividades: "actividades";
        organización: "organización";
        otro: "otro";
    }>>;
    experienceHighlights: z.ZodArray<z.ZodString>;
    painPoints: z.ZodArray<z.ZodString>;
    executiveQuote: z.ZodString;
    language: z.ZodString;
}, z.core.$strip>;
export type FeedbackAnalysis = z.infer<typeof FeedbackAnalysisSchema>;
