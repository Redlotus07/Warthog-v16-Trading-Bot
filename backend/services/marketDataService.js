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

  subscribeToMarketData(ws) {
    const subscriptionMessage = {
      type: 'subscribe',
      channels: ['ticker'],
      pairs: this.getTradingPairs()
    };
    ws.send(JSON.stringify(subscriptionMessage));
  }

  handleWebSocketMessage(data, providerName) {
    const parsedData = JSON.parse(data);
    if (parsedData.type === 'ticker') {
      this.updateCache(parsedData);
      this.notifySubscribers(parsedData);
    }
  }

  async getLatestData(pair) {
    try {
      const cachedData = await this.cache.get(`market:${pair}`);
      if (cachedData) {
        return JSON.parse(cachedData);
      }

      const data = await this.fetchMarketData(pair);
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

  updateCache(data) {
    this.cache.set(`market:${data.pair}`, JSON.stringify(data), 'EX', 60);
  }

  notifySubscribers(data) {
    const subscribers = this.subscribers.get(data.pair) || [];
    subscribers.forEach(callback => callback(data));
  }

  subscribe(pair, callback) {
    if (!this.subscribers.has(pair)) {
      this.subscribers.set(pair, new Set());
    }
    this.subscribers.get(pair).add(callback);
  }

  unsubscribe(pair, callback) {
    const subscribers = this.subscribers.get(pair);
    if (subscribers) {
      subscribers.delete(callback);
    }
  }

  getTradingPairs() {
    // Implement logic to get trading pairs from configuration or database
    return ['BTC/USD', 'ETH/USD', 'XAU/USD', 'XAG/USD'];
  }

  startHealthCheck() {
    setInterval(() => {
      this.connections.forEach((ws, name) => {
        if (ws.readyState === WebSocket.CLOSED) {
          console.log(`Reconnecting to ${name} websocket`);
          this.setupWebSockets();
        }
      });
    }, 30000); // Check every 30 seconds
  }

  handleConnectionError(provider) {
    console.log(`Switching to backup provider for ${provider.name}`);
    // Implement logic to switch to backup provider
  }

  processMarketData(data) {
    // Implement any necessary data processing
    return data;
  }
}

export const marketDataService = new MarketDataService();
