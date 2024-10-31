// src/components/Trading/TradingDashboard.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { marketDataService } from '../services/marketDataService';

const TradingDashboard = () => {
  const [marketData, setMarketData] = useState({});
  const [tradingPairs, setTradingPairs] = useState([]);
  const [selectedPair, setSelectedPair] = useState('');
  const [trades, setTrades] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    marketDataService.subscribe('BTC/USD', data => {
      setMarketData(data);
    });

    marketDataService.getTradingPairs().then(pairs => {
      setTradingPairs(pairs);
    });

    axios.get('/api/trades').then(response => {
      setTrades(response.data);
    });
  }, []);

  const handlePairChange = (pair: string) => {
    setSelectedPair(pair);
    marketDataService.subscribe(pair, data => {
      setMarketData(data);
    });
  };

  const handleTradeClick = (tradeId: string) => {
    navigate(`/trades/${tradeId}`);
  };

  return (
    <div className="flex flex-col h-screen">
      <header className="bg-gray-900 py-4">
        <h1 className="text-3xl font-bold text-white">Trading Dashboard</h1>
      </header>
      <main className="flex-1 overflow-y-auto">
        <div className="px-4 py-6">
          <h2 className="text-2xl font-bold">Market Data</h2>
          <div className="flex flex-wrap justify-center">
            {Object.keys(marketData).map((key, index) => (
              <div key={index} className="w-1/2 md:w-1/3 xl:w-1/4 p-4">
                <div className="bg-white rounded shadow-md p-4">
                  <h3 className="text-lg font-bold">{key}</h3>
                  <p className="text-gray-600">{marketData[key]}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="px-4 py-6">
          <h2 className="text-2xl font-bold">Trading Pairs</h2>
          <select
            value={selectedPair}
            onChange={e => handlePairChange(e.target.value)}
            className="block w-full pl-10 text-sm text-gray-700"
          >
            {tradingPairs.map((pair, index) => (
              <option key={index} value={pair}>
                {pair}
              </option>
            ))}
          </select>
        </div>
        <div className="px-4 py-6">
          <h2 className="text-2xl font-bold">Trades</h2>
          <ul className="list-none mb-4">
            {trades.map((trade, index) => (
              <li key={index} className="py-4">
                <button
                  onClick={() => handleTradeClick(trade._id)}
                  className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded"
                >
                  {trade.pair} - {trade.type}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
};

export default TradingDashboard;
