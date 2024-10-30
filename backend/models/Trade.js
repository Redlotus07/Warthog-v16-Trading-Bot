import mongoose from 'mongoose';

const tradeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  pair: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['LONG', 'SHORT'],
    required: true
  },
  status: {
    type: String,
    enum: ['OPEN', 'CLOSED'],
    default: 'OPEN'
  },
  entry: {
    price: {
      type: Number,
      required: true
    },
    time: {
      type: Date,
      default: Date.now
    }
  },
  exit: {
    price: Number,
    time: Date
  },
  size: {
    type: Number,
    required: true
  },
  profit: {
    type: Number,
    default: 0
  },
  stopLoss: Number,
  takeProfit: Number,
  strategy: {
    name: String,
    signals: [{
      indicator: String,
      value: mongoose.Schema.Types.Mixed,
      timestamp: Date
    }]
  }
}, {
  timestamps: true
});

export const Trade = mongoose.model('Trade', tradeSchema);
