// src/store/botStore.ts
import { create } from 'zustand';
import axios from 'axios';

interface BotState {
  isActive: boolean;
  balance: number;
  performance: {
    totalTrades: number;
    winRate: number;
    profitFactor: number;
  };
  activeTrades: any[];
  error: string | null;
  setActive: (active: boolean) => Promise<void>;
  fetchStatus: () => Promise<void>;
  fetchPerformance: () => Promise<void>;
  fetchActiveTrades: () => Promise<void>;
}

export const useBotStore = create<BotState>((set) => ({
  isActive: false,
  balance: 0,
  performance: {
    totalTrades: 0,
    winRate: 0,
    profitFactor: 0,
  },
  activeTrades: [],
  error: null,

  setActive: async (active) => {
    try {
      await axios.post('/api/bot/toggle', { active });
      set({ isActive: active, error: null });
    } catch (error) {
      set({ error: 'Failed to toggle bot status' });
    }
  },

  fetchStatus: async () => {
    try {
      const { data } = await axios.get('/api/bot/status');
      set({ isActive: data.active, error: null });
    } catch (error) {
      set({ error: 'Failed to fetch bot status' });
    }
  },

  fetchPerformance: async () => {
    try {
      const { data } = await axios.get('/api/bot/performance');
      set({ performance: data, error: null });
    } catch (error) {
      set({ error: 'Failed to fetch performance metrics' });
    }
  },

  fetchActiveTrades: async () => {
    try {
      const { data } = await axios.get('/api/trades/active');
      set({ activeTrades: data, error: null });
    } catch (error) {
      set({ error: 'Failed to fetch active trades' });
    }
  },
}));
