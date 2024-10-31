// backend/api/risk.js
import express from 'express';
import { riskManagementService } from '../services/riskManagementService.js';

const router = express.Router();

router.get('/assessment/:botId', async (req, res) => {
  const botId = req.params.botId;
  const riskExposure = await riskManagementService.checkRiskExposure(botId);
  res.json(riskExposure);
});

router.get('/parameters/:botId', async (req, res) => {
  const botId = req.params.botId;
  const riskParams = await riskManagementService.getRiskParameters(botId);
  res.json(riskParams);
});

router.post('/parameters/:botId', async (req, res) => {
  const botId = req.params.botId;
  const params = req.body;
  await riskManagementService.setRiskParameters(botId, params);
  res.json({ message: 'Risk parameters updated successfully' });
});

export default router;
