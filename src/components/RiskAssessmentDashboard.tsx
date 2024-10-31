// src/components/RiskAssessmentDashboard.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const RiskAssessmentDashboard = ({ botId }) => {
  const [riskData, setRiskData] = useState(null);
  const [riskParams, setRiskParams] = useState(null);

  useEffect(() => {
    fetchRiskData();
    fetchRiskParams();
  }, [botId]);

  const fetchRiskData = async () => {
    const response = await axios.get(`/api/risk/assessment/${botId}`);
    setRiskData(response.data);
  };

  const fetchRiskParams = async () => {
    const response = await axios.get(`/api/risk/parameters/${botId}`);
    setRiskParams(response.data);
  };

  const handleParamChange = async (param, value) => {
    await axios.post(`/api/risk/parameters/${botId}`, { [param]: value });
    fetchRiskParams();
  };

  if (!riskData || !riskParams) return <div>Loading...</div>;

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Risk Assessment Dashboard</h2>
      <div className="grid grid-cols-2 gap-4">
        <RiskMeter title="Total Risk" value={riskData.currentRisk} max={riskParams.maxRiskPerTrade} />
        <RiskMeter title="Drawdown" value={riskData.currentDrawdown} max={riskParams.maxDrawdown} />
        <RiskMeter title="Daily Loss" value={riskData.currentDailyLoss} max={riskParams.maxDailyLoss} />
        <RiskMeter title="Open Trades" value={riskData.openTradesCount} max={riskParams.maxOpenTrades} />
      </div>
      <div className="mt-6">
        <h3 className="text-xl font-bold mb-2">Risk Parameters</h3>
        <div className="grid grid-cols-2 gap-4">
          <RiskParamInput
            title="Max Drawdown (%)"
            value={riskParams.maxDrawdown}
            onChange={(value) => handleParamChange('maxDrawdown', value)}
          />
          <RiskParamInput
            title="Max Risk Per Trade (%)"
            value={riskParams.maxRiskPerTrade}
            onChange={(value) => handleParamChange('maxRiskPerTrade', value)}
          />
          <RiskParamInput
            title="Max Daily Loss (%)"
            value={riskParams.maxDailyLoss}
            onChange={(value) => handleParamChange('maxDailyLoss', value)}
          />
          <Risk ParamInput
            title="Max Open Trades"
            value={riskParams.maxOpenTrades}
            onChange={(value) => handleParamChange('maxOpenTrades', value)}
          />
        </div>
      </div>
    </div>
  );
};

export default RiskAssessmentDashboard;
