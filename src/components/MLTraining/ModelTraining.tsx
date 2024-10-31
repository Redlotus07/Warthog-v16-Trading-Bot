// src/components/MLTraining/ModelTraining.tsx
const ModelTraining: React.FC = () => {
  const [trainingConfig, setTrainingConfig] = useState<TrainingConfig>({
    modelType: 'LSTM',
    epochs: 100,
    batchSize: 32,
    features: [],
    timeframe: '1d',
    splitRatio: 0.8
  });

  const [trainingStatus, setTrainingStatus] = useState<TrainingStatus>({
    isTraining: false,
    progress: 0,
    currentEpoch: 0,
    metrics: {
      loss: [],
      accuracy: []
    }
  });

  return (
    <div className="space-y-6">
      <ModelConfiguration 
        config={trainingConfig}
        onConfigUpdate={setTrainingConfig}
      />
      
      <FeatureSelection 
        selectedFeatures={trainingConfig.features}
        onFeaturesUpdate={handleFeatureUpdate}
      />

      <TrainingProgress status={trainingStatus} />
      
      <ModelEvaluation metrics={trainingStatus.metrics} />
    </div>
  );
};

const ModelEvaluation: React.FC<{ metrics: TrainingMetrics }> = ({ metrics }) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <MetricsChart data={metrics.loss} title="Loss" />
      <MetricsChart data={metrics.accuracy} title="Accuracy" />
      <ConfusionMatrix data={metrics.confusionMatrix} />
      <ROCCurve data={metrics.rocCurve} />
    </div>
  );
};
