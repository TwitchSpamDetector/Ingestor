import { ErrorRequestHandler } from 'express';
import { AppError } from '../utils/AppError';
import { ErrorResponse } from '../types/errorResponse';
import { logger } from '../utils/logger';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler: ErrorRequestHandler = (err, req, res, _next) => {
  const timestamp = new Date().toISOString();

  if (err instanceof AppError) {
    const body: ErrorResponse = {
      status: err.status,
      error: err.error,
      message: err.message,
      field: err.field,
      path: req.originalUrl,
      timestamp,
    };
    res.status(err.status).json(body);
    return;
  }

  logger.error('Error no controlado:', err);

  const body: ErrorResponse = {
    status: 500,
    error: 'INTERNAL_ERROR',
    message: 'Ocurrió un error inesperado en el servidor.',
    field: null,
    path: req.originalUrl,
    timestamp,
  };
  res.status(500).json(body);
};
