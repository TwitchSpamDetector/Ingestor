import tmi from 'tmi.js';
import { v4 as uuidv4 } from 'uuid';
import { env } from '../config/env';
import { AppError } from '../utils/AppError';
import { logger } from '../utils/logger';
import { Listener } from '../types/listener';
import { ChatMessage } from '../types/chatMessage';
import { sendToModerationEngine } from './moderationClient.service';

interface ListenerRecord {
  channelId: string;
  status: Listener['status'];
  connectedSince?: string;
  client: tmi.Client;
}

// Estado en memoria. Suficiente para el MVP de un solo proceso;
// si el Ingestor llega a escalar horizontalmente, esto tendría que
// moverse a un almacén compartido (Redis es buen candidato, ya
// contemplado para una fase posterior del proyecto).
const listeners = new Map<string, ListenerRecord>();

function toListenerDTO(record: ListenerRecord): Listener {
  return {
    channelId: record.channelId,
    status: record.status,
    connectedSince: record.connectedSince,
  };
}

export function getAllListeners(): Listener[] {
  return Array.from(listeners.values()).map(toListenerDTO);
}

export async function createListener(channelId: string): Promise<Listener> {
  if (listeners.has(channelId)) {
    throw new AppError(
      409,
      'LISTENER_ALREADY_EXISTS',
      `Ya existe un listener activo para el canal "${channelId}".`,
      'channelId',
    );
  }

  const options: tmi.Options = {
    channels: [channelId],
  };

  // Con credenciales reales se puede escribir en el chat (banear, timeouts).
  // Sin ellas, tmi.js se conecta anónimo y de sobra alcanza para leer.
  if (env.TWITCH_USERNAME && env.TWITCH_OAUTH_TOKEN) {
    options.identity = {
      username: env.TWITCH_USERNAME,
      password: env.TWITCH_OAUTH_TOKEN,
    };
  }

  const client = new tmi.Client(options);

  const record: ListenerRecord = {
    channelId,
    status: 'CONNECTING',
    client,
  };

  listeners.set(channelId, record);

  client.on('connected', () => {
    record.status = 'LISTENING';
    record.connectedSince = new Date().toISOString();
    logger.info(`Listener conectado al canal "${channelId}"`);
  });

  client.on('disconnected', (reason) => {
    record.status = 'DISCONNECTED';
    logger.warn(`Listener desconectado del canal "${channelId}":`, reason);
  });

  client.on('message', (channel, tags, text, self) => {
    if (self) return;

    const chatMessage: ChatMessage = {
      messageId: uuidv4(),
      channelId: channel.replace('#', ''),
      userId: tags['user-id'] ?? 'unknown',
      username: tags['display-name'] ?? tags.username ?? 'unknown',
      text,
      timestamp: new Date().toISOString(),
    };

    void sendToModerationEngine(chatMessage);
  });

  try {
    await client.connect();
  } catch (err) {
    listeners.delete(channelId);
    throw new AppError(
      400,
      'TWITCH_CONNECTION_ERROR',
      `No se pudo conectar al canal "${channelId}" en Twitch.`,
      'channelId',
    );
  }

  return toListenerDTO(record);
}

export async function removeListener(channelId: string): Promise<void> {
  const record = listeners.get(channelId);

  if (!record) {
    throw new AppError(
      404,
      'LISTENER_NOT_FOUND',
      `No se encontró un listener activo para el canal "${channelId}".`,
      'channelId',
    );
  }

  await record.client.disconnect();
  listeners.delete(channelId);
}
