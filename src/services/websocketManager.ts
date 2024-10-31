// src/services/websocketManager.ts
class WebSocketManager {
  private connections: Map<string, WebSocket>;
  private reconnectAttempts: Map<string, number>;

  constructor() {
    this.connections = new Map();
    this.reconnectAttempts = new Map();
  }

  connect(endpoint: string, handlers: WebSocketHandlers) {
    const ws = new WebSocket(endpoint);
    
    ws.onmessage = this.handleMessage.bind(this);
    ws.onerror = () => this.handleError(endpoint);
    ws.onclose = () => this.handleDisconnect(endpoint);

    this.connections.set(endpoint, ws);
  }

  private handleDisconnect(endpoint: string) {
    const attempts = this.reconnectAttempts.get(endpoint) || 0;
    if (attempts < 5) {
      setTimeout(() => this.reconnect(endpoint), 1000 * Math.pow(2, attempts));
      this.reconnectAttempts.set(endpoint, attempts + 1);
    }
  }
}
