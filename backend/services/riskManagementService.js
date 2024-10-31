// backend/services/riskManagementService.js
import { Bot } from '../models/Bot.js';
import { Trade } from '../models/Trade.js';
import { marketDataService } from './marketDataService.js';

class RiskManagementService {
  constructor() {
    this.defaultRiskParams = {
      maxDrawdown: 5, // 5% maximum drawdown
      maxRiskPerTrade: 2, // 2% maximum risk per trade
      maxDailyLoss: 5, // 5% maximum daily loss
      maxOpenTrades: 5 // Maximum number of open trades
    };
  }

  async getRiskParameters(botId) {
    const bot = await Bot.findById(botId);
    return {
      ...this.defaultRiskParams,
      ...bot.riskParameters
    };
  }

  async setRiskParameters(botId, params) {
    const bot = await Bot.findById(botId);
    bot.riskParameters = {
      ...bot.riskParameters,
      ...params
    };
    await bot.save();
    return bot.riskParameters;
  }

  async checkRiskExposure(botId) {
    const bot = await Bot.findById(botId);
    const riskParams = await this.getRiskParameters(botId);
    const openTrades = await Trade.find({ bot: botId, status: 'OPEN' });

    const totalRisk = openTrades.reduce((acc, trade) => acc + this.calculateTradeRisk(trade), 0);
    const drawdown = this.calculateDrawdown(bot);
    const dailyLoss = await this.calculateDailyLoss(botId);

    return {
      isWithinLimits: totalRisk <= riskParams.maxRiskPerTrade * bot.balance &&
                      drawdown <= riskParams.maxDrawdown &&
                      dailyLoss <= riskParams.maxDailyLoss &&
                      openTrades.length < riskParams.maxOpenTrades,
      currentRisk: totalRisk,
      currentDrawdown: drawdown,
      currentDailyLoss: dailyLoss,
      openTradesCount: openTrades.length
    };
  }

  calculateTradeRisk(trade) {
    return (trade.entry.price - trade.stopLoss) * trade.size;
  }

  calculateDrawdown(bot) {
    return (bot.peakBalance - bot.balance) / bot.peakBalance * 100;
  }

  async calculateDailyLoss(botId) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const trades = await Trade.find({
      bot: botId,
      status: 'CLOSED',
      'exit.time': { $gte: today }
    });

    const dailyLoss = trades.reduce((acc, trade) => acc + (trade.profit < 0 ? trade.profit : 0), 0);
    return Math.abs(dailyLoss);
  }

  async assessTrade(botId, tradeDetails) {
    const riskExposure = await this.checkRiskExposure(botId);
    const riskParams = await this.getRiskParameters(botId);

    if (!riskExposure.isWithinLimits) {
      return { approved: false, reason: 'Risk limits exceeded' };
    }

    const tradeRisk = this.calculateTradeRisk(tradeDetails);
    const bot = await Bot.findById(botId);

    if (tradeRisk > riskParams.maxRiskPerTrade * bot.balance / 100) {
      return { approved: false, reason: 'Trade risk exceeds maximum allowed risk per trade' };
    }

    return { approved: true };
  }

  async getMarketVolatility(pair) {
    const marketData = await marketDataService.getLatestData(pair);
    // Implement volatility calculation based on market data
    // This is a simplified example
    return marketData.volatility || 1;
  }
}

export const riskManagementService = new RiskManagementService();
