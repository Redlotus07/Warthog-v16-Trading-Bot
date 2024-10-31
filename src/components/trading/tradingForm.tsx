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
               type === 'LONG' ? 'bg-green-500 text-white' : 'bg-gray-200'
             }`}
          >
            LONG
          </button>
          <button
            type="button"
            onClick={() => setType('SHORT')}
            className={`px-4 py-2 rounded-lg border ${
               type === 'SHORT' ? 'bg-red-500 text-white' : 'bg-gray-200'
             }`}
          >
            SHORT
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
          className="w-full p-2 pl-10 text-sm text-gray-700"
          placeholder="0.1"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`w-full p-2 rounded-lg bg-blue-500 text-white ${
          loading ? 'cursor-not-allowed' : ''
        }`}
      >
        {loading ? 'Executing...' : 'Execute Trade'}
      </button>

      {error && (
        <div className="text-red-500 text-sm">{error}</div>
      )}
    </form>
  );
};
