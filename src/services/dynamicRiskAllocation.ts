// src/services/dynamicRiskAllocation.ts
class DynamicRiskAllocator {
   private readonly riskBudget: number = 0.05; // 5% risk budget
   private readonly maxPositionSize: number = 0.1; // 10% of portfolio
   private readonly minPositionSize: number = 0.01; // 1% of portfolio

   async allocateRisk(
     portfolio: Portfolio,
     marketConditions: MarketConditions,
     signals: TradeSignal[]
   ): Promise<RiskAllocationResult> {
     const [
       volatilityAdjustment,
       correlationAdjustment,
       marketRegimeAdjustment,
       liquidityAdjustment
     ] = await Promise.all([
       this.calculateVolatilityAdjustment(marketConditions),
       this.calculateCorrelationAdjustment(signals, portfolio),
       this.calculateMarketRegimeAdjustment(marketConditions),
       this.calculateLiquidityAdjustment(marketConditions)
     ]);

     const baseRisk = this.calculateBaseRisk(portfolio.equity);
     const adjustedRisk = baseRisk * 
       volatilityAdjustment *
       correlationAdjustment *
       marketRegimeAdjustment *
       liquidityAdjustment;

     const positionSizes = signals.map(signal => {
       const size = Math.min(
         adjustedRisk * signal.confidence,
         this.maxPositionSize * portfolio.equity
       );
       return Math.max(size, this.minPositionSize * portfolio.equity);
     });

     return {
       positionSizes,
       riskMetrics: await this.calculateRiskMetrics(positionSizes, signals)
     };
   }

   private async calculateVolatilityAdjustment(conditions: MarketConditions): Promise<number> {
     const volatility = await this.getHistoricalVolatility(conditions.symbol, 20);
     const relativeVolatility = volatility / this.getAverageVolatility(conditions.symbol);
     
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

   private async calculateRiskMetrics(positionSizes: number[], signals: TradeSignal[]): Promise<RiskMetrics> {
     return {
       valueAtRisk: await this.calculateVaR(positionSizes, signals),
       expectedShortfall: await this.calculateExpectedShortfall(positionSizes, signals),
       maxDrawdown: await this.estimateMaxDrawdown(positionSizes, signals),
       stressTestResults: await this.runStressTests(positionSizes, signals)
     };
   }
}
