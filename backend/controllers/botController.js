// backend/controllers/botController.js
import { Bot } from '../models/Bot.js';
import { tradingService } from '../services/tradingService.js';

export const startTrading = async (req, res) => {
  try {
    const botId = req.params.botId;
    const bot = await Bot.findById(botId);
    if (!bot) {
      return res.status(404).json({ message: 'Bot not found' });
    }

    bot.active = true;
    await bot.save();

    // Start the trading cycle
    setInterval(async () => {
      for (const pair of bot.settings.tradingPairs) {
        await tradingService.analyzeTradingOpportunity(botId, pair);
      }
      await tradingService.monitorOpenTrades(botId);
    }, 60000); // Run every minute

    res.json({ message: 'Trading started successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error starting trading', error: error.message });
  }
};

export const stopTrading = async (req, res) => {
  try {
    const botId = req.params.botId;
    const bot = await Bot.findById(botId);
    if (!bot) {
      return res.status(404).json({ message: 'Bot not found' });
    }

    bot.active = false;
    await bot.save();

    res.json({ message: 'Trading stopped successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error stopping trading', error: error.message });
  }
};
