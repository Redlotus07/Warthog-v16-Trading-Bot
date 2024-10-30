import { Trade } from '../models/Trade.js';
import { validateTrade } from '../validators/tradeValidator.js';
import { calculatePosition } from '../services/positionSizing.js';
import { checkRiskLimits } from '../services/riskManagement.js';
import { liteFinanceService } from '../services/brokers/liteFinanceService.js';
import { newsService } from '../services/newsTrading/newsService.js';

export const openTrade = async (req, res) => {
  try {
    const validatedData = validateTrade(req.body);
    const userId = req.user.id;

    // Check risk limits and news conditions
    const [riskCheck, newsImpact] = await Promise.all([
      checkRiskLimits(userId, validatedData),
      newsService.analyzeNewsImpact(validatedData.newsEvent)
    ]);

    if (!riskCheck.allowed) {
      return res.status(400).json({ message: riskCheck.message });
    }

    // Calculate position size with news impact consideration
    const position = await calculatePosition(userId, {
      ...validatedData,
      newsImpact
    });

    // Place trade with broker
    const brokerTrade = await liteFinanceService.placeTrade({
      ...validatedData,
      size: position.size,
      stopLoss: position.stopLoss,
      takeProfit: position.takeProfit
    });

    // Save trade to database
    const trade = await Trade.create({
      user: userId,
      ...validatedData,
      size: position.size,
      stopLoss: position.stopLoss,
      takeProfit: position.takeProfit,
      broker: {
        orderId: brokerTrade.orderId,
        status: brokerTrade.status
      }
    });

    res.status(201).json(trade);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ... rest of the controller methods ...
