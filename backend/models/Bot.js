// backend/models/Bot.js
import mongoose from 'mongoose';

const botSchema = new mongoose.Schema({
  active: {
    type: Boolean,
    default: false
  },
  autoShutdownEnabled: {
    type: Boolean,
    default: false
  },
  balance: {
    type: Number,
    required: true,
    default: 10000
  },
  peakBalance: {
    type: Number,
    default: 10000
  },
  settings: {
    riskPerTrade: {
      type: Number,
      default: 1
    },
    maxOpenTrades: {
      type: Number,
      default: 3
    },
    tradingPairs: {
      type: [String],
      default: ['BTC/USD', 'ETH/USD', 'XAU/USD', 'XAG/USD']
    },
    minimumConfidence: {
      type: Number,
      default: 0.7
    },
    maxDrawdown: {
      type: Number,
      default: -5
    }
  },
  errors: [{
    message: String,
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  performance: {
    totalTrades: {
      type: Number,
      default: 0
    },
    winRate: {
      type: Number,
      default: 0
    },
    profitFactor: {
      type: Number,
      default: 0
    },
    averageWin: {
      type: Number,
      default: 0
    },
    averageLoss: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true
});

export const Bot = mongoose.model('Bot', botSchema);
