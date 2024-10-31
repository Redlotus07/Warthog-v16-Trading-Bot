// src/services/marketDataService.ts
class MarketDataService {
  private dataProviders = new Map<string, DataProvider>();
  private cache = new Map<string, MarketData>();

  async initialize() {
    // Initialize multiple data providers for redundancy
    this.dataProviders.set('primary', new BinanceProvider());
    this.dataProviders.set('secondary', new KrakenProvider());
    this.dataProviders.set('backup', new CoinbaseProvider());
  }

  async getMarketData(symbol: string): Promise<MarketData> {
    try {
      // Try primary provider first
      return await this.dataProviders.get('primary')?.getData(symbol);
    } catch (error) {
      // Fallback to secondary provider
      return await this.dataProviders.get('secondary')?.getData(symbol);
    }
  }
}
