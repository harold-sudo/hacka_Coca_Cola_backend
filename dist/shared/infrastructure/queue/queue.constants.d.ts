export declare const QUEUES: {
    readonly WHATSAPP_INBOUND: "whatsapp-inbound";
    readonly WHATSAPP_OUTBOUND: "whatsapp-outbound";
    readonly FEEDBACK_PIPELINE: "feedback-pipeline";
};
export type QueueName = typeof QUEUES[keyof typeof QUEUES];
