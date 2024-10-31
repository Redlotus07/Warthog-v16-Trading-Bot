// src/components/ActiveTrades.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ActiveTrades = () => {
  const [activeTrades, setActiveTrades] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActiveTrades();
    const interval = setInterval(fetchActiveTrades, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchActiveTrades = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/trades/active');
      setActiveTrades(response.data);
    } catch (error) {
      console.error('Failed to fetch active trades:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading active trades...</div>;
  }

  return (
    <div className="rounded-xl bg-gray-800/50 border border-gray-700/50 backdrop-blur-sm p-6">
      <h2 className="text-xl font-bold mb-4">Active Trades</h2>
      {activeTrades.length === 0 ? (
        <p>No active trades at the moment.</p>
      ) : (
        <div className="space-y-4">
          {activeTrades.map((trade) => (
            <ActiveTradeCard key={trade.id} trade={trade} />
          ))}
        </div>
      )}
    </div>
  );
};

const ActiveTradeCard = ({ trade }) => (
  <div className="bg-gray-700/30 rounded-lg p-4 border border-gray-600/50">
    <div className="flex justify-between items-center">
      <span className="font-semibold">{trade.pair}</span>
      <span className={`px-2 py-1 rounded text-sm ${
        trade.type === 'LONG' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
      }`}>
        {trade.type}
      </span>
    </div>
    <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
      <div>Entry: ${trade.entry.toFixed(2)}</div>
      <div>Current: ${trade.currentPrice.toFixed(2)}</div>
      <div>Size: {trade.size}</div>
      <div className={trade.unrealizedP nl > 0 ? 'text-green-400' : 'text-red-400'}>
        Unrealized PnL: ${trade.unrealizedPnl.toFixed(2)}
      </div>
    </div>
  </div>
);

export default ActiveTrades;
