// backend/services/mlService.ts
import * as tf from '@tensorflow/tfjs-node';
import { Trade } from '../models/Trade';

class MLService {
  private models: Map<string, tf.LayersModel> = new Map();

  async initializeModel(pair: string) {
    const model = tf.sequential();
    model.add(tf.layers.dense({ units: 64, activation: 'relu', inputShape: [10] }));
    model.add(tf.layers.dense({ units: 32, activation: 'relu' }));
    model.add(tf.layers.dense({ units: 1, activation: 'sigmoid' }));
    model.compile({ optimizer: 'adam', loss: 'binaryCrossentropy', metrics: ['accuracy'] });
    this.models.set(pair, model);
  }

  async predictTradeSuccess(pair: string, features: number[]): Promise<number> {
    if (!this.models.has(pair)) {
      await this.initializeModel(pair);
    }
    const model = this.models.get(pair)!;
    const prediction = model.predict(tf.tensor2d([features])) as tf.Tensor;
    return prediction.dataSync()[0];
  }

  async updateModel(pair: string, trade: any) {
    const features = this.extractFeatures(trade);
    const label = trade.profit > 0 ? 1 : 0;
    
    if (!this.models.has(pair)) {
      await this.initializeModel(pair);
    }
    
    const model = this.models.get(pair)!;
    await model.fit(tf.tensor2d([features]), tf.tensor2d([[label]]), {
      epochs: 1,
      verbose: 0
    });
  }

  private extractFeatures(trade: any): number[] {
    // Extract relevant features from the trade
    // This is a simplified example; you should expand this based on your specific needs
    return [
      trade.entry,
      trade.exit || 0,
      trade.size,
      trade.leverage || 1,
      // Add more features like market indicators, time of day, etc.
    ];
  }

  async analyzeMarketCondition(pair: string) {
    // Implement market condition analysis
    // This could include technical indicators, sentiment analysis, etc.
    return {
      trend: 'BULLISH',
      volatility: 'MEDIUM',
      sentiment: 'POSITIVE'
    };
  }
}

export const mlService = new MLService();
