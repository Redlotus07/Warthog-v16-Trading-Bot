// backend/services/mlService.js
import * as tf from '@tensorflow/tfjs-node';
import { Trade } from '../models/Trade.js';
import { marketDataService } from './marketDataService.js';

class MLService {
  constructor() {
    this.models = new Map();
    this.marketStates = new Map();
    this.indicators = new Map();
  }

  async initializeModel(pair) {
    // Enhanced model architecture
    const model = tf.sequential();
    model.add(tf.layers.dense({ 
      units: 128, 
      activation: 'relu', 
      inputShape: [20] // Increased input features
    }));
    model.add(tf.layers.dropout({ rate: 0.2 }));
    model.add(tf.layers.dense({ units: 64, activation: 'relu' }));
    model.add(tf.layers.dropout({ rate: 0.2 }));
    model.add(tf.layers.dense({ units: 32, activation: 'relu' }));
    model.add(tf.layers.dense({ units: 1, activation: 'sigmoid' }));
    
    model.compile({ 
      optimizer: tf.train.adam(0.001),
      loss: 'binaryCrossentropy',
      metrics: ['accuracy']
    });

    this.models.set(pair, model);
    await this.loadHistoricalData(pair);
  }

  async loadHistoricalData(pair) {
    // Load and preprocess historical data for initial training
    const historicalTrades = await Trade.find({ pair }).sort('-createdAt').limit(1000);
    if (historicalTrades.length > 0) {
      const features = historicalTrades.map(trade => this.extractFeatures(trade));
      const labels = historicalTrades.map(trade => trade.profit > 0 ? 1 : 0);
      
      await this.trainModel(pair, features, labels);
    }
  }

  async trainModel(pair, features, labels) {
    const model = this.models.get(pair);
    if (!model) return;

    const xs = tf.tensor2d(features);
    const ys = tf.tensor2d(labels.map(l => [l]));

    await model.fit(xs, ys, {
      epochs: 10,
      batchSize: 32,
      shuffle: true,
      validationSplit: 0.2,
      callbacks: {
        onEpochEnd: (epoch, logs) => {
          console.log(`Training epoch ${epoch + 1}: loss = ${logs.loss.toFixed(4)}, accuracy = ${logs.acc.toFixed(4)}`);
        }
      }
    });

    xs.dispose();
    ys.dispose();
  }

  async predictTradeSuccess(pair, marketData) {
    if (!this.models.has(pair)) {
      await this.initializeModel(pair);
    }

    const features = await this.extractPredictionFeatures(pair, marketData);
    const model = this.models.get(pair);
    
    const prediction = tf.tidy(() => {
      const tensor = tf.tensor2d([features]);
      const result = model.predict(tensor);
      return result.dataSync()[0];
    });

    return {
      probability: prediction,
      confidence: this.calculateConfidence(prediction, marketData.volatility)
    };
  }

  async extractPredictionFeatures(pair, marketData) {
    const technicalIndicators = await this.calculateIndicators(pair, marketData);
    const marketState = await this.analyzeMarketState(pair);
    
    return [
      marketData.price,
      marketData.volume,
      marketData.volatility,
      ...technicalIndicators.macd,
      ...technicalIndicators.rsi,
      ...technicalIndicators.bollinger,
      marketState.trendStrength,
      marketState.volatilityScore,
      marketState.momentum
    ];
  }

  async calculateIndicators(pair, marketData) {
    // Calculate technical indicators
    const prices = marketData.historicalPrices;
    
    return {
      macd: this.calculateMACD(prices),
      rsi: this.calculateRSI(prices),
      bollinger: this.calculateBollingerBands(prices)
    };
  }

  calculateMACD(prices, short = 12, long = 26, signal = 9) {
    // MACD calculation implementation
    // Returns [macdLine, signalLine, histogram]
    // Implementation details...
  }

  calculateRSI(prices, period = 14) {
    // RSI calculation implementation
    // Returns [rsi, oversold, overbought]
    // Implementation details...
  }

  calculateBollingerBands(prices, period = 20, stdDev = 2) {
    // Bollinger Bands calculation implementation
    // Returns [upper, middle, lower, bandwidth]
    // Implementation details...
  }

  async analyzeMarketState(pair) {
    const marketData = await marketDataService.getLatestData(pair);
    const volatility = this.calculateVolatility(marketData.historicalPrices);
    const trend = this.analyzeTrend(marketData.historicalPrices);
    
    return {
      trendStrength: trend.strength,
      volatilityScore: volatility.score,
      momentum: this.calculateMomentum(marketData.historicalPrices)
    };
  }

  calculateConfidence(prediction, volatility) {
    // Adjust confidence based on prediction probability and market volatility
    const volatilityFactor = Math.max(0, 1 - volatility);
    const baseConfidence = Math.abs(prediction - 0.5) * 2;
    return baseConfidence * volatilityFactor;
  }

  async updateModelWithTrade(trade) {
    const pair = trade.pair;
    if (!this.models.has(pair)) {
      await this.initializeModel(pair);
    }

    const features = await this.extractPredictionFeatures(pair, {
      price: trade.entry.price,
      volume: trade.volume,
      volatility: trade.marketConditions.volatility,
      historicalPrices: trade.marketConditions.historicalPrices
    });

    const label = trade.profit > 0 ? 1 : 0;
    
    await this.trainModel(pair, [features], [label]);
    
    // Update market state analysis
    this.updateMarketStateAnalysis(pair, trade);
  }

  updateMarketStateAnalysis(pair, trade) {
    // Update market state analysis based on trade outcome
    const currentState = this.marketStates.get(pair) || {
      successfulConditions: new Map(),
      failedConditions: new Map()
    };

    const conditions = trade.marketConditions;
    const outcome = trade.profit > 0 ? 'successfulConditions' : 'failedConditions';
    
    Object.entries(conditions).forEach(([condition, value]) => {
      const conditionMap = currentState[outcome];
      const count = conditionMap.get(condition) || 0;
      conditionMap.set(condition, count + 1);
    });

    this.marketStates.set(pair, currentState);
  }
}

export const mlService = new MLService();
