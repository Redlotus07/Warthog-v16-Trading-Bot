// backend/services/riskManagementService.js
import { Bot } from '../models/Bot.js';
import { Trade } from '../models/Trade.js';

class RiskManagementService {
  constructor() {
    this.maximumDrawdown = -5; // 5% maximum drawdown
    this.maximumRiskPerTrade = 2; // 2% maximum risk per trade
  }

  async checkRiskExposure() {
    const bot = await Bot.findOne({ active: true });
    if (!bot) return true;

    const openTrades = await Trade.find({ status: 'OPEN' });
    const totalRisk = openTrades.reduce((acc, trade) => acc + trade.risk, 0);

    return totalRisk <= this.maximumRiskPerTrade * bot.balance;
  }

  async checkDrawdownLevels() {
    const bot = await Bot.findOne({ active: true });
    if (!bot) return { passed: true, reason: '' };

    const currentBalance = bot.balance;
    const peakBalance = bot.peakBalance;

    const drawdown = (peakBalance - currentBalance) / peakBalance * 100;

    return {
      passed: drawdown <= this.maximumDrawdown,
      reason: `Drawdown level: ${drawdown.toFixed(2)}%`
    };
  }

  async adjustRiskParameters(bot, metrics) {
    // Adjust risk parameters based on performance metrics
    // Implementation details...
  }
}

export const riskManagementService = new RiskManagementService();
