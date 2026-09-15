import { env } from '../config/env';
import { ChatMessage } from '../types/chatMessage';
import { logger } from '../utils/logger';
import { getChannel } from './rabbitmq.service';

/**
 * Publica un ChatMessage en la cola que consume el Motor de Moderación.
 *
 * Deliberadamente no relanza el error: si RabbitMQ está caído o
 * inalcanzable en ese momento, el Ingestor no debe dejar de escuchar
 * el chat por eso. El siguiente mensaje reintenta la conexión.
 */
export async function sendToModerationEngine(message: ChatMessage): Promise<void> {
  try {
    const channel = await getChannel();

    channel.sendToQueue(env.MODERATION_QUEUE, Buffer.from(JSON.stringify(message)), {
      persistent: true,
      contentType: 'application/json',
    });
  } catch (err) {
    logger.error(
      `No se pudo publicar el mensaje ${message.messageId} del canal ${message.channelId} en RabbitMQ:`,
      (err as Error).message,
    );
  }
}
