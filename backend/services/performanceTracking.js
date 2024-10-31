// backend/services/performanceTracking.js
import { Bot } from '../models/Bot.js';
import { Trade } from '../models/Trade.js';

class PerformanceTracker {
  async updatePerformanceMetrics(botId) {
    const trades = await Trade.find({ status: 'CLOSED' })
      .sort('-exitTime')
      .limit(100);

    const metrics = this.calculateMetrics(trades);
    
    await Bot.findByIdAndUpdate(botId, {
      'performance.totalTrades': metrics.totalTrades,
      'performance.winRate': metrics.winRate,
      'performance.profitFactor': metrics.profitFactor,
      'performance.averageWin': metrics.averageWin,
      'performance.averageLoss': metrics.averageLoss
    });

    return metrics;
  }

  calculateMetrics(trades) {
    const winningTrades = trades.filter(t => t.profit > 0);
    const losingTrades = trades.filter(t => t. profit < 0);

    const totalTrades = trades.length;
    const winRate = (winningTrades.length / totalTrades) * 100;
    const profitFactor = winningTrades.reduce((acc, t) => acc + t.profit, 0) / losingTrades.reduce((acc, t) => acc + Math.abs(t.profit), 0);
    const averageWin = winningTrades.reduce((acc, t) => acc + t.profit, 0) / winningTrades.length;
    const averageLoss = losingTrades.reduce((acc, t) => acc + Math.abs(t.profit), 0) / losingTrades.length;

    return {
      totalTrades,
      winRate,
      profitFactor,
      averageWin,
      averageLoss
    };
  }
}

export const performanceTracker = new PerformanceTracker();
