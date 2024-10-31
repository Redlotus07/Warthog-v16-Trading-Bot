// backend/services/tradingService.js
import { Bot } from '../models/Bot.js';
import { Trade } from '../models/Trade.js';
import { positionSizingService } from './positionSizingService.js';
import { marketDataService } from './marketDataService.js';
import { technicalAnalysisService } from './technicalAnalysisService.js';
import { mlService } from './mlService.js';
import { performanceTracker } from './performanceTracking.js';

class TradingService {
  async analyzeTradingOpportunity(botId, pair) {
    const bot = await Bot.findById(botId);
    const marketData = await marketDataService.getLatestData(pair);
    const technicalAnalysis = technicalAnalysisService.analyzeTrend(marketData.prices);
    
    // Get ML prediction
    const mlPrediction = await mlService.predictTradeSuccess(pair, marketData);

    // Combine technical analysis with ML prediction
    const tradeConfidence = (technicalAnalysis.strength + mlPrediction) / 2;

    if (tradeConfidence > bot.settings.minimumConfidence) {
      const tradeType = technicalAnalysis.trend === 'UPTREND' ? 'LONG' : 'SHORT';
      return this.executeTrade(botId, pair, tradeType, tradeConfidence, marketData);
    }

    return null; // No trade opportunity
  }

  async executeTrade(botId, pair, type, confidence, marketData) {
    const bot = await Bot.findById(botId);
    const positionSize = positionSizingService.calculatePosition(bot.balance, confidence, marketData.volatility);

    const trade = new Trade({
      bot: botId,
      pair,
      type,
      entry: {
        price: marketData.currentPrice,
        time: new Date()
      },
      size: positionSize.size,
      stopLoss: positionSize.stopLoss,
      takeProfit: positionSize.takeProfit,
      confidence
    });

    await trade.save();

    // Update bot's open trades
    bot.openTrades.push(trade._id);
    await bot.save();

    return trade;
  }

  async closeTrade(tradeId) {
    const trade = await Trade.findById(tradeId);
    if (!trade || trade.status === 'CLOSED') return null;

    const currentMarketData = await marketDataService.getLatestData(trade.pair);
    trade.exit = {
      price: currentMarket Data.currentPrice,
      time: new Date()
    };

    trade.status = 'CLOSED';
    await trade.save();

    // Update bot's open trades
    const bot = await Bot.findById(trade.bot);
    bot.openTrades = bot.openTrades.filter(id => id.toString() !== tradeId.toString());
    await bot.save();

    performanceTracker.updatePerformance(trade);

    return trade;
  }
}

export const tradingService = new TradingService();
