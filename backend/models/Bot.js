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
  }
}, {
  timestamps: true
});

export const Bot = mongoose.model('Bot', botSchema);
