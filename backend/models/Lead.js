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
    enum: [null, 'NO_WEBSITE', 'HAS_WEBSITE', 'WEAK_WEBSITE', 'SEO_WEAK', 'ECOMMERCE', 'DIGITAL_MARKETING', 'POOR_UI_SEO'],
    default: null
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
  createdAt: {
    type: Date,
    default: Date.now
  }
});

leadSchema.index({ campaignId: 1, email: 1 });
leadSchema.index({ campaignId: 1, status: 1 });
leadSchema.index({ campaignId: 1, category: 1 });

export default mongoose.model('Lead', leadSchema);
