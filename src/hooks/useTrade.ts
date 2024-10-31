// src/hooks/useTrade.ts
import { useState } from 'react';
import axios from 'axios';

export const useTrade = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const executeTrade = async (tradeData: any) => {
    setLoading(true);
    setError(null);

    try {
      const { data } = await axios.post('/api/trades/execute', tradeData);
      return data;
    } catch (err) {
      setError('Failed to execute trade');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const closeTrade = async (tradeId: string) => {
    setLoading(true);
    setError(null);

    try {
      const { data } = await axios.post(`/api/trades/${tradeId}/close`);
      return data;
    } catch (err) {
      setError('Failed to close trade');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    executeTrade,
    closeTrade,
  };
};
