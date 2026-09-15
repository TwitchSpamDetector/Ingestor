import { Router } from 'express';
import { getListeners, createListener, deleteListener } from '../controllers/listeners.controller';

const router = Router();

router.get('/', getListeners);
router.post('/', createListener);
router.delete('/:channelId', deleteListener);

export default router;
