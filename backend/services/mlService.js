import { Trade } from '../models/Trade.js';
import { marketDataService } from './marketDataService.js';
import { newsService } from './newsTrading/newsService.js';

class MLService {
  constructor() {
    this.models = new Map();
    this.marketStates = new Map();
    this.volatilityWindows = [14, 30, 60];
    this.newsImpactModels = new Map();
  }

  async analyzeMarketCondition(pair) {
    const historicalData = await marketDataService.getHistoricalData(pair);
    const volatility = this.calculateVolatility(historicalData);
    const trend = this.analyzeTrend(historicalData);
    const newsEvents = await newsService.getUpcomingEvents('24h');
    
    return {
      volatility,
      trend,
      marketState: this.determineMarketState(volatility, trend),
      newsImpact: await this.analyzeNewsImpact(pair, newsEvents)
    };
  }

  async analyzeNewsImpact(pair, events) {
    const relevantEvents = events.filter(event => 
      newsService.getAffectedPairs(event.type).includes(pair)
    );

    if (!relevantEvents.length) return { score: 0, recommendation: 'NO_ACTION' };

    const impactScores = await Promise.all(
      relevantEvents.map(event => this.predictNewsImpact(pair, event))
    );

    return {
      score: Math.max(...impactScores.map(s => s.score)),
      events: relevantEvents.map((event, i) => ({
        ...event,
        predictedImpact: impactScores[i]
      }))
    };
  }

  async predictNewsImpact(pair, event) {
    const modelKey = `${pair}_${event.type}`;
    if (!this.newsImpactModels.has(modelKey)) {
      await this.initializeNewsImpactModel(modelKey);
    }

    const model = this.newsImpactModels.get(modelKey);
    const features = await this.extractNewsFeatures(event);
    
    return {
      score: model.predict(features),
      confidence: model.getPredictionConfidence(),
      recommendedAction: this.getNewsBasedAction(model.predict(features))
    };
  }

  getNewsBasedAction(impactScore) {
    if (impactScore > 0.8) return 'STRONG_ENTRY';
    if (impactScore > 0.6) return 'CAUTIOUS_ENTRY';
    if (impactScore < 0.3) return 'AVOID_TRADING';
    return 'MONITOR';
  }

  // ... rest of the existing MLService methods ...
}

export const mlService = new MLService();