import React from 'react';
import { TrendingUp, ArrowUpRight, ArrowDownRight, Activity } from 'lucide-react';
import PerformanceMetrics from './PerformanceMetrics';
import TradeHistory from './TradeHistory';
import ActiveTrades from './ActiveTrades';

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
        <div className="flex items-center space-x-4">
          <div className="px-4 py-2 bg-green-500/10 rounded-lg border border-green-500/20">
            <span className="text-green-400 font-semibold">Bot Active</span>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Profit"
          value="$24,521.34"
          change="+12.5%"
          isPositive={true}
          icon={<TrendingUp className="w-6 h-6 text-green-400" />}
        />
        <MetricCard
          title="Win Rate"
          value="76.2%"
          change="+2.1%"
          isPositive={true}
          icon={<Activity className="w-6 h-6 text-blue-400" />}
        />
        <MetricCard
          title="Active Positions"
          value="4"
          change="-1"
          isPositive={false}
          icon={<TrendingUp className="w-6 h-6 text-yellow-400" />}
        />
        <MetricCard
          title="Daily ROI"
          value="3.2%"
          change="+0.8%"
          isPositive={true}
          icon={<Activity className="w-6 h-6 text-purple-400" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <ActiveTrades />
        <PerformanceMetrics />
      </div>

      <TradeHistory />
    </div>
  );
};

const MetricCard = ({ title, value, change, isPositive, icon }) => {
  return (
    <div className="p-6 rounded-xl bg-gray-800/50 border border-gray-700/50 backdrop-blur-sm">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-gray-400 text-sm">{title}</p>
          <h3 className="text-2xl font-bold mt-1">{value}</h3>
        </div>
        {icon}
      </div>
      <div className="mt-2 flex items-center">
        {isPositive ? (
          <ArrowUpRight className="w-4 h-4 text-green-400" />
        ) : (
          <ArrowDownRight className="w-4 h-4 text-red-400" />
        )}
        <span className={`text-sm ml-1 ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
          {change}
        </span>
      </div>
    </div>
  );
};

export default Dashboard;
