// backend/services/mlService.js
import * as tf from '@tensorflow/tfjs-node';
import { Trade } from '../models/Trade.js';
import { marketDataService } from './marketDataService.js';

class MLService {
  constructor() {
    this.models = new Map();
    this.marketStates = new Map();
  }

  async initializeModel(pair) {
    const model = tf.sequential();
    model.add(tf.layers.dense({ units: 64, activation: 'relu', inputShape: [20] }));
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
      validationSplit: 0.2
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

    return prediction;
  }

  async extractPredictionFeatures(pair, marketData) {
    // Extract relevant features from market data
    // This is a simplified example and should be expanded based on your strategy
    const prices = marketData.historicalPrices.slice(-20);
    const volumes = marketData.historicalVolumes.slice(-20);
    
    return [...prices, ...volumes];
  }

  extractFeatures(trade) {
    // Extract features from a completed trade
    // This should match the structure of extractPredictionFeatures
    return [...trade.historicalPrices, ...trade.historicalVolumes];
  }

  async updateModelWithTrade(trade) {
    const pair = trade.pair;
    if (!this.models.has(pair)) {
      await this.initializeModel(pair);
    }

    const features = this.extractFeatures(trade);
    const label = trade.profit > 0 ? 1 : 0;
    
    await this.trainModel(pair, [features], [label]);
  }
}

export const mlService = new MLService();
