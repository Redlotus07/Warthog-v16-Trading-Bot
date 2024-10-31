// src/services/signalGeneration/signalGenerator.ts
class SignalGenerator {
  private mlModel: DeepLearningModel;
  private technicalAnalyzer: TechnicalAnalyzer;
  private sentimentAnalyzer: SentimentAnalyzer;
  private regimeDetector: MarketRegimeDetector;

  async generateSignals(symbol: string): Promise<TradingSignal[]> {
    const [
      mlSignals,
      technicalSignals,
      sentimentSignals,
      regimeSignals
    ] = await Promise.all([
      this.generateMLSignals(symbol),
      this.generateTechnicalSignals(symbol),
      this.generateSentimentSignals(symbol),
      this.generateRegimeBasedSignals(symbol)
    ]);

    return this.combineSignals([
      mlSignals,
      technicalSignals,
      sentimentSignals,
      regimeSignals
    ]);
  }

  private async generateMLSignals(symbol: string): Promise<MLSignal[]> {
    const features = await this.extractFeatures(symbol);
    const predictions = await this.mlModel.predict(features);
    
    return this.interpretMLPredictions(predictions, features);
  }

  private async generateTechnicalSignals(symbol: string): Promise<TechnicalSignal[]> {
    const indicators = await this.technicalAnalyzer.calculateIndicators(symbol);
    const patterns = await this.technicalAnalyzer.detectPatterns(symbol);
    
    return this.combineTechnicalSignals(indicators, patterns);
  }

  private async generateSentimentSignals(symbol: string): Promise<SentimentSignal[]> {
    const [
      newsAnalysis,
      socialMediaAnalysis,
      marketSentiment
    ] = await Promise.all([
      this.sentimentAnalyzer.analyzeNews(symbol),
      this.sentimentAnalyzer.analyzeSocialMedia(symbol),
       this.sentimentAnalyzer.getMarketSentiment(symbol)
    ]);

    return this.combineSentimentSignals([
      newsAnalysis,
      socialMediaAnalysis,
      marketSentiment
    ]);
  }

  private async generateRegimeBasedSignals(symbol: string): Promise<RegimeSignal[]> {
    const regime = await this.regimeDetector.detectRegime(symbol);
    const regimeSignals = await this.generateSignalsForRegime(regime, symbol);
    
    return regimeSignals;
  }
}
