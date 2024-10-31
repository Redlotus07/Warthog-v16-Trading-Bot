// src/components/Analytics/AdvancedMetrics.tsx
import React from 'react';
import { LineChart, Line, XAxis, YAxis } from 'recharts';
import { useTradingMetrics } from '../../hooks/useTradingMetrics';

const AdvancedMetrics: React.FC = () => {
  const { metrics, loading } = useTradingMetrics();

  return (
    <div className="grid grid-cols-2 gap-4">
      <MetricCard
        title="Sharpe Ratio"
        value={metrics.sharpeRatio}
        threshold={1.5}
      />
      <MetricCard
        title="Max Drawdown"
        value={metrics.maxDrawdown}
        threshold={-15}
        format="percentage"
      />
      <MetricCard
        title="Win Rate"
        value={metrics.winRate}
        threshold={55}
        format="percentage"
      />
      <MetricCard
        title="Profit Factor"
        value={metrics.profitFactor}
        threshold={1.5}
      />
    </div>
  );
};
