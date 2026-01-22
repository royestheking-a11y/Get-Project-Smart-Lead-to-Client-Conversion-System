import mongoose from 'mongoose';

const emailTemplateSchema = new mongoose.Schema({
  campaignId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Campaign',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    enum: ['NO_WEBSITE', 'HAS_WEBSITE', 'WEAK_WEBSITE', 'SEO_WEAK', 'ECOMMERCE', 'FOLLOWUP_1', 'FOLLOWUP_2', 'AUTHORITY', 'EXECUTIVE', 'RELATIONSHIP'],
    required: true
  },
  subjectTemplate: {
    type: String,
    required: true
  },
  bodyTemplate: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('EmailTemplate', emailTemplateSchema);
