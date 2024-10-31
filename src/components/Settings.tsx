// src/components/Settings.tsx
import React, { useState, useEffect } from 'react';
import { Save, AlertTriangle, Power, Clock } from 'lucide-react';
import axios from 'axios';

const Settings = () => {
  const [settings, setSettings] = useState({
    riskPerTrade: 1,
    maxOpenTrades: 3,
    tradingPairs: ['BTC/USD', 'ETH/USD', 'XAU/USD', 'XAG/USD'],
    apiKey: '',
    secretKey: '',
    botActive: false,
    autoShutdownEnabled: false,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/settings');
      setSettings(response.data);
    } catch (err) {
      setError('Failed to fetch settings');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/settings', settings);
      setSuccessMessage('Settings saved successfully');
    } catch (err) {
      setError('Failed to save settings');
    }
  };

  const handleBotToggle = async () => {
    try {
      const newStatus = !settings.botActive;
      await axios.post('/api/bot/toggle', { active: newStatus });
      setSettings(prev => ({ ...prev, botActive: newStatus }));
      setSuccessMessage(`Bot ${newStatus ? 'activated' : 'deactivated'} successfully`);
    } catch (err) {
      setError('Failed to toggle bot status');
    }
  };

  const handleImmediateShutdown = async () => {
    try {
      await axios.post('/api/bot/shutdown');
      setSettings(prev => ({ ...prev, botActive: false }));
      setSuccessMessage('Bot shut down successfully');
    } catch (err) {
      setError('Failed to shut down bot');
    }
  };

  if (loading) return <div>Loading settings...</div>;

  return (
    <div className="p-6 space-y-6">
      {/* ... (header and form as before) ... */}
      
      {error && (
        <div className="p-4 bg-red-500 /20 rounded-lg text-red-400">
          <AlertTriangle size={20} />
          <span>{error}</span>
        </div>
      )}
      
      {successMessage && (
        <div className="p-4 bg-green-500/20 rounded-lg text-green-400">
          <Save size={20} />
          <span>{successMessage}</span>
        </div>
      )}
      
      <button
        className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded"
        onClick={handleBotToggle}
      >
        {settings.botActive ? 'Deactivate Bot' : 'Activate Bot'}
      </button>
      
      <button
        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        onClick={handleImmediateShutdown}
      >
        Shut Down Bot Immediately
      </button>
    </div>
  );
};

export default Settings;
