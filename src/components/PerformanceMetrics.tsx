import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import axios from 'axios';

const PerformanceMetrics = () => {
  const [performanceData, setPerformanceData] = useState({
    profitHistory: [],
    winRate: 0,
    profitFactor: 0,
    totalTrades: 0
  });
  const [timeframe, setTimeframe] = useState('7d');

  useEffect(() => {
    fetchPerformanceData();
  }, [timeframe]);

  const fetchPerformanceData = async () => {
    try {
      const response = await axios.get(`/api/performance?timeframe=${timeframe}`);
      setPerformanceData(response.data);
    } catch (error) {
      console.error('Failed to fetch performance data:', error);
    }
  };

  return (
    <div className="rounded-xl bg-gray-800/50 border border-gray-700/50 backdrop-blur-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Performance Overview</h2>
        <select
          className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-1 text-sm"
          value={timeframe}
          onChange={(e) => setTimeframe(e.target.value)}
        >
          <option value="7d">Last 7 days</option>
          <option value="1m">Last month</option>
          <option value="3m">Last 3 months</option>
        </select>
      </div>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={performanceData.profitHistory} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="date" stroke="#9CA3AF" tick={{ fill: '#9CA3AF' }} />
            <YAxis stroke="#9CA3AF" tick={{ fill: '#9CA3AF' }} tickFormatter={(value) => `$${value}`} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1F2937',
                border: '1px solid #374151',
                borderRadius: '0.5rem',
              }}
              itemStyle={{ color: '#E5E7EB' }}
              labelStyle={{ color: '#9CA3AF' }}
            />
            <Line type="monotone" dataKey="profit" stroke="#8B5CF6" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="grid grid-cols-3 gap-4 mt-6">
        <MetricCard title="Win Rate" value={`${performanceData.winRate.toFixed(2)}%`} />
        <MetricCard title="Profit Factor" value={performanceData.profitFactor.toFixed(2)} />
        <MetricCard title="Total Trades" value={performanceData.totalTrades} />
      </div>
    </div>
  );
};

const MetricCard = ({ title, value }) => (
  <div className="bg-gray-700/30 rounded-lg p-4 border border-gray-600/50">
    <p className="text-gray-400 text-sm">{title}</p>
    <p className="text-2xl font-bold mt-1">{value}</p>
  </div>
);

export default PerformanceMetrics;
