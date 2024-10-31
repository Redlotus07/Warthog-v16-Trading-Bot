// src/services/correlationEngine.ts
class CorrelationEngine {
  private correlationMatrix: Map<string, Map<string, number>> = new Map();
  private timeWindows: number[] = [1, 5, 20, 60, 250]; // Days

  async updateCorrelations(): Promise<void> {
    const assets = await this.getActiveAssets();
    
    for (const window of this.timeWindows) {
      const returns = await this.calculateReturns(assets, window);
      const correlation = this.calculateCorrelationMatrix(returns);
      
      this.correlationMatrix.set(`${window}d`, correlation);
    }
  }

  async detectRegimeChanges(): Promise<RegimeChangeDetection> {
    const currentCorrelations = this.correlationMatrix.get('1d');
    const historicalCorrelations = this.correlationMatrix.get('60d');
    
    return {
      regimeChange: this.detectSignificantChanges(currentCorrelations, historicalCorrelations),
      impactedPairs: this.findImpactedPairs(currentCorrelations, historicalCorrelations),
      riskImplications: await this.assessRiskImplications()
    };
  }

  private calculateCorrelationMatrix(returns: Map<string, number[]>): Map<string, Map<string, number>> {
    const matrix = new Map();
    const assets = Array.from(returns.keys());

    for (const asset1 of assets) {
      const correlations = new Map();
      for (const asset2 of assets) {
        if (asset1 === asset2) {
          correlations.set(asset2, 1);
          continue;
        }
        const correlation = this.calculatePearsonCorrelation(
          returns.get(asset1),
          returns.get(asset2)
        );
        correlations.set(asset2, correlation);
      }
      matrix.set(asset1, correlations);
    }

    return matrix;
  }

  private calculatePearsonCorrelation(x: number[], y: number[]): number {
    const mean = (arr: number[]) => arr.reduce((a, b) => a + b) / arr.length;
    const xMean = mean(x);
    const yMean = mean(y);
    
    const numerator = x.reduce((sum, xi, i) => 
      sum + (xi - xMean) * (y[i] - yMean), 0
    );
    
    const denominator = Math.sqrt(
      x.reduce((sum, xi) => sum + Math.pow(xi - xMean, 2), 0) *
      y.reduce((sum, yi) => sum + Math.pow(yi - yMean, 2), 0)
    );

    return numerator / denominator;
  }
}
