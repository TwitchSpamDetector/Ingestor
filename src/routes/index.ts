import { Router } from 'express';
import listenersRoutes from './listeners.routes';
import healthRoutes from './health.routes';

const router = Router();

router.use('/listeners', listenersRoutes);
router.use('/health', healthRoutes);

export default router;
