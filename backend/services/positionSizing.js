import { mlService } from './mlService.js';
import { newsService } from './newsTrading/newsService.js';
import { User } from '../models/User.js';

export const calculatePosition = async (userId, tradeData) => {
  const user = await User.findById(userId);
  const { pair, type } = tradeData;

  // Analyze market conditions including news impact
  const marketCondition = await mlService.analyzeMarketCondition(pair);
  const successProbability = await mlService.predictTradeSuccess(pair, tradeData);
  const newsImpact = await newsService.analyzeNewsImpact(tradeData.newsEvent);
  
  // Base position size calculation
  let baseSize = calculateBaseSize(user.settings.riskPerTrade, tradeData);
  
  // Adjust position size based on multiple factors
  const adjustedSize = adjustPositionSize(
    baseSize,
    marketCondition,
    successProbability,
    newsImpact
  );

  // Calculate dynamic exit levels
  const { stopLoss, takeProfit } = calculateExitLevels(
    tradeData,
    marketCondition,
    newsImpact
  );

  return {
    size: adjustedSize,
    stopLoss,
    takeProfit,
    marketCondition,
    newsImpact
  };
};

const adjustPositionSize = (baseSize, marketCondition, probability, newsImpact) => {
  let multiplier = 1;

  // Market condition adjustments
  switch (marketCondition.marketState) {
    case 'HIGH_VOLATILITY':
      multiplier *= 0.5;
      break;
    case 'LOW_VOLATILITY':
      multiplier *= 1.2;
      break;
  }

  // News impact adjustments
  if (newsImpact.expectedVolatility > 0.5) {
    multiplier *= 0.7; // Reduce size during high-impact news
  }

  // Trend strength adjustment
  multiplier *= (0.5 + marketCondition.trend.strength);

  // ML prediction confidence adjustment
  multiplier *= (0.5 + probability);

  return baseSize * multiplier;
};

const calculateExitLevels = (tradeData, marketCondition, newsImpact) => {
  const { entry, type } = tradeData;
  const { volatility } = marketCondition;

  // Adjust ATR based on news impact
  const baseAtr = volatility * entry;
  const adjustedAtr = baseAtr * (1 + newsImpact.expectedVolatility);
  
  const direction = type === 'LONG' ? 1 : -1;
  
  // Dynamic exit levels based on market conditions
  return {
    stopLoss: entry - (direction * adjustedAtr * 1.5),
    takeProfit: entry + (direction * adjustedAtr * 
      (newsImpact.expectedVolatility > 0.5 ? 3 : 2.5))
  };
};
