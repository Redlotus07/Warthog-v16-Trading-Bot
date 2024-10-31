// backend/services/tradingService.js
import { Bot } from '../models/Bot.js';
import { Trade } from '../models/Trade.js';
import { mlService } from './mlService.js';
import { marketDataService } from './marketDataService.js';
import { positionSizingService } from './positionSizingService.js';
import { riskManagementService } from './riskManagementService.js';
import { newsService } from './newsTrading/newsService.js';

class TradingService {
  constructor() {
    this.activeStrategies = new Map();
    this.tradingPairs = ['BTC/USD', 'ETH/USD', 'XAU/USD', 'XAG/USD'];
    this.minimumConfidence = 0.7;
    this.maxDrawdown = -5; // 5% maximum drawdown
  }

  async executeTradingCycle() {
    const bot = await Bot.findOne({ active: true });
    if (!bot) return;

    try {
      // Check overall market conditions and risk levels
      const marketHealth = await this.assessMarketHealth();
      if (!marketHealth.isSafe) {
        console.log('Market conditions unfavorable:', marketHealth.reason);
        return;
      }

      // Execute trading logic for each pair
      await Promise.all(
        this.tradingPairs.map(pair => this.analyzePairAndTrade(pair, bot))
      );

      // Manage existing positions
      await this.manageExistingPositions();

      // Update performance metrics
      await this.updatePerformanceMetrics(bot);

    } catch (error) {
      console.error('Error in trading cycle:', error);
      await this.handleTradingError(error, bot);
    }
  }

  async analyzePairAndTrade(pair, bot) {
    try {
      // Get market data and analyze conditions
      const marketData = await marketDataService.getLatestData(pair);
      const newsImpact = await newsService.analyzeNewsImpact(pair);
      
      // Skip if high-impact news is pending
      if (newsImpact.highImpactPending) {
        console.log(`Skipping ${pair} due to pending high-impact news`);
        return;
      }

      // Get ML predictions and market analysis
      const prediction = await mlService.predictTradeSuccess(pair, marketData);
      const marketAnalysis = await this.analyzeMarketConditions(pair, marketData);

      // Determine if we should enter a trade
      if (this.shouldEnterTrade(prediction, marketAnalysis, newsImpact)) {
        await this.executeEntry(pair, bot, {
          prediction,
          marketData,
          marketAnalysis,
          newsImpact
        });
      }

    } catch (error) {
      console.error(`Error analyzing ${pair}:`, error);
      throw error;
    }
  }

  async analyzeMarketConditions(pair, marketData) {
    const volatility = await this.calculateVolatility(marketData);
    const trend = await this.analyzeTrend(marketData);
    const support = await this.findNearestSupport(marketData);
    const resistance = await this.findNearestResistance(marketData);

    return {
      volatility,
      trend,
      support,
      resistance,
      marketStructure: this.analyzeMarketStructure(marketData),
      momentum: this.calculateMomentum(marketData)
    };
  }

  shouldEnterTrade(prediction, marketAnalysis, newsImpact) {
    // Combined analysis for trade entry decision
    const conditions = [
      prediction.confidence >= this.minimumConfidence,
      marketAnalysis.volatility.isWithinLimits,
      !newsImpact.highImpactPending,
      this.checkRiskExposure(),
      this.validateMarketConditions(marketAnalysis)
    ];

    return conditions.every(condition => condition === true);
  }

  async executeEntry(pair, bot, analysisData) {
    const { prediction, marketData, marketAnalysis, newsImpact } = analysisData;

    // Calculate position size and risk parameters
    const positionSize = await positionSizingService.calculatePosition(pair, {
      confidence: prediction.confidence,
      volatility: marketAnalysis.volatility,
      accountBalance: bot.balance
    });

    // Calculate entry parameters
    const entryParams = await this.calculateEntryParameters(marketData, marketAnalysis);

    // Execute trade
    const trade = await this.placeTrade({
      pair,
      type: entryParams.direction,
      entry: entryParams.price,
      stopLoss: entryParams.stopLoss,
      takeProfit: entryParams.takeProfit,
      size: positionSize,
      metadata: {
        prediction,
        marketAnalysis,
        newsImpact
      }
    });

    // Log trade and update ML model
    await this.logTradeExecution(trade);
    await mlService.updateModelWithTrade(trade);
  }

  async manageExistingPositions() {
    const openTrades = await Trade.find({ status: 'OPEN' });

    for (const trade of openTrades) {
      await this.updateTradePosition(trade);
    }
  }

  async updateTradePosition(trade) {
    const currentPrice = await marketDataService.getCurrentPrice(trade.pair);
    const marketAnalysis = await this.analyzeMarketConditions(trade.pair, {
      price: currentPrice,
      // ... other market data
    });

    // Check if we should modify the position
    if (this.shouldModifyPosition(trade, currentPrice, marketAnalysis)) {
      await this.modifyTradePosition(trade, currentPrice, marketAnalysis);
    }

    // Check if we should close the position
    if (this.shouldClosePosition(trade, currentPrice, marketAnalysis)) {
      await this.closeTradePosition(trade, currentPrice, 'STRATEGY_EXIT');
    }
  }

  async assessMarketHealth() {
    const healthChecks = await Promise.all([
      this.checkVolatilityLevels(),
      this.checkDrawdownLevels(),
      this.checkMarketCorrelations(),
      this.checkLiquidityLevels()
    ]);

    const failedChecks = healthChecks.filter(check => !check.passed);
    
    return {
      isSafe: failedChecks.length === 0,
      reason: failedChecks.map(check => check.reason).join(', ')
    };
  }

  async updatePerformanceMetrics(bot) {
    const metrics = await this.calculatePerformanceMetrics();
    
    // Update bot settings based on performance
    await this.adjustTradingParameters(bot, metrics);
    
    // Store metrics for analysis
    await this.storePerformanceMetrics(metrics);
  }

  async handleTradingError(error, bot) {
    // Log error
    console.error('Trading error:', error);

    // Update bot status
    await Bot.findByIdAndUpdate(bot._id, {
      $push: { errors: { message: error.message, timestamp: new Date() } }
    });

    // Implement safety measures if needed
    if (this.isSeriosError(error)) {
      await this.implementSafetyMeasures(bot);
    }
  }

  // Helper methods
  calculateVolatility(marketData) {
    // Implementation
  }

  analyzeTrend(marketData) {
    // Implementation
  }

  findNearestSupport(marketData) {
    // Implementation
  }

  findNearestResistance(marketData) {
    // Implementation
  }

  analyzeMarketStructure(marketData) {
    // Implementation
  }

  calculateMomentum(marketData) {
    // Implementation
  }

  // ... Additional helper methods
}

export const tradingService = new TradingService();
