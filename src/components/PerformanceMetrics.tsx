import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const PerformanceMetrics = () => {
  const data = [
    { date: 'Mar 04', profit: 2400, trades: 4 },
    { date: 'Mar 05', profit: 3200, trades: 6 },
    { date: 'Mar 06', profit: 4100, trades: 5 },
    { date: 'Mar 07', profit: 3800, trades: 7 },
    { date: 'Mar 08', profit: 5200, trades: 8 },
    { date: 'Mar 09', profit: 4800, trades: 6 },
    { date: 'Mar 10', profit: 6100, trades: 9 },
  ];

  return (
    <div className="rounded-xl bg-gray-800/50 border border-gray-700/50 backdrop-blur-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Performance Overview</h2>
        <select className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-1 text-sm">
          <option value="7d">Last 7 days</option>
          <option value="1m">Last month</option>
          <option value="3m">Last 3 months</option>
        </select>
      </div>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="date" 
              stroke="#9CA3AF"
              tick={{ fill: '#9CA3AF' }}
            />
            <YAxis 
              stroke="#9CA3AF"
              tick={{ fill: '#9CA3AF' }}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1F2937',
                border: '1px solid #374151',
                borderRadius: '0.5rem',
              }}
              itemStyle={{ color: '#E5E7EB' }}
              labelStyle={{ color: '#9CA3AF' }}
            />
            <Line
              type="monotone"
              dataKey="profit"
              stroke="#8B5CF6"
              strokeWidth={2}
              dot={{ fill: '#8B5CF6', strokeWidth: 2 }}
              activeDot={{ r: 6, fill: '#8B5CF6' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="grid grid-cols-2 gap-4 mt-6">
        <div className="bg-gray-700/30 rounded-lg p-4 border border-gray-600/50">
          <p className="text-gray-400 text-sm">Total Trades</p>
          <p className="text-2xl font-bold mt-1">45</p>
          <p className="text-green-400 text-sm mt-1">+12% vs last week</p>
        </div>
        <div className="bg-gray-700/30 rounded-lg p-4 border border-gray-600/50">
          <p className="text-gray-400 text-sm">Success Rate</p>
          <p className="text-2xl font-bold mt-1">76.2%</p>
          <p className="text-green-400 text-sm mt-1">+2.1% vs last week</p>
        </div>
      </div>
    </div>
  );
};

export default PerformanceMetrics;
