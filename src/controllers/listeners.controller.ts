import { RequestHandler } from 'express';
import * as listenerService from '../services/listener.service';
import { AppError } from '../utils/AppError';

export const getListeners: RequestHandler = (_req, res) => {
  res.status(200).json(listenerService.getAllListeners());
};

export const createListener: RequestHandler = async (req, res, next) => {
  try {
    const { channelId } = req.body ?? {};

    if (typeof channelId !== 'string' || channelId.trim() === '') {
      throw new AppError(
        400,
        'VALIDATION_ERROR',
        'El campo channelId no puede estar vacío.',
        'channelId',
      );
    }

    const listener = await listenerService.createListener(channelId.trim());
    res.status(201).json(listener);
  } catch (err) {
    next(err);
  }
};

export const deleteListener: RequestHandler = async (req, res, next) => {
  try {
    await listenerService.removeListener(req.params.channelId);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
