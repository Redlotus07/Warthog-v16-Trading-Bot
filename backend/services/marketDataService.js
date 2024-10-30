import WebSocket from 'ws';

class MarketDataService {
  constructor() {
    this.connections = new Map();
    this.subscribers = new Map();
  }

  subscribe(pair, callback) {
    if (!this.subscribers.has(pair)) {
      this.subscribers.set(pair, new Set());
      this.connectToExchange(pair);
    }
    this.subscribers.get(pair).add(callback);
  }

  unsubscribe(pair, callback) {
    if (this.subscribers.has(pair)) {
      this.subscribers.get(pair).delete(callback);
      if (this.subscribers.get(pair).size === 0) {
        this.subscribers.delete(pair);
        this.closeConnection(pair);
      }
    }
  }

  connectToExchange(pair) {
    // Implementation would depend on the specific exchange API
    console.log(`Connected to exchange for ${pair}`);
  }

  closeConnection(pair) {
    if (this.connections.has(pair)) {
      this.connections.get(pair).close();
      this.connections.delete(pair);
    }
  }

  handleMessage(pair, data) {
    const subscribers = this.subscribers.get(pair);
    if (subscribers) {
      subscribers.forEach(callback => callback(data));
    }
  }
}

export const marketDataService = new MarketDataService();
