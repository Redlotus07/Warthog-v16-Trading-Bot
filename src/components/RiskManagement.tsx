import React, { useState, useEffect } from 'react';
import { Shield, AlertTriangle, TrendingUp, DollarSign, Percent, Activity } from 'lucide-react';
import axios from 'axios';

const RiskManagement = () => {
  const [riskSettings, setRiskSettings] = useState({
    riskPerTrade: 1,
    maxOpenTrades: 3,
    accountBalance: 10000,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchRiskSettings();
  }, []);

  const fetchRiskSettings = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/risk-management/settings');
      setRiskSettings(response.data);
    } catch (err) {
      setError('Failed to fetch risk settings');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRiskSettings(prev => ({
      ...prev,
      [name]: Number(value)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/risk-management/settings', riskSettings);
      setSuccessMessage('Risk settings saved successfully');
    } catch (err) {
      setError('Failed to save risk settings');
    }
  };

  if (loading) return <div>Loading risk management settings...</div>;

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

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500">
          {error}
        </div>
      )}
      
      {successMessage && (
        <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg text-green-500">
          {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <label className="block">
              <span className="text-gray-400">Risk Per Trade (%)</span>
              <div className="mt-1 relative">
                <input
                  type="number"
                  name="riskPerTrade"
                  value={riskSettings.riskPerTrade}
                  onChange={handleChange}
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
                  name="maxOpenTrades"
                  value={riskSettings.maxOpenTrades}
                  onChange={handleChange}
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
                  name="accountBalance"
                  value={riskSettings.accountBalance}
                  onChange={handleChange}
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
                  Max Loss Per Trade: ${(riskSettings.accountBalance * (riskSettings.riskPerTrade / 100)).toFixed(2)}
                </p>
                <p className="text-sm text-gray-400">
                  Total Risk Exposure: ${(riskSettings.accountBalance * (riskSettings.riskPerTrade / 100) * riskSettings.maxOpenTrades).toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
        >
          Save Risk Settings
        </button>
      </form>
    </div>
  );
};

export default RiskManagement;
