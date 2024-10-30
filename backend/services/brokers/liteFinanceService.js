import WebSocket from 'ws';
import axios from 'axios';

class LiteFinanceService {
  constructor() {
    this.baseUrl = process.env.LITEFINANCE_API_URL;
    this.ws = null;
    this.subscribers = new Map();
  }

  async connect(apiKey, secretKey) {
    try {
      const auth = await this.authenticate(apiKey, secretKey);
      this.setupWebSocket(auth.token);
      return auth;
    } catch (error) {
      throw new Error('Failed to connect to LiteFinance');
    }
  }

  async authenticate(apiKey, secretKey) {
    const response = await axios.post(`${this.baseUrl}/auth`, {
      apiKey,
      secretKey,
      timestamp: Date.now()
    });
    return response.data;
  }

  setupWebSocket(token) {
    this.ws = new WebSocket(`${this.baseUrl}/ws`);
    
    this.ws.on('open', () => {
      this.ws.send(JSON.stringify({ type: 'auth', token }));
    });

    this.ws.on('message', (data) => {
      const message = JSON.parse(data);
      this.handleMessage(message);
    });
  }

  async placeTrade(tradeData) {
    const { pair, type, size, stopLoss, takeProfit } = tradeData;
    
    const response = await axios.post(`${this.baseUrl}/trade`, {
      symbol: pair,
      side: type,
      volume: size,
      sl: stopLoss,
      tp: takeProfit
    }, {
      headers: { Authorization: `Bearer ${this.token}` }
    });

    return response.data;
  }

  async getAccountInfo() {
    const response = await axios.get(`${this.baseUrl}/account`, {
      headers: { Authorization: `Bearer ${this.token}` }
    });
    return response.data;
  }

  subscribeToPrice(pair, callback) {
    if (!this.subscribers.has(pair)) {
      this.subscribers.set(pair, new Set());
      this.ws.send(JSON.stringify({
        type: 'subscribe',
        channel: 'price',
        symbol: pair
      }));
    }
    this.subscribers.get(pair).add(callback);
  }

  handleMessage(message) {
    switch (message.type) {
      case 'price':
        this.handlePriceUpdate(message);
        break;
      case 'trade':
        this.handleTradeUpdate(message);
        break;
      case 'error':
        console.error('LiteFinance error:', message.error);
        break;
    }
  }
}

export const liteFinanceService = new LiteFinanceService();
