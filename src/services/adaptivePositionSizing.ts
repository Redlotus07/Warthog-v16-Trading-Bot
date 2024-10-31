// src/services/adaptivePositionSizing.ts
class AdaptivePositionSizer {
  private volatilityWindow: number = 20;
  private confidenceThreshold: number = 0.75;
  private maxPositionSize: number = 0.1; // 10% of portfolio

  async calculateOptimalSize(
    signal: TradeSignal,
    portfolio: Portfolio,
    marketConditions: MarketConditions
  ): Promise<PositionSizeResult> {
    const [
      volatilityAdjustment,
      correlationAdjustment,
      marketRegimeAdjustment,
      liquidityAdjustment
    ] = await Promise.all([
      this.calculateVolatilityAdjustment(signal.symbol),
      this.calculateCorrelationAdjustment(signal.symbol, portfolio),
      this.calculateMarketRegimeAdjustment(marketConditions),
      this.calculateLiquidityAdjustment(signal.symbol)
    ]);

    const baseSize = this.calculateBaseSize(portfolio.equity);
    const adjustedSize = baseSize * 
      volatilityAdjustment *
      correlationAdjustment *
      marketRegimeAdjustment *
      liquidityAdjustment;

    return {
      size: Math.min(adjustedSize, this.maxPositionSize * portfolio.equity),
      adjustments: {
        volatility: volatilityAdjustment,
        correlation: correlationAdjustment,
        marketRegime: marketRegimeAdjustment,
        liquidity: liquidityAdjustment
      },
      riskMetrics: await this.calculateRiskMetrics(adjustedSize, signal)
    };
  }

  private async calculateVolatilityAdjustment(symbol: string): Promise<number> {
    const volatility = await this.getHistoricalVolatility(symbol, this.volatilityWindow);
    const relativeVolatility = volatility / this.getAverageVolatility(symbol);
    
    return Math.exp(-relativeVolatility + 1); // Exponential decay for high volatility
  }

  private async calculateMarketRegimeAdjustment(conditions: MarketConditions): Promise<number> {
    const regimeClassification = await this.classifyMarketRegime(conditions);
    
    const adjustments = {
      TRENDING_UP: 1.2,
      TRENDING_DOWN: 0.8,
      RANGING: 0.9,
      VOLATILE: 0.6,
      UNCERTAIN: 0.5
    };

    return adjustments[regimeClassification];
  }

  private async calculateRiskMetrics(size: number, signal: TradeSignal): Promise<RiskMetrics> {
    return {
      valueAtRisk: await this.calculateVaR(size, signal),
      expectedShortfall: await this.calculateExpectedShortfall(size, signal),
      maxDrawdown: await this.estimateMaxDrawdown(size, signal),
      stressTestResults: await this.runStressTests(size, signal)
    };
  }
}
