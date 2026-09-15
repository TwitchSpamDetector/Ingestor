import amqp, { Channel, ChannelModel } from 'amqplib';
import { env } from '../config/env';
import { logger } from '../utils/logger';

let connection: ChannelModel | null = null;
let channel: Channel | null = null;

/**
 * Devuelve el canal de RabbitMQ, conectando de forma perezosa la primera
 * vez que se necesita. Si la conexión se cae, el siguiente mensaje que
 * intente publicarse vuelve a conectar (ver moderationClient.service.ts).
 */
export async function getChannel(): Promise<Channel> {
  if (channel) return channel;

  connection = await amqp.connect(env.RABBITMQ_URL);
  channel = await connection.createChannel();
  await channel.assertQueue(env.MODERATION_QUEUE, { durable: true });

  connection.on('close', () => {
    logger.warn('Conexión con RabbitMQ cerrada.');
    connection = null;
    channel = null;
  });

  connection.on('error', (err: Error) => {
    logger.error('Error en la conexión con RabbitMQ:', err.message);
  });

  logger.info(`Conectado a RabbitMQ (${env.RABBITMQ_URL}), cola "${env.MODERATION_QUEUE}"`);
  return channel;
}
