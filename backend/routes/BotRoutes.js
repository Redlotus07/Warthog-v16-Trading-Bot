// backend/routes/botRoutes.js
import express from 'express';
import { startTrading, stopTrading } from '../controllers/botController.js';

const router = express.Router();

router.post('/:botId/start', startTrading);
router.post('/:botId/stop', stopTrading);

export default router;
