export interface SentMessage {
  messageId: string;
  recipient: string;
  status: 'sent' | 'queued';
}

export interface WhatsappGateway {
  sendText(to: string, body: string): Promise<SentMessage>;
  sendButtons(to: string, body: string, buttons: { id: string; title: string }[]): Promise<SentMessage>;
  sendImage(to: string, imageUrl: string, caption?: string): Promise<SentMessage>;
  downloadMedia(mediaId: string): Promise<{ buffer: Buffer; mimeType: string }>;
}
