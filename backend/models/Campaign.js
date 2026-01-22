import mongoose from 'mongoose';

const campaignSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  dailyLimit: {
    type: Number,
    default: 20,
    min: 1,
    max: 200
  },
  sendingWindowStart: {
    type: String,
    default: '10:00'
  },
  sendingWindowEnd: {
    type: String,
    default: '20:00'
  },
  rateLimitMinSec: {
    type: Number,
    default: 60
  },
  rateLimitMaxSec: {
    type: Number,
    default: 120
  },
  followupsEnabled: {
    type: Boolean,
    default: true
  },
  status: {
    type: String,
    enum: ['active', 'paused'],
    default: 'active'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Campaign', campaignSchema);
