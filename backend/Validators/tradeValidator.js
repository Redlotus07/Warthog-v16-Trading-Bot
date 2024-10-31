// backend/validators/tradeValidator.js
import { z } from 'zod';

const tradeSchema = z.object({
  pair: z.string(),
  type: z.enum(['LONG', 'SHORT']),
  entry: z.number().positive(),
  stopLoss: z.number().positive(),
  takeProfit: z.number().positive(),
  size: z.number().positive(),
  confidence: z.number().min(0).max(1),
  strategy: z.object({
    name: z.string(),
    signals: z.array(z.object({
      indicator: z.string(),
      value: z.any(),
      timestamp: z.date()
    }))
  }).optional()
});

export const validateTrade = (data) => {
  return tradeSchema.parse(data);
};
