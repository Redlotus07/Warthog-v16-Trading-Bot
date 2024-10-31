// backend/services/tradingService.js
import { Bot } from '../models/Bot.js';
import { Trade } from '../models/Trade.js';
import { mlService } from './mlService.js';
import { marketDataService } from './marketDataService.js';
import { positionSizingService } from './positionSizingService.js';
import { riskManagementService } from './riskManagementService.js';

export const executeTradingCycle = async () => {
  const bot = await Bot.findOne({ active: true });
  if (!bot) return;

  const pairs = ['BTC/USD', 'ETH/USD', 'XAU/USD', 'XAG/USD'];

  for (const pair of pairs) {
    try {
      const marketData = await marketDataService.getLatestData(pair);
      const marketCondition = await mlService.analyzeMarketCondition(pair);
      const predictionFeatures = extractPredictionFeatures(marketData, marketCondition);
      const tradeProbability = await mlService.predictTradeSuccess(pair, predictionFeatures);

      if (tradeProbability > 0.7) { // Threshold for opening a trade
        const tradeDirection = determineTradeDirection(marketCondition);
        const positionSize = await positionSizingService.calculatePositionSize(pair, bot.settings);
        const { stopLoss, takeProfit } = riskManagementService.calculateExitPoints(pair, tradeDirection, marketData.price);

        const newTrade = await Trade.create({
          pair,
          type: tradeDirection,
          entry: marketData.price,
          stopLoss,
          takeProfit,
          size: positionSize,
          status: 'OPEN'
        });

        // Execute trade on exchange
        await executeTradeOnExchange(newTrade);
      }

      // Check and update existing trades
      await updateExistingTrades(pair);

    } catch (error) {
      console.error(`Error in trading cycle for ${pair}:`, error);
      await Bot.findByIdAndUpdate(bot._id, { 
        $push: { errors: { message: error.message, timestamp: new Date() } }
      });
    }
  }
};

const updateExistingTrades = async (pair) => {
  const openTrades = await Trade.find({ pair, status: 'OPEN' });
  for (const trade of openTrades) {
    const currentPrice = await marketDataService.getCurrentPrice(pair);
    if (shouldCloseTrade(trade, currentPrice)) {
      await closeTrade(trade, currentPrice);
      await mlService.updateModel(pair, trade);
    }
  }
};

const shouldCloseTrade = (trade, currentPrice) => {
  return (trade.type === 'LONG' && currentPrice >= trade.takeProfit) ||
         (trade.type === 'SHORT' && currentPrice <= trade.takeProfit) ||
         (trade.type === 'LONG' && currentPrice <= trade.stopLoss) ||
         (trade.type === 'SHORT' && currentPrice >= trade.stopLoss);
};

const closeTrade = async (trade, currentPrice) => {
  trade.exit = currentPrice;
  trade.status = 'CLOSED';
  trade.profit = calculateProfit(trade, currentPrice);
  await trade.save();
  // Execute close trade on exchange
  await closeTradeOnExchange(trade);
};
