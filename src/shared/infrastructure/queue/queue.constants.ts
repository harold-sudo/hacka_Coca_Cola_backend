export const QUEUES = {
  WHATSAPP_INBOUND: 'whatsapp-inbound',
  WHATSAPP_OUTBOUND: 'whatsapp-outbound',
  FEEDBACK_PIPELINE: 'feedback-pipeline',
} as const;

export type QueueName = typeof QUEUES[keyof typeof QUEUES];
