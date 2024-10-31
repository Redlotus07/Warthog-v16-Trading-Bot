// backend/controllers/botController.js
import { Bot } from '../models/Bot.js';
import { Trade } from '../models/Trade.js';

export const toggleBot = async (req, res) => {
  try {
    const { active } = req.body;
    await Bot.findOneAndUpdate({}, { active }, { upsert: true });
    res.json({ message: `Bot ${active ? 'activated' : 'deactivated'} successfully` });
  } catch (error) {
    res.status(500).json({ message: 'Failed to toggle bot status' });
  }
};

export const shutdownBot = async (req, res) => {
  try {
    await Bot.findOneAndUpdate({}, { active: false }, { upsert: true });
    res.json({ message: 'Bot shut down successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to shut down bot' });
  }
};

export const checkAutoShutdown = async () => {
  const bot = await Bot.findOne({});
  if (bot && bot.active && bot.autoShutdownEnabled) {
    const openTrades = await Trade.countDocuments({ status: 'OPEN' });
    if (openTrades === 0) {
      await Bot.findOneAndUpdate({}, { active: false });
      console.log('Bot auto-shutdown triggered: No open trades');
    }
  }
};
