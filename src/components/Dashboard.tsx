// src/components/Dashboard.js
import React from 'react';
import { Activity, TrendingUp, Shield, History, Settings } from 'lucide-react';
import PerformanceMetrics from './PerformanceMetrics';
import TradeHistory from './TradeHistory';
import ActiveTrades from './ActiveTrades';
import BotControl from './BotControl';

const Dashboard = () => {
  return (
    <div className="p-6 space-y-6">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
            Warthog v16
          </h1>
          <p className="text-gray-400">Advanced Metals & Crypto Trading Bot</p>
        </div>
        <BotControl />
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Add MetricCards here */}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <ActiveTrades />
        <PerformanceMetrics />
      </div>

      <TradeHistory />
    </div>
  );
};

export default Dashboard;
