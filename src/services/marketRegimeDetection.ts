// src/services/marketRegimeDetection.ts
class MarketRegimeDetector {
  private readonly hiddenStates = 5; // Number of market regimes
  private hmm: HiddenMarkovModel;
  private features: FeatureExtractor;

  async detectRegime(marketData: MarketData): Promise<RegimeAnalysis> {
    const features = await this.features.extract(marketData);
    const currentRegime = await this.hmm.predict(features);
    
    return {
      regime: this.classifyRegime(currentRegime),
      probability: await this.calculateRegimeProbability(features),
      transitionMatrix: await this.getTransitionProbabilities(),
      regimeCharacteristics: this.getRegimeCharacteristics(currentRegime)
    };
  }

  private async trainModel(historicalData: MarketData[]): Promise<void> {
    const features = await Promise.all(
      historicalData.map(data => this.features.extract(data))
    );

    await this.hmm.fit(features, {
      nIterations: 100,
      tolerance: 1e-6,
      randomState: 42
    });
  }

  private classifyRegime(state: number): MarketRegime {
    const regimes: MarketRegime[] = [
      'TRENDING_UP',
      'TRENDING_DOWN',
      'RANGING',
      'VOLATILE',
      'TRANSITIONING'
    ];
    return regimes[state];
  }

  private async calculateRegimeProbability(features: number[]): Promise<RegimeProbabilities> {
    const probabilities = await this.hmm.predictProbability(features);
    
    return {
      current: Math.max(...probabilities),
      distribution: probabilities,
      confidence: this.calculateConfidence(probabilities)
    };
  }
}
