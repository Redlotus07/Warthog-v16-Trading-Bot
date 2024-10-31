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
      <h
