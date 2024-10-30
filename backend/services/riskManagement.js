import { Trade } from '../models/Trade.js';
import { User } from '../models/User.js';

export const checkRiskLimits = async (userId, tradeData) => {
  try {
    const user = await User.findById(userId);
    const openTrades = await Trade.countDocuments({
      user: userId,
      status: 'OPEN'
    });

    if (openTrades >= user.settings.maxOpenTrades) {
      return {
        allowed: false,
        message: 'Maximum number of open trades reached'
      };
    }

    const riskAmount = calculateRiskAmount(tradeData, user.settings.riskPerTrade);
    if (riskAmount > user.settings.maxRiskPerTrade) {
      return {
        allowed: false,
        message: 'Trade risk exceeds maximum allowed risk per trade'
      };
    }

    return { allowed: true };
  } catch (error) {
    throw new Error('Failed to check risk limits');
  }
};

const calculateRiskAmount = (tradeData, riskPercentage) => {
  const { entry, stopLoss, size } = tradeData;
  return Math.abs(entry - stopLoss) * size * (riskPercentage / 100);
};
