import mongoose from 'mongoose';

const leadSchema = new mongoose.Schema({
  campaignId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Campaign',
    required: true
  },
  contactName: {
    type: String,
    trim: true
  },
  companyName: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  website: {
    type: String,
    trim: true
  },
  location: {
    type: String,
    trim: true
  },
  industry: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    enum: [null, 'RESTAURANT', 'SALON', 'SHOP', 'ECOMMERCE', 'HEALTHCARE', 'EDUCATION', 'FITNESS', 'PORTFOLIO', 'REAL_ESTATE', 'AGENCY', 'GENERAL', 'SEO', 'FOLLOWUP'],
    default: null
  },
  confidenceScore: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['IMPORTED', 'READY', 'SENT', 'FOLLOWUP_1_SENT', 'FOLLOWUP_2_SENT', 'REPLIED', 'BOUNCED', 'FAILED', 'DO_NOT_CONTACT', 'DONE', 'WON', 'LOST'],
    default: 'IMPORTED'
  },
  lastContactedAt: {
    type: Date
  },
  doNotContact: {
    type: Boolean,
    default: false
  },
  notes: {
    type: String,
    trim: true
  },
  smartSummary: {
    type: String,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

leadSchema.index({ campaignId: 1, email: 1 });
leadSchema.index({ campaignId: 1, status: 1 });
leadSchema.index({ campaignId: 1, category: 1 });

export default mongoose.model('Lead', leadSchema);
