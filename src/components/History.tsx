import React, { useState } from 'react';
import { History as HistoryIcon, TrendingUp, TrendingDown, Calendar, Filter, Download } from 'lucide-react';

const History = () => {
  const [timeframe, setTimeframe] = useState('7d');
  const [pair, setPair] = useState('ALL');

  const trades = [
    {
      id: 1,
      pair: 'BTC/USD',
      type: 'LONG',
      entry: 51234.50,
      exit: 52341.20,
      profit: 1106.70,
      profitPercentage: 2.16,
      date: '2024-03-10 14:23',
      strategy: 'ML_TREND',
      duration: '2h 15m'
    },
    {
      id: 2,
      pair: 'XAG/USD',
      type: 'SHORT',
      entry: 24.56,
      exit: 24.32,
      profit: 240.00,
      profitPercentage: 0.98,
      date: '2024-03-10 12:15',
      strategy: 'NEWS_BREAKOUT',
      duration: '45m'
    },
    {
      id: 3,
      pair: 'XAU/USD',
      type: 'LONG',
      entry: 2012.45,
      exit: 2018.30,
      profit: 585.00,
      profitPercentage: 0.29,
      date: '2024-03-10 10:30',
      strategy: 'ML_REVERSAL',
      duration: '1h 30m'
    }
  ];

  const stats = {
    totalTrades: trades.length,
    winRate: 85.7,
    profitFactor: 2.8,
    averageWin: 643.90,
    averageLoss: 230.45,
    largestWin: 1106.70,
    largestLoss: 450.20
  };

  const pairs = ['ALL', 'BTC/USD', 'ETH/USD', 'XAU/USD', 'XAG/USD'];
  const timeframes = [
    { value: '24h', label: '24 Hours' },
    { value: '7d', label: '7 Days' },
    { value: '30d', label: '30 Days' },
    { value: '90d', label: '90 Days' }
  ];

  return (
    <div className="p-6 space-y-6">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Trade History</h1>
          <p className="text-gray-400">Analyze your trading performance and patterns</p>
        </div>
        <button className="flex items-center space-x-2 px-4 py-2 bg-purple-500/10 rounded-lg border border-purple-500/20 text-purple-400 hover:bg-purple-500/20 transition-colors">
          <Download className="w-5 h-5" />
          <span>Export History</span>
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="rounded-xl bg-gray-800/50 border border-gray-700/50 backdrop-blur-sm p-6">
          <div className="flex items-center space-x-2 mb-2">
            <TrendingUp className="w-5 h-5 text-green-400" />
            <h3 className="font-semibold">Win Rate</h3>
          </div>
          <p className="text-2xl font-bold">{stats.winRate}%</p>
          <p className="text-sm text-gray-400 mt-1">Last 30 days</p>
        </div>

        <div className="rounded-xl bg-gray-800/50 border border-gray-700/50 backdrop-blur-sm p-6">
          <div className="flex items-center space-x-2 mb-2">
            <HistoryIcon className="w-5 h-5 text-purple-400" />
            <h3 className="font-semibold">Total Trades</h3>
          </div>
          <p className="text-2xl font-bold">{stats.totalTrades}</p>
          <p className="text-sm text-gray-400 mt-1">Last 30 days</p>
        </div>

        <div className="rounded-xl bg-gray-800/50 border border-gray-700/50 backdrop-blur-sm p-6">
          <div className="flex items-center space-x-2 mb-2">
            <TrendingUp className="w-5 h-5 text-blue-400" />
            <h3 className="font-semibold">Profit Factor</h3>
          </div>
          <p className="text-2xl font-bold">{stats.profitFactor}</p>
          <p className="text-sm text-gray-400 mt-1">Gross profit / gross loss</p>
        </div>

        <div className="rounded-xl bg-gray-800/50 border border-gray-700/50 backdrop-blur-sm p-6">
          <div className="flex items-center space-x-2 mb-2">
            <TrendingDown className="w-5 h-5 text-yellow-400" />
            <h3 className="font-semibold">Average Trade</h3>
          </div>
          <p className="text-2xl font-bold">${stats.averageWin}</p>
          <p className="text-sm text-gray-400 mt-1">Per winning trade</p>
        </div>
      </div>

      <div className="rounded-xl bg-gray-800/50 border border-gray-700/50 backdrop-blur-sm p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
          <h2 className="text-xl font-bold">Trade Details</h2>
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-gray-400" />
              <select
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value)}
                className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-1"
              >
                {timeframes.map((tf) => (
                  <option key={tf.value} value={tf.value}>{tf.label}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={pair}
                onChange={(e) => setPair(e.target.value)}
                className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-1"
              >
                {pairs.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-gray-400 border-b border-gray-700">
                <th className="pb-4">Date</th>
                <th className="pb-4">Pair</th>
                <th className="pb-4">Type</th>
                <th className="pb-4">Entry</th>
                <th className="pb-4">Exit</th>
                <th className="pb-4">Profit/Loss</th>
                <th className="pb-4">Duration</th>
                <th className="pb-4">Strategy</th>
              </tr>
            </thead>
            <tbody>
              {trades.map((trade) => (
                <tr key={trade.id} className="border-b border-gray-700/50">
                  <td className="py-4">{trade.date}</td>
                  <td className="py-4">{trade.pair}</td>
                  <td className={`py-4 ${
                    trade.type === 'LONG' ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {trade.type}
                  </td>
                  <td className="py-4">${trade.entry.toFixed(2)}</td>
                  <td className="py-4">${trade.exit.toFixed(2)}</td>
                  <td className={`py-4 ${trade.profit > 0 ? 'text-green-400' : 'text-red-400'}`}>
                    ${trade.profit.toFixed(2)} ({trade.profitPercentage.toFixed(2)}%)
                  </td>
                  <td className="py-4 text-gray-400">{trade.duration}</td>
                  <td className="py-4">
                    <span className="px-2 py-1 bg-purple-500/10 rounded text-purple-400 text-sm">
                      {trade.strategy}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default History;
