// backend/services/mlModelManager.js
import { MLService } from './mlService.js';
import { marketDataService } from './marketDataService.js';

class MLModelManager {
  constructor() {
    this.mlService = new MLService();
    this.modelUpdateInterval =  1000 * 60 * 60 * 24; // Update models daily
  }

  async initialize() {
    await this.mlService.initialize();
    this.scheduleModelUpdates();
  }

  async scheduleModelUpdates() {
    setInterval(async () => {
      const pairs = await marketDataService.getTradingPairs();
      for (const pair of pairs) {
        await this.mlService.trainModel(pair, await marketDataService.getHistoricalData(pair));
      }
    }, this.modelUpdateInterval);
  }
}

export const mlModelManager = new MLModelManager();
