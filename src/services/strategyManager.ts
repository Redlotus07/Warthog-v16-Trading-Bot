// src/services/strategyManager.ts
class StrategyManager {
  private strategies: Map<string, TradingStrategy>;
  private activeStrategy: string;

  async evaluateStrategies() {
    const results = new Map<string, StrategyPerformance>();
    
    for (const [name, strategy] of this.strategies) {
      const performance = await this.backtest(strategy);
      results.set(name, performance);
    }

    return this.selectBestStrategy(results);
  }

  private async backtest(strategy: TradingStrategy) {
    const backtester = new BacktestingService();
    return await backtester.runBacktest({
      strategy,
      period: '3m',
      initialCapital: 100000
    });
  }
}
