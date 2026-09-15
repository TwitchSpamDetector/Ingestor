import { createApp } from './app';
import { env } from './config/env';
import { logger } from './utils/logger';
import { getChannel } from './services/rabbitmq.service';

const app = createApp();

app.listen(env.PORT, () => {
  logger.info(`Ingestor escuchando en el puerto ${env.PORT}`);
});

// Conexión inicial "best effort": si RabbitMQ no está listo todavía,
// el primer mensaje de chat que llegue reintentará la conexión.
getChannel().catch((err: Error) => {
  logger.warn('No se pudo conectar a RabbitMQ al arrancar, se reintentará con el primer mensaje:', err.message);
});
