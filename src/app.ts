import express, { Application } from 'express';
import routes from './routes';
import { errorHandler } from './middlewares/errorHandler';
import { notFoundHandler } from './middlewares/notFoundHandler';

export function createApp(): Application {
  const app = express();

  app.use(express.json());

  // El contrato define el servidor local como http://localhost:3000/api/v1
  app.use('/api/v1', routes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
