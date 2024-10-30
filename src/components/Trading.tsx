import React, { useState } from 'react';
import { TrendingUp, AlertTriangle } from 'lucide-react';

const Trading = () => {
  const [selectedPair, setSelectedPair] = useState('BTC/USD');
  const [orderType, setOrderType] = useState('MARKET');
  const [position, setPosition] = useState('LONG');
  
  const pairs = ['BTC/USD', 'ETH/USD', 'XAU/USD', 'XAG/USD'];
  const orderTypes = ['MARKET', 'LIMIT', 'STOP'];
  
  return (
    <div className="p-6 space-y-6">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Trading</h1>
          <p className="text-gray-400">Execute trades with ML-powered insights</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-xl bg-gray-800/50 border border-gray-700/50 backdrop-blur-sm p-6">
            <h2 className="text-xl font-bold mb-4">Market Analysis</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-700/30 rounded-lg p-4">
                  <p className="text-gray-400">Trend Strength</p>
                  <p className="text-2xl font-bold text-green-400">Strong Buy</p>
                </div>
                <div className="bg-gray-700/30 rounded-lg p-4">
                  <p className="text-gray-400">ML Confidence</p>
                  <p className="text-2xl font-bold text-purple-400">87%</p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-gray-800/50 border border-gray-700/50 backdrop-blur-sm p-6">
            <h2 className="text-xl font-bold mb-4">Price Chart</h2>
            <div className="h-[400px] flex items-center justify-center border border-gray-700 rounded-lg">
              <p className="text-gray-400">Chart Component Here</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-gray-800/50 border border-gray-700/50 backdrop-blur-sm p-6">
          <h2 className="text-xl font-bold mb-4">New Order</h2>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Trading Pair
              </label>
              <select
                value={selectedPair}
                onChange={(e) => setSelectedPair(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2"
              >
                {pairs.map((pair) => (
                  <option key={pair} value={pair}>{pair}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Order Type
              </label>
              <select
                value={orderType}
                onChange={(e) => setOrderType(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2"
              >
                {orderTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Position
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setPosition('LONG')}
                  className={`px-4 py-2 rounded-lg border ${
                    position === 'LONG'
                      ? 'bg-green-500/20 border-green-500 text-green-400'
                      : 'border-gray-600 hover:border-gray-500'
                  }`}
                >
                  Long
                </button>
                <button
                  type="button"
                  onClick={() => setPosition('SHORT')}
                  className={`px-4 py-2 rounded-lg border ${
                    position === 'SHORT'
                      ? 'bg-red-500/20 border-red-500 text-red-400'
                      : 'border-gray-600 hover:border-gray-500'
                  }`}
                >
                  Short
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              Place Order
            </button>
          </form>

          <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
            <div className="flex items-center space-x-2 text-yellow-500">
              <AlertTriangle className="w-5 h-5" />
              <p className="font-medium">ML Insights</p>
            </div>
            <p className="mt-2 text-sm text-gray-400">
              Market conditions suggest waiting for a better entry point. High volatility detected.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Trading;
