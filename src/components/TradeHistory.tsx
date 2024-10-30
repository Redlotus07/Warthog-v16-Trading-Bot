import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

const TradeHistory = () => {
  const trades = [
    {
      id: 1,
      pair: 'BTC/USD',
      type: 'LONG',
      entry: 51234.50,
      exit: 52341.20,
      profit: 1106.70,
      date: '2024-03-10 14:23',
    },
    {
      id: 2,
      pair: 'XAG/USD',
      type: 'SHORT',
      entry: 24.56,
      exit: 24.32,
      profit: 240.00,
      date: '2024-03-10 12:15',
    },
  ];

  return (
    <div className="rounded-xl bg-gray-800/50 border border-gray-700/50 backdrop-blur-sm p-6 mt-6">
      <h2 className="text-xl font-bold mb-4">Trade History</h2>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-gray-400">
              <th className="pb-4">Pair</th>
              <th className="pb-4">Type</th>
              <th className="pb-4">Entry</th>
              <th className="pb-4">Exit</th>
              <th className="pb-4">Profit/Loss</th>
              <th className="pb-4">Date</th>
            </tr>
          </thead>
          <tbody>
            {trades.map((trade) => (
              <tr key={trade.id} className="border-t border-gray-700">
                <td className="py-4">{trade.pair}</td>
                <td className={`py-4 ${
                  trade.type === 'LONG' ? 'text-green-400' : 'text-red-400'
                }`}>
                  {trade.type}
                </td>
                <td className="py-4">${trade.entry}</td>
                <td className="py-4">${trade.exit}</td>
                <td className={`py-4 ${trade.profit > 0 ? 'text-green-400' : 'text-red-400'}`}>
                  ${trade.profit}
                </td>
                <td className="py-4 text-gray-400">{trade.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TradeHistory;
