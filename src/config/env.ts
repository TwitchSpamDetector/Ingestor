import dotenv from 'dotenv';

dotenv.config();

export const env = {
  PORT: Number(process.env.PORT ?? 3000),

  // Si vienen vacías, listener.service.ts conecta el cliente de tmi.js
  // en modo anónimo (solo lectura).
  TWITCH_USERNAME: process.env.TWITCH_USERNAME || undefined,
  TWITCH_OAUTH_TOKEN: process.env.TWITCH_OAUTH_TOKEN || undefined,

  RABBITMQ_URL: process.env.RABBITMQ_URL ?? 'amqp://localhost:5672',
  MODERATION_QUEUE: process.env.MODERATION_QUEUE ?? 'chat-messages',
};
