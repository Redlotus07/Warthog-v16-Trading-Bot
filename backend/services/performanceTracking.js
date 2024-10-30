import { Trade } from '../models/Trade.js';
import { mlService } from './mlService.js';

class PerformanceTracker {
  async analyzePerformance(userId, timeframe = '7d') {
    const trades = await this.getTradesForPeriod(userId, timeframe);
    
    const metrics = {
      totalTrades: trades.length,
      winRate: this.calculateWinRate(trades),
      profitFactor: this.calculateProfitFactor(trades),
      averageRR: this.calculateAverageRR(trades),
      sharpeRatio: this.calculateSharpeRatio(trades),
      marketConditionPerformance: await this.analyzeMarketConditionPerformance(trades)
    };

    // Update ML models with new performance data
    await this.updateMLModels(trades);

    return metrics;
  }

  async getTradesForPeriod(userId, timeframe) {
    const startDate = this.getStartDate(timeframe);
    
    return Trade.find({
      user: userId,
      'exit.time': { $gte: startDate }
    }).sort({ 'exit.time': -1 });
  }

  calculateWinRate(trades) {
    const winningTrades = trades.filter(t => t.profit > 0);
    return (winningTrades.length / trades.length) * 100;
  }

  calculateProfitFactor(trades) {
    const grossProfit = trades
      .filter(t => t.profit > 0)
      .reduce((sum, t) => sum + t.profit, 0);
    
    const grossLoss = Math.abs(trades
      .filter(t => t.profit < 0)
      .reduce((sum, t) => sum + t.profit, 0));
    
    return grossLoss === 0 ? grossProfit : grossProfit / grossLoss;
  }

  calculateSharpeRatio(trades) {
    const returns = trades.map(t => t.profit);
    const avgReturn = returns.reduce((sum, r) => sum + r, 0) / returns.length;
    const stdDev = Math.sqrt(
      returns.reduce((sum, r) => sum + Math.pow(r - avgReturn, 2), 0) / returns.length
    );
    
    return stdDev === 0 ? 0 : (avgReturn / stdDev) * Math.sqrt(252);
  }

  async analyzeMarketConditionPerformance(trades) {
    const performance = {
      HIGH_VOLATILITY: { trades: 0, winRate: 0 },
      NORMAL: { trades: 0, winRate: 0 },
      LOW_VOLATILITY: { trades: 0, winRate: 0 }
    };

    for (const trade of trades) {
      const condition = trade.strategy.marketCondition;
      performance[condition].trades++;
      if (trade.profit > 0) {
        performance[condition].winRate++;
      }
    }

    // Calculate win rates
    Object.keys(performance).forEach(condition => {
      if (performance[condition].trades > 0) {
        performance[condition].winRate = 
          (performance[condition].winRate / performance[condition].trades) * 100;
      }
    });

    return performance;
  }

  async updateMLModels(trades) {
    for (const trade of trades) {
      await mlService.updateModel(trade.pair, trade);
    }
  }

  getStartDate(timeframe) {
    const now = new Date();
    switch (timeframe) {
      case '1d': return new Date(now.setDate(now.getDate() - 1));
      case '7d': return new Date(now.setDate(now.getDate() - 7));
      case '30d': return new Date(now.setDate(now.getDate() - 30));
      default: return new Date(now.setDate(now.getDate() - 7));
    }
  }
}

export const performanceTracker = new PerformanceTracker();
