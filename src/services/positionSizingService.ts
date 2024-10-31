// src/services/positionSizingService.ts
class PositionSizingService {
  calculatePosition(params: PositionParams): PositionSize {
    const { accountBalance, riskPerTrade, entryPrice, stopLoss } = params;
    
    const riskAmount = accountBalance * (riskPerTrade / 100);
    const stopDistance = Math.abs(entryPrice - stopLoss);
    const positionSize = riskAmount / stopDistance;

    return {
      size: positionSize,
      riskAmount,
      maxLoss: riskAmount,
      margin: this.calculateRequiredMargin(positionSize, entryPrice)
    };
  }
}
