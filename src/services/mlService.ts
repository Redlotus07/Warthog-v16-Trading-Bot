// src/services/mlService.ts
import * as tf from '@tensorflow/tfjs-node';
import { MarketData, PredictionResult } from '../types';

class MLService {
  private models: Map<string, tf.LayersModel> = new Map();
  private modelConfigs: Map<string, ModelConfig> = new Map();

  async initialize() {
    // Load pre-trained models for different strategies
    await this.loadModels([
      'trend_predictor',
      'volatility_predictor',
      'reversal_detector'
    ]);
  }

  async predictMarketMovement(data: MarketData): Promise<PredictionResult> {
    const features = this.preprocessData(data);
    const predictions = await Promise.all([
      this.models.get('trend_predictor')?.predict(features),
      this.models.get('volatility_predictor')?.predict(features),
      this.models.get('reversal_detector')?.predict(features)
    ]);

    return this.aggregatePredictions(predictions);
  }

  private preprocessData(data: MarketData) {
    // Normalize and prepare data for ML models
    return tf.tensor2d([
      data.price,
      data.volume,
      data.rsi,
      data.macd,
      // Add more technical indicators
    ]);
  }

  async retrainModels(newData: MarketData[]) {
    // Implement online learning for model adaptation
    for (const [name, model] of this.models) {
      const config = this.modelConfigs.get(name);
      await this.trainModel(model, newData, config);
    }
  }
}
