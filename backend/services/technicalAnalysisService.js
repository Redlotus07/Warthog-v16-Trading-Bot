// backend/services/technicalAnalysisService.js
import { technicalindicators } from 'technicalindicators';

class TechnicalAnalysisService {
  constructor() {
    this.indicators = {
      trend: ['sma', 'ema', 'macd', 'adx'],
      momentum: ['rsi', 'stochastic', 'cci', 'mfi'],
      volatility: ['bollinger', 'atr', 'standardDeviation'],
      volume: ['obv', 'vwap', 'accumDist']
    };
  }

  async analyzeTrend(marketData) {
    const {prices, volume, high, low} = marketData;
    
    const analysis = {
      ema: this.calculateMultipleEMA(prices),
      macd: this.calculateMACD(prices),
      adx: this.calculateADX(high, low, prices),
      trendStrength: 0,
      trendDirection: null
    };

    // Determine trend strength and direction
    analysis.trendStrength = this.calculateTrendStrength(analysis);
    analysis.trendDirection = this.determineTrendDirection(analysis);

    return analysis;
  }

  calculateMultipleEMA(prices) {
    return {
      ema9: technicalindicators.EMA.calculate({period: 9, values: prices}),
      ema21: technicalindicators.EMA.calculate({period: 21, values: prices}),
      ema50: technicalindicators.EMA.calculate({period: 50, values: prices}),
      ema200: technicalindicators.EMA.calculate({period: 200, values: prices})
    };
  }

  calculateMACD(prices) {
    return technicalindicators.MACD.calculate({
      fastPeriod: 12,
      slowPeriod: 26,
      signalPeriod: 9,
      values: prices,
      SimpleMAOscillator: false,
      SimpleMASignal: false
    });
  }

  calculateADX(high, low, close, period = 14) {
    return technicalindicators.ADX.calculate({
      high,
      low,
      close,
      period
    });
  }

  async analyzeSupportsAndResistance(prices) {
    const levels = {
      supports: [],
      resistances: [],
      dynamic: {
        fibonacci: this.calculateFibonacciLevels(prices),
        pivotPoints: this.calculatePivotPoints(prices)
      }
    };

    // Find static support and resistance levels
    levels.supports = this.findSupportLevels(prices);
    levels.resistances = this.findResistanceLevels(prices);

    return levels;
  }

  calculateFibonacciLevels(prices) {
    const high = Math.max(...prices);
    const low = Math.min(...prices);
    const diff = high - low;

    return {
      level0: low,
      level236: low + diff * 0.236,
      level382: low + diff * 0.382,
      level500: low + diff * 0.5,
      level618: low + diff * 0.618,
      level786: low + diff * 0.786,
      level1000: high
    };
  }

  calculatePivotPoints(prices, high, low) {
    const pp = (high + low + prices[prices.length - 1]) / 3;
    
    return {
      pp,
      r1: 2 * pp - low,
      r2: pp + (high - low),
      r3: high + 2 * (pp - low),
      s1: 2 * pp - high,
      s2: pp - (high - low),
      s3: low - 2 * (high - pp)
    };
  }

  async analyzeVolatility(marketData) {
    const {prices, high, low} = marketData;
    
    return {
      bollinger: this.calculateBollingerBands(prices),
      atr: this.calculateATR(high, low, prices),
      volatilityIndex: this.calculateVolatilityIndex(prices)
    };
  }

  calculateBollingerBands(prices, period = 20, stdDev = 2) {
    return technicalindicators.BollingerBands.calculate({
      period,
      values: prices,
      stdDev
    });
  }

  calculateATR(high, low, close, period = 14) {
    return technicalindicators.ATR.calculate({
      high,
      low,
      close,
      period
    });
  }

  calculateVolatilityIndex(prices, period = 14) {
    const returns = this.calculateReturns(prices);
    const stdDev = this.calculateStandardDeviation(returns, period);
    return stdDev * Math.sqrt(252); // Annualized volatility
  }

  async analyzeMomentum(marketData) {
    const {prices, volume} = marketData;
    
    return {
      rsi: this.calculateRSI(prices),
      stochastic: this.calculateStochastic(marketData),
      mfi: this.calculateMFI(marketData),
      momentum: this.calculateMomentumIndicator(prices)
    };
  }

  calculateRSI(prices, period = 14) {
    return technicalindicators.RSI.calculate({
      values: prices,
      period
    });
  }

  calculateStochastic(marketData, period = 14, signalPeriod = 3) {
    const {high, low, close} = marketData;
    return technicalindicators.Stochastic.calculate({
      high,
      low,
      close,
      period,
      signalPeriod
    });
  }

  calculateMFI(marketData, period = 14) {
    const {high, low, close, volume} = marketData;
    return technicalindicators.MFI.calculate({
      high,
      low,
      close,
      volume,
      period
    });
  }

  identifyPatterns(marketData) {
    const patterns = {
      candlestick: this.identifyCandlestickPatterns(marketData),
      chart: this.identifyChartPatterns(marketData)
    };

    return patterns;
  }

  identifyCandlestickPatterns(marketData) {
    const {open, high, low, close} = marketData;
    const patterns = [];

    // Check for various candlestick patterns
    if (this.isDoji(open, high, low, close)) patterns.push('doji');
    if (this.isHammer(open, high, low, close)) patterns.push('hammer');
    if (this.isEngulfing(marketData)) patterns.push('engulfing');
    // Add more pattern recognition...

    return patterns;
  }

  identifyChartPatterns(marketData) {
    const patterns = [];

    // Check for various chart patterns
    if (this.isHeadAndShoulders(marketData)) patterns.push('headAndShoulders');
    if (this.isDoubleTop(marketData)) patterns.push('doubleTop');
    if (this.isTriangle(marketData)) patterns.push('triangle');
    // Add more pattern recognition...

    return patterns;
  }

  generateSignals(analysis) {
    const signals = {
      trend: this.generateTrendSignals(analysis),
      momentum: this.generateMomentumSignals(analysis),
      volatility: this.generateVolatilitySignals(analysis),
      patterns: this.generatePatternSignals(analysis),
      strength: 0,
      recommendation: null
    };

    // Combine all signals to generate final recommendation
    signals.strength = this.calculateSignalStrength(signals);
    signals.recommendation = this.generateFinal Recommendation(signals);

    return signals;
  }

  generateTrendSignals(analysis) {
    const trendSignals = {
      buy: false,
      sell: false,
      hold: true
    };

    // Generate trend-based signals
    if (analysis.trendDirection === 'up') trendSignals.buy = true;
    else if (analysis.trendDirection === 'down') trendSignals.sell = true;

    return trendSignals;
  }

  generateMomentumSignals(analysis) {
    const momentumSignals = {
      buy: false,
      sell: false,
      hold: true
    };

    // Generate momentum-based signals
    if (analysis.momentum > 50) momentumSignals.buy = true;
    else if (analysis.momentum < 50) momentumSignals.sell = true;

    return momentumSignals;
  }

  generateVolatilitySignals(analysis) {
    const volatilitySignals = {
      buy: false,
      sell: false,
      hold: true
    };

    // Generate volatility-based signals
    if (analysis.volatility < 20) volatilitySignals.buy = true;
    else if (analysis.volatility > 80) volatilitySignals.sell = true;

    return volatilitySignals;
  }

  generatePatternSignals(analysis) {
    const patternSignals = {
      buy: false,
      sell: false,
      hold: true
    };

    // Generate pattern-based signals
    if (analysis.patterns.includes('hammer')) patternSignals.buy = true;
    else if (analysis.patterns.includes('shootingStar')) patternSignals.sell = true;

    return patternSignals;
  }

  calculateSignalStrength(signals) {
    let strength = 0;

    // Calculate signal strength based on individual signal strengths
    if (signals.trend.buy) strength += 2;
    if (signals.momentum.buy) strength += 1;
    if (signals.volatility.buy) strength += 1;
    if (signals.patterns.buy) strength += 1;

    if (signals.trend.sell) strength -= 2;
    if (signals.momentum.sell) strength -= 1;
    if (signals.volatility.sell) strength -= 1;
    if (signals.patterns.sell) strength -= 1;

    return strength;
  }

  generateFinalRecommendation(signals) {
    let recommendation = null;

    // Generate final recommendation based on signal strength
    if (signals.strength > 2) recommendation = 'Buy';
    else if (signals.strength < -2) recommendation = 'Sell';
    else recommendation = 'Hold';

    return recommendation;
  }
}

export const technicalAnalysisService = new TechnicalAnalysisService();
