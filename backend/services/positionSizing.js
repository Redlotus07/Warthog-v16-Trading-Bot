// backend/services/positionSizing.js
import { mlService } from './mlService.js';
import { riskManagementService } from './riskManagementService.js';

class PositionSizingService {
  constructor() {
    this.baseRiskPercentage = 1; // 1% base risk per trade
    this.maxPositionSize = 5; // 5% of account balance
    this.volatilityMultiplier = 0.8; // Reduce position size in high volatility
  }

  async calculatePosition(pair, tradeData) {
    const {
      accountBalance,
      confidence,
      volatility,
      marketCondition,
      stopLoss,
      entry
    } = tradeData;

    // Base position size calculation
    let baseSize = this.calculateBaseSize(accountBalance, this.baseRiskPercentage);

    // Adjust based on ML confidence
    const confidenceMultiplier = this.getConfidenceMultiplier(confidence);
    
    // Adjust for volatility
    const volatilityAdjustment = this.calculateVolatilityAdjustment(volatility);
    
    // Adjust for market conditions
    const marketConditionMultiplier = this.getMarketConditionMultiplier(marketCondition);

    // Calculate risk per pip
    const riskPerPip = Math.abs(entry - stopLoss);

    // Final position size calculation
    let finalSize = baseSize * confidenceMultiplier * volatilityAdjustment * marketConditionMultiplier;

    // Ensure position size doesn't exceed maximum allowed
    finalSize = Math.min(finalSize, accountBalance * (this.maxPositionSize / 100));

    // Adjust position size based on risk per pip
    if (riskPerPip > 0) {
      finalSize = this.adjustForRiskPerPip(finalSize, riskPerPip, accountBalance);
    }

    return {
      size: finalSize,
      riskAmount: this.calculateRiskAmount(finalSize, entry, stopLoss),
      adjustments: {
        confidence: confidenceMultiplier,
        volatility: volatilityAdjustment,
        marketCondition: marketConditionMultiplier
      }
    };
  }

  calculateBaseSize(accountBalance, riskPercentage) {
    return accountBalance * (riskPercentage / 100);
  }

  getConfidenceMultiplier(confidence) {
    // Scale position size based on ML confidence
    return 0.5 + confidence;
  }

  calculateVolatilityAdjustment(volatility) {
    // Reduce position size in high volatility environments
    return Math.max(0.2, 1 - (volatility * this.volatilityMultiplier));
  }

  getMarketConditionMultiplier(marketCondition) {
    switch (marketCondition) {
      case 'TRENDING':
        return 1.2;
      case 'RANGING':
        return 0.8;
      case 'HIGH_VOLATILITY':
        return 0.6;
      default:
        return 1.0;
    }
  }

  adjustForRiskPerPip(size, riskPerPip, accountBalance) {
    const maxRiskAmount = accountBalance * (this.baseRiskPercentage / 100);
    const adjustedSize = maxRiskAmount / riskPerPip;
    return Math.min(size, adjustedSize);
  }

  calculateRiskAmount(size, entry, stopLoss) {
    return Math.abs(entry - stopLoss) * size;
  }
}

export const positionSizingService = new PositionSizingService();
