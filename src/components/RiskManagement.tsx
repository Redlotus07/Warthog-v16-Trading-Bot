import React, { useState } from 'react';
import { Shield, AlertTriangle, TrendingUp, DollarSign, Percent, Activity } from 'lucide-react';

const RiskManagement = () => {
  const [riskPerTrade, setRiskPerTrade] = useState(1);
  const [maxOpenTrades, setMaxOpenTrades] = useState(3);
  const [accountBalance, setAccountBalance] = useState(10000);

  const marketConditions = {
    volatility: 'MODERATE',
    trend: 'BULLISH',
    risk: 'MEDIUM',
    recommendation: 'Normal position sizing recommended'
  };

  const calculatePositionSize = (price: number) => {
    return (accountBalance * (riskPerTrade / 100)) / price;
  };

  return (
    <div className="p-6 space-y-6">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Risk Management</h1>
          <p className="text-gray-400">Monitor and adjust your trading risk parameters</p>
        </div>
        <div className="flex items-center space-x-2 px-4 py-2 bg-purple-500/10 rounded-lg border border-purple-500/20">
          <Shield className="w-5 h-5 text-purple-400" />
          <span className="text-purple-400 font-semibold">Risk Analysis Active</span>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          <div className="rounded-xl bg-gray-800/50 border border-gray-700/50 backdrop-blur-sm p-6">
            <h2 className="text-xl font-bold mb-4">Risk Parameters</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <label className="block">
                  <span className="text-gray-400">Risk Per Trade (%)</span>
                  <div className="mt-1 relative">
                    <input
                      type="number"
                      value={riskPerTrade}
                      onChange={(e) => setRiskPerTrade(Number(e.target.value))}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2"
                      min="0.1"
                      max="5"
                      step="0.1"
                    />
                    <Percent className="absolute right-3 top-2.5 w-5 h-5 text-gray-400" />
                  </div>
                </label>
                <label className="block">
                  <span className="text-gray-400">Max Open Trades</span>
                  <div className="mt-1 relative">
                    <input
                      type="number"
                      value={maxOpenTrades}
                      onChange={(e) => setMaxOpenTrades(Number(e.target.value))}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2"
                      min="1"
                      max="10"
                    />
                    <Activity className="absolute right-3 top-2.5 w-5 h-5 text-gray-400" />
                  </div>
                </label>
                <label className="block">
                  <span className="text-gray-400">Account Balance ($)</span>
                  <div className="mt-1 relative">
                    <input
                      type="number"
                      value={accountBalance}
                      onChange={(e) => setAccountBalance(Number(e.target.value))}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2"
                      min="100"
                    />
                    <DollarSign className="absolute right-3 top-2.5 w-5 h-5 text-gray-400" />
                  </div>
                </label>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-gray-700/30 rounded-lg border border-gray-600/50">
                  <div className="flex items-center space-x-2 mb-2">
                    <AlertTriangle className="w-5 h-5 text-yellow-400" />
                    <h3 className="font-semibold">Risk Analysis</h3>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-400">
                      Max Loss Per Trade: ${(accountBalance * (riskPerTrade / 100)).toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-400">
                      Total Risk Exposure: ${(accountBalance * (riskPerTrade / 100) * maxOpenTrades).toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
                  <div className="flex items-center space-x-2 mb-2">
                    <Shield className="w-5 h-5 text-purple-400" />
                    <h3 className="font-semibold text-purple-400">Position Calculator</h3>
                  </div>
                  <p className="text-sm text-gray-400">
                    Recommended position size for BTC at $52,000: {calculatePositionSize(52000).toFixed(4)} BTC
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-gray-800/50 border border-gray-700/50 backdrop-blur-sm p-6">
            <h2 className="text-xl font-bold mb-4">Market Conditions</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-gray-700/30 rounded-lg border border-gray-600/50">
                <p className="text-gray-400 text-sm">Volatility</p>
                <p className="text-lg font-semibold mt-1">{marketConditions.volatility}</p>
              </div>
              <div className="p-4 bg-gray-700/30 rounded-lg border border-gray-600/50">
                <p className="text-gray-400 text-sm">Trend</p>
                <p className="text-lg font-semibold mt-1 text-green-400">{marketConditions.trend}</p>
              </div>
              <div className="p-4 bg-gray-700/30 rounded-lg border border-gray-600/50">
                <p className="text-gray-400 text-sm">Risk Level</p>
                <p className="text-lg font-semibold mt-1">{marketConditions.risk}</p>
              </div>
              <div className="p-4 bg-gray-700/30 rounded-lg border border-gray-600/50">
                <p className="text-gray-400 text-sm">Action</p>
                <p className="text-lg font-semibold mt-1 text-purple-400">Normal</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-xl bg-gray-800/50 border border-gray-700/50 backdrop-blur-sm p-6">
            <h2 className="text-xl font-bold mb-4">Risk Alerts</h2>
            <div className="space-y-4">
              <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                <div className="flex items-center space-x-2 text-green-400">
                  <Shield className="w-5 h-5" />
                  <p className="font-medium">Risk Levels Normal</p>
                </div>
                <p className="mt-2 text-sm text-gray-400">
                  Current risk parameters are within acceptable ranges
                </p>
              </div>

              <div className="p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                <div className="flex items-center space-x-2 text-yellow-400">
                  <AlertTriangle className="w-5 h-5" />
                  <p className="font-medium">Upcoming High Impact News</p>
                </div>
                <p className="mt-2 text-sm text-gray-400">
                  FOMC Meeting in 2 hours. Consider reducing position sizes
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-gray-800/50 border border-gray-700/50 backdrop-blur-sm p-6">
            <h2 className="text-xl font-bold mb-4">Recommendations</h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <TrendingUp className="w-5 h-5 text-purple-400 mt-1" />
                <div>
                  <p className="font-medium">Position Sizing</p>
                  <p className="text-sm text-gray-400 mt-1">
                    {marketConditions.recommendation}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiskManagement;
