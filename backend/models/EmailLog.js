import mongoose from 'mongoose';

const emailLogSchema = new mongoose.Schema({
  campaignId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Campaign',
    required: true
  },
  leadId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lead',
    required: true
  },
  type: {
    type: String,
    enum: ['initial', 'followup1', 'followup2'],
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  },
  providerMessageId: {
    type: String
  },
  status: {
    type: String,
    enum: ['sent', 'failed'],
    required: true
  },
  errorMessage: {
    type: String
  },
  sentAt: {
    type: Date,
    default: Date.now
  }
});

emailLogSchema.index({ campaignId: 1, sentAt: -1 });
emailLogSchema.index({ leadId: 1 });

export default mongoose.model('EmailLog', emailLogSchema);
