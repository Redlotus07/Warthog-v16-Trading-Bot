// src/components/StrategyBuilder/StrategyBuilder.tsx
import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Strategy, Indicator, Condition } from '../../types/strategy';

const StrategyBuilder: React.FC = () => {
  const [strategy, setStrategy] = useState<Strategy>({
    name: '',
    indicators: [],
    conditions: [],
    timeframes: [],
    riskParameters: {}
  });

  return (
    <div className="flex flex-col space-y-6 p-6 bg-gray-800 rounded-xl">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Strategy Builder</h2>
          <p className="text-gray-400">Create and backtest custom trading strategies</p>
        </div>
        <div className="flex space-x-4">
          <button className="btn-primary">Save Strategy</button>
          <button className="btn-secondary">Run Backtest</button>
        </div>
      </header>

      <div className="grid grid-cols-3 gap-6">
        <IndicatorPanel 
          indicators={strategy.indicators} 
          onAddIndicator={handleAddIndicator}
        />
        <ConditionBuilder 
          conditions={strategy.conditions}
          onUpdateConditions={handleUpdateConditions}
        />
        <RiskParametersPanel 
          parameters={strategy.riskParameters}
          onUpdateParameters={handleUpdateRiskParameters}
        />
      </div>

      <StrategyVisualizer strategy={strategy} />
    </div>
  );
};

const IndicatorPanel: React.FC<IndicatorPanelProps> = ({ indicators, onAddIndicator }) => {
  const availableIndicators = [
    { name: 'RSI', category: 'Momentum' },
    { name: 'MACD', category: 'Trend' },
    { name: 'Bollinger Bands', category: 'Volatility' },
    // Add more indicators
  ];

  return (
    <div className="bg-gray-700 rounded-lg p-4">
      <h3 className="text-lg font-semibold mb-4">Technical Indicators</h3>
      <div className="space-y-2">
        {availableIndicators.map(indicator => (
          <DraggableIndicator 
            key={indicator.name} 
            indicator={indicator}
            onDragEnd={onAddIndicator}
          />
        ))}
      </div>
    </div>
  );
};
