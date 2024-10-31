import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TradeHistory = () => {
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTradeHistory();
  }, []);

  const fetchTradeHistory = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/trades/history');
      setTrades(response.data);
    } catch (error) {
      console.error('Failed to fetch trade history:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading trade history...</div>;
  }

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
              <tr key={trade._id} className="border-t border-gray-700">
                <td className="py-4">{trade.pair}</td>
                <td className={`py-4 ${
                  trade.type === 'LONG' ? 'text-green-400' : 'text-red-400'
                }`}>
                  {trade.type}
                </td>
                <td className="py-4">${trade.entry.toFixed(2)}</td>
                <td className="py-4">${trade.exit.toFixed(2)}</td>
                <td className={`py-4 ${trade.profit > 0 ? 'text-green-400' : 'text-red-400'}`}>
                  ${trade.profit.toFixed(2)}
                </td>
                <td className="py-4 text-gray-400">{new Date(trade.exitTime).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TradeHistory;
