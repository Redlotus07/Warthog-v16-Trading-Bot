// backend/services/marketDataService.js
import WebSocket from 'ws';
import { Redis } from 'ioredis';
import axios from 'axios';

class MarketDataService {
  constructor() {
    this.connections = new Map();
    this.subscribers = new Map();
    this.cache = new Redis(process.env.REDIS_URL);
    this.candleIntervals = ['1m', '5m', '15m', '1h', '4h', '1d'];
    this.dataProviders = [
      {
        name: 'primary',
        url: process.env.PRIMARY_MARKET_DATA_URL,
        wsUrl: process.env.PRIMARY_MARKET_DATA_WS
      },
      {
        name: 'backup',
        url: process.env.BACKUP_MARKET_DATA_URL,
        wsUrl: process.env.BACKUP_MARKET_DATA_WS
      }
    ];
  }

  async initialize() {
    await this.setupWebSockets();
    this.startHealthCheck();
  }

  async setupWebSockets() {
    this.dataProviders.forEach(provider => {
      const ws = new WebSocket(provider.wsUrl);
      
      ws.on('open', () => {
        console.log(`Connected to ${provider.name} websocket`);
        this.subscribeToMarketData(ws);
      });

      ws.on('message', (data) => {
        this.handleWebSocketMessage(data, provider.name);
      });

      ws.on('error', (error) => {
        console.error(`WebSocket error for ${provider.name}:`, error);
        this.handleConnectionError(provider);
      });

      this.connections.set(provider.name, ws);
    });
  }

  async getLatestData(pair) {
    try {
      // Try to get from cache first
      const cachedData = await this.cache.get(`market:${pair}`);
      if (cachedData) {
        return JSON.parse(cachedData);
      }

      // Fetch fresh data
      const data = await this.fetchMarketData(pair);
      
      // Cache the data
      await this.cache.setex(`market:${pair}`, 60, JSON.stringify(data));
      
      return data;
    } catch (error) {
      console.error(`Error fetching market data for ${pair}:`, error);
      throw error;
    }
  }

  async fetchMarketData(pair) {
    const responses = await Promise.allSettled(
      this.dataProviders.map(provider =>
        axios.get(`${provider.url}/market-data/${pair}`)
      )
    );

    const successfulResponse = responses.find(r => r.status === 'fulfilled');
    if (!successfulResponse) {
      throw new Error('Failed to fetch market data from all providers');
    }

    return this.processMarketData(successfulResponse.value.data);
  }

  async getHistoricalData(pair, timeframe, limit = 1000) {
    const cacheKey = `historical:${pair}:${timeframe}:${limit}`;
    
    try {
      const cachedData = await this.cache.get(cacheKey);
      if (cachedData) {
        return JSON.parse(cachedData);
      }

      const data = await this.fetchHistoricalData(pair, timeframe, limit);
      await this.cache.setex(cacheKey, 300, JSON.stringify(data));
      
      return data;
    } catch (error) {
      console.error(`Error fetching historical data for ${pair}:`, error);
      throw error;
    }
  }

  async fetchHistoricalData(pair, timeframe, limit) {
    const responses = await Promise.allSettled(
      this.dataProviders.map(provider =>
        axios.get(`${provider.url}/historical-data/${pair}/${timeframe}/${limit}`)
      )
    );

    const successfulResponse = responses.find(r => r.status === 'fulfilled');
    if (!successfulResponse) {
      throw new Error('Failed to fetch historical data from all providers');
    }

    return this.processHistoricalData(successfulResponse.value.data);
  }

  // ... Additional methods for handling WebSocket messages, health checks, and error handling
}

export const marketDataService = new MarketDataService();
