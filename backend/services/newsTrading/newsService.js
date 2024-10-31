import axios from 'axios';
import { mlService } from '../mlService.js';
import { performanceTracker } from '../performanceTracking.js';

class NewsService {
  constructor() {
    this.newsProviders = [
      {
        name: 'ForexFactory',
        url: process.env.FOREX_FACTORY_API_URL
      },
      {
        name: 'Investing.com',
        url: process.env.INVESTING_API_URL
      }
    ];
  }

  async getUpcomingEvents(timeframe = '24h') {
    const events = await Promise.all(
      this.newsProviders.map(provider => this.fetchEvents(provider))
    );

    return this.mergeAndSortEvents(events.flat());
  }

  async analyzeNewsImpact(event) {
    const historicalImpact = await this.getHistoricalImpact(event.type);
    const marketCondition = await mlService.analyzeMarketCondition('ALL');
    
    return {
      expectedVolatility: this.calculateExpectedVolatility(historicalImpact),
      recommendedAction: this.getTradeRecommendation(event, market
