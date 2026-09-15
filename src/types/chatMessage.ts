/**
 * Mensaje reenviado por el Ingestor al Motor de Moderación
 * (POST {MODERATION_ENGINE_URL}/analyze).
 */
export interface ChatMessage {
  messageId: string;
  channelId: string;
  userId: string;
  username: string;
  text: string;
  timestamp: string;
}
