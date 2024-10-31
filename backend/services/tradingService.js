// backend/services/tradingService.js
import { Bot } from '../models/Bot.js';
import { Trade } from '../models/Trade.js';
import { positionSizingService } from './positionSizingService.js';
import { marketDataService } from './marketDataService.js';
import { technicalAnalysisService } from './technicalAnalysisService.js';
import { performanceTracker } from './performanceTracking.js';

class TradingService {
  async startTrading(botId) {
    const bot = await Bot.findById(botId);
    const marketData = await marketDataService.getLatestData(bot.settings.tradingPairs[0]);
    const technicalAnalysis = technicalAnalysisService.analyzeTrend(marketData.prices);
    const positionSize = positionSizingService.calculatePosition(bot.settings.tradingPairs[0], marketData);

    // Create a new trade
    const trade = new Trade({
      bot: botId,
      pair: bot.settings.tradingPairs[0],
      type: technicalAnalysis.trend === 'UPTREND' ? 'LONG' : 'SHORT',
      entry: marketData.prices[marketData.prices.length - 1],
      stopLoss: positionSize.stopLoss,
      takeProfit: positionSize.takeProfit,
      size: positionSize.size,
      confidence: technicalAnalysis.strength
    });

    await trade.save();

    // Update bot performance metrics
    await performanceTracker.updatePerformanceMetrics(botId);

    return trade;
  }

  async closeTrade(tradeId) {
    const trade = await Trade.findByIdAndUpdate(tradeId, { status: 'CLOSED' });
    await performanceTracker.updatePerformanceMetrics(trade.bot);
    return trade;
  }
}

export const tradingService = new TradingService();
