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
    const sma20 = technicalindicators. EMA.calculate({ values: prices, period: 20 });
    const sma50 = technicalindicators.EMA.calculate({ values: prices, period: 50 });
    const sma100 = technicalindicators.EMA.calculate({ values: prices, period: 100 });

    if (sma20 > sma50 && sma50 > sma100) {
      return 'Bullish';
    } else if (sma20 < sma50 && sma50 < sma100) {
      return 'Bearish';
    } else {
      return 'Neutral';
    }
  }
}

export const technicalAnalysisService = new TechnicalAnalysisService();
