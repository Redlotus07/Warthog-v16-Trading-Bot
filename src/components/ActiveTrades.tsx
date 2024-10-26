import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

const ActiveTrades = () => {
  const trades = [
    {
      pair: 'BTC/USD',
      type: 'LONG',
      entry: 52341.20,
      current: 52541.80,
      profit: 200.60,
      profitPercentage: 0.38,
    },
    {
      pair: 'XAU/USD',
      type: 'SHORT',
      entry: 2012.45,
      current: 2008.30,
      profit: 415.00,
      profitPercentage: 0.21,
    },
  ];

  return (
    <div className="rounded-xl bg-gray-800/50 border border-gray-700/50 backdrop-blur-sm p-6">
      <h2 className="text-xl font-bold mb-4">Active Trades</h2>
      <div className="space-y-4">
        {trades.map((trade, index) => (
          <div key={index} className="p-4 bg-gray-700/30 rounded-lg border border-gray-600/50">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-lg">{trade.pair}</h3>
                <span className={`text-sm ${
                  trade.type === 'LONG' ? 'text-green-400' : 'text-red-400'
                }`}>
                  {trade.type}
                </span>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-400">Profit/Loss</div>
                <div className={`font-semibold ${trade.profit > 0 ? 'text-green-400' : 'text-red-400'}`}>
                  ${trade.profit.toFixed(2)} ({trade.profitPercentage.toFixed(2)}%)
                </div>
              </div>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-gray-400">Entry</div>
                <div>${trade.entry.toFixed(2)}</div>
              </div>
              <div>
                <div className="text-gray-400">Current</div>
                <div>${trade.current.toFixed(2)}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActiveTrades;