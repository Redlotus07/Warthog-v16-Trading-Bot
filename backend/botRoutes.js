// backend/routes/botRoutes.js
import express from 'express';
import { toggleBot, shutdownBot, getBotStatus } from '../controllers/botController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply authentication middleware to all bot routes
router.use(authMiddleware);

// GET bot status
router.get('/status', getBotStatus);

// POST toggle bot status
router.post('/toggle', toggleBot);

// POST immediate shutdown
router.post('/shutdown', shutdownBot);

export default router;
