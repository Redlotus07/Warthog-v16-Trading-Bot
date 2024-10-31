// src/services/marketMicrostructure.ts
class MarketMicrostructureAnalyzer {
  private orderBookSnapshots: OrderBookSnapshot[] = [];
  private tradeFlow: TradeFlow[] = [];
  private volatilityProfile: VolatilityProfile;

  async analyzeMarketStructure(symbol: string): Promise<MarketStructureAnalysis> {
    const [
      orderBookAnalysis,
      tradeFlowAnalysis,
      volatilityAnalysis,
      liquidityAnalysis
    ] = await Promise.all([
      this.analyzeOrderBook(symbol),
      this.analyzeTradeFlow(symbol),
      this.analyzeVolatilityProfile(symbol),
      this.analyzeLiquidityProfile(symbol)
    ]);

    return {
      timestamp: Date.now(),
      symbol,
      orderBook: orderBookAnalysis,
      tradeFlow: tradeFlowAnalysis,
      volatility: volatilityAnalysis,
      liquidity: liquidityAnalysis,
      marketImpact: this.estimateMarketImpact(orderBookAnalysis, liquidityAnalysis)
    };
  }

  private async analyzeOrderBook(symbol: string): Promise<OrderBookAnalysis> {
    return {
      bidAskSpread: this.calculateBidAskSpread(),
      depthProfile: this.calculateDepthProfile(),
      priceImpact: this.calculatePriceImpact(),
      orderBookImbalance: this.calculateOrderBookImbalance(),
      resiliency: await this.measureOrderBookResiliency()
    };
  }

  private calculateDepthProfile(): DepthProfile {
    const depthLevels = [0.1, 0.2, 0.5, 1.0, 2.0]; // Percentage from mid price
    return depthLevels.map(level => ({
      level,
      bidDepth: this.calculateCumulativeDepth('bids', level),
      askDepth: this.calculateCumulativeDepth('asks', level),
      bidOrders: this.countOrders('bids', level),
      askOrders: this.countOrders('asks', level)
    }));
  }

  private async measureOrderBookResiliency(): Promise<OrderBookResiliency> {
    const samples = await this.getSampledOrderBooks(100); // Last 100 snapshots
    return {
      recoveryTime: this.calculateRecoveryTime(samples),
      replenishmentRate: this.calculateReplenishmentRate(samples),
      stabilityScore: this.calculateStabilityScore(samples)
    };
  }
}
