// src/components/Analytics/RealTimeAnalytics.tsx
import React, { useEffect, useState } from 'react';
import { useWebSocket } from '../../hooks/useWebSocket';
import { MarketDepthChart } from './MarketDepthChart';
import { TradeFlowVisualizer } from './TradeFlowVisualizer';
import { PriceImpactAnalysis } from './PriceImpactAnalysis';

const RealTimeAnalytics: React.FC = () => {
  const [marketData, setMarketData] = useState<MarketData>({});
  const { data: wsData } = useWebSocket('market-data');
  const [analysisResults, setAnalysisResults] = useState<AnalysisResults>({});

  useEffect(() => {
    if (wsData) {
      updateAnalytics(wsData);
    }
  }, [wsData]);

  return (
    <div className="grid grid-cols-2 gap-4">
      <MarketDepthVisualizer data={marketData.orderBook} />
      <TradeFlowAnalysis data={marketData.trades} />
      <LiquidityHeatmap data={marketData.liquidity} />
      <PriceImpactChart data={analysisResults.priceImpact} />
      
      <div className="col-span-2">
        <RealTimeMetrics metrics={analysisResults.metrics} />
      </div>
    </div>
  );
};

const MarketDepthVisualizer: React.FC<{ data: OrderBookData }> = ({ data }) => {
  return (
    <div className="bg-gray-800 p-4 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Market Depth</h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data}>
            <XAxis dataKey="price" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Area
              yAxisId="left"
              dataKey="bidSize"
              fill="#0f766e"
              stroke="#0d9488"
            />
            <Area
              yAxisId="right"
              dataKey="askSize"
              fill="#7f1d1d"
              stroke="#dc2626"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
