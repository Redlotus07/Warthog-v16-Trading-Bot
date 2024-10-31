// backend/services/mlService.js
import * as tf from '@tensorflow/tfjs-node';
import { technicalAnalysisService } from './technicalAnalysisService.js';
import { marketDataService } from './marketDataService.js';

class MLService {
  constructor() {
    this.models = new Map();
    this.featureEngineers = new Map();
    this.modelConfig = {
      lstm: {
        units: 50,
        timeSteps: 60,
        features: 15,
        dropout: 0.2
      },
      training: {
        epochs: 100,
        batchSize: 32,
        validationSplit: 0.2
      }
    };
  }

  async initialize() {
    // Initialize models for each trading pair
    const pairs = await marketDataService.getTradingPairs();
    for (const pair of pairs) {
      await this.initializeModel(pair);
    }
  }

  async initializeModel(pair) {
    const model = tf.sequential();
    
    // LSTM layer for sequence processing
    model.add(tf.layers.lstm({
      units: this.modelConfig.lstm.units,
      returnSequences: true,
      inputShape: [this.modelConfig.lstm.timeSteps, this.modelConfig.lstm.features]
    }));
    
    model.add(tf.layers.dropout({ rate: this.modelConfig.lstm.dropout }));
    
    // Second LSTM layer
    model.add(tf.layers.lstm({
      units: Math.floor(this.modelConfig.lstm.units / 2),
      returnSequences: false
    }));
    
    model.add(tf.layers.dropout({ rate: this.modelConfig.lstm.dropout }));
    
    // Dense output layers
    model.add(tf.layers.dense({ units: 20, activation: 'relu' }));
    model.add(tf.layers.dense({ units: 3, activation: 'softmax' })); // Output: Buy, Sell, Hold

    model.compile({
      optimizer: tf.train.adam(0.001),
      loss: 'categoricalCrossentropy',
      metrics: ['accuracy']
    });

    this.models.set(pair, model);
    this.featureEngineers.set(pair, new FeatureEngineer(pair));
  }

  async predictTradeSuccess(pair, marketData) {
    const model = this.models.get(pair);
    if (!model) {
      throw new Error(`No model initialized for ${pair}`);
    }

    const featureEngineer = this.featureEngineers.get(pair);
    const features = await featureEngineer.engineerFeatures(marketData);
    
    const tensorData = tf.tensor3d([features], [1, this.modelConfig.lstm.timeSteps, this.modelConfig.lstm.features]);
    const prediction = model.predict(tensorData);
    
    const [buy, sell, hold] = await prediction.data();
    tensorData.dispose();
    prediction.dispose();

    return {
      buy,
      sell,
      hold,
      confidence: Math.max(buy, sell, hold)
    };
  }

  async trainModel(pair, historicalData) {
    const model = this.models.get(pair);
    const featureEngineer = this.featureEngineers.get(pair);
    
    const { features, labels } = await featureEngineer.prepareTrainingData(historicalData);
    
    const tensorFeatures = tf.tensor3d(features);
    const tensorLabels = tf.tensor2d(labels);

    await model.fit(tensorFeatures, tensorLabels, {
      epochs: this.modelConfig.training.epochs,
      batchSize: this.modelConfig.training.batchSize,
      validationSplit: this.modelConfig.training.validationSplit,
      callbacks: {
        onEpochEnd: (epoch, logs) => {
          console.log(`Epoch ${epoch}: loss = ${logs.loss.toFixed(4)}, accuracy = ${logs.acc.toFixed(4)}`);
        }
      }
    });

    tensorFeatures.dispose();
    tensorLabels.dispose();
  }
}

class FeatureEngineer {
  constructor(pair) {
    this.pair = pair;
    this.technicalIndicators = [
      'rsi',
      'macd',
      'bollinger',
      'atr',
      'obv'
    ];
  }

  async engineerFeatures(marketData) {
    const features = [];
    
    // Price data
    features.push(
      marketData.close,
      marketData.volume,
      marketData.high,
      marketData.low
    );

    // Technical indicators
    const technicalData = await this.calculateTechnicalIndicators(marketData);
    features.push(...technicalData);

    // Market sentiment features
    const sentimentFeatures = await this.calculateSentimentFeatures(marketData);
    features.push(...sentimentFeatures);

    // Volatility features
    const volatilityFeatures = this.calculateVolatilityFeatures(marketData);
    features.push(...volatilityFeatures);

    return features;
  }

  async calculateTechnicalIndicators(marketData) {
    const indicators = [];
    
    // RSI
    const rsi = await technicalAnalysisService.calculateRSI(marketData.prices);
    indicators.push(rsi[rsi.length - 1]);

    // MACD
    const macd = await technicalAnalysisService.calculateMACD(marketData.prices);
    indicators.push(
      macd.MACD[macd.MACD.length - 1],
      macd.signal[macd.signal.length - 1]
    );

    // Bollinger Bands
    const bb = await technicalAnalysisService.calculateBollingerBands(marketData.prices);
    indicators.push(
      bb.upper[bb.upper.length - 1],
      bb.middle[bb.middle.length - 1],
      bb.lower[bb.lower.length - 1]
    );

    return indicators;
  }

  async calculateSentimentFeatures(marketData) {
    // Implement market sentiment analysis
    // This could include news sentiment, social media sentiment, etc.
    return [0, 0, 0]; // Placeholder
  }

  calculateVolatilityFeatures(marketData) {
    const returns = this.calculateReturns(marketData.prices);
    const volatility = this.calculateVolatility(returns);
    const momentum = this.calculateMomentum(returns);
    
    return [volatility, momentum];
  }

  calculateReturns(prices) {
    const returns = [];
    for (let i = 1; i < prices.length; i++) {
      returns.push((prices[i] - prices[i-1]) / prices[i-1]);
    }
    return returns;
  }

  calculateVolatility(returns) {
    const mean = returns.reduce((a, b) => a + b, 0) / returns.length;
    const squaredDiffs = returns.map(r => Math.pow(r - mean, 2));
    return Math.sqrt(squaredDiffs.reduce((a, b) => a + b, 0) / returns.length);
  }

  calculateMomentum(returns) {
    const recentReturns = returns.slice(-10);
    return recentReturns.reduce((a, b) => a + b, 0);
  }
}

export const mlService = new MLService();
