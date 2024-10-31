// backend/services/technicalAnalysis.js
import { technicalindicators } from 'technicalindicators';

class TechnicalAnalysisService {
  calculateMACD(prices, fastPeriod = 12, slowPeriod = 26, signalPeriod = 9) {
    const macdInput = {
      values: prices,
      fastPeriod,
      slowPeriod,
      signalPeriod,
      SimpleMAOscillator: false,
      SimpleMASignal: false
    };

    return technicalindicators.MACD.calculate(macdInput);
  }

  calculateRSI(prices, period = 14) {
    const rsiInput = {
      values: prices,
      period
    };

    return technicalindicators.RSI.calculate(rsiInput);
  }

  calculateBollingerBands(prices, period = 20, stdDev = 2) {
    const bbInput = {
      values: prices,
      period,
      stdDev
    };

    return technicalindicators.BollingerBands.calculate(bbInput);
  }

  analyzeTrend(prices) {
    const sma20 = technicalindicators.SMA.calculate({
      values: prices,
      period: 20
    });

    const sma50 = technicalindicators.SMA.calculate({
      values: prices,
      period: 50
    });

    const lastSma20 = sma20[sma20.length - 1];
    const lastSma50 = sma50[sma50.length - 1];
    const prevSma20 = sma20[sma20.length - 2];
    const prevSma50 = sma50[sma50.length - 2];

    return {
      trend: lastSma20 > lastSma50 ? 'UPTREND' : 'DOWNTREND',
      strength: Math.abs(lastSma20 - lastSma50) / lastSma50,
      momentum: (lastSma20 - prevSma20) / prevSma20
    };
  }
}

export const technicalAnalysisService = new TechnicalAnalysisService();
