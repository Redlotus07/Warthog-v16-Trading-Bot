// src/components/trading/TradingForm.tsx
import React, { useState } from 'react';
import { useTrade } from '../../hooks/useTrade';

interface TradingFormProps {
  pair: string;
  onTradeExecuted: () => void;
}

export const TradingForm: React.FC<TradingFormProps> = ({
  pair,
  onTradeExecuted,
}) => {
  const { loading, error, executeTrade } = useTrade();
  const [type, setType] = useState<'LONG' | 'SHORT'>('LONG');
  const [size, setSize] = useState<number>(0.1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await executeTrade({
        pair,
        type,
        size,
      });
      onTradeExecuted();
    } catch (err) {
      console.error('Trade execution failed:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-400 mb-2">
          Position Type
        </label>
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => setType('LONG')}
            className={`px-4 py-2 rounded-lg border ${
              type === 'LONG' ? 'bg-green-500/20 border-green-500 text-green-400' : 'border-gray-600'
            }`}
          >
            Long
          </button>
          <button
            type="button"
            onClick={() => setType('SHORT')}
            className={`px-4 py-2 rounded-lg border ${
              type === 'SHORT' ? 'bg-red-500/20 border-red-500 text-red-400' : 'border-gray-600'
            }`}
          >
            Short
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-400 mb-2">
          Position Size
        </label>
        <input
          type="number"
          value={size}
           onChange={(e) => setSize(parseFloat(e.target.value))}
          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2"
          min="0.1"
          max="5"
          step="0.1"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
      >
        Execute Trade
      </button>

      {loading && <div>Loading...</div>}
      {error && <div className="text-red-400">{error.message}</div>}
    </form>
  );
};
