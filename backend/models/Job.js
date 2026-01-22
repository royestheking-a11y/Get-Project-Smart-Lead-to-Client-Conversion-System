import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['SEND_EMAIL', 'FOLLOWUP_1_EMAIL', 'FOLLOWUP_2_EMAIL'],
    required: true
  },
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
  templateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'EmailTemplate'
  },
  runAt: {
    type: Date,
    required: true,
    index: true
  },
  status: {
    type: String,
    enum: ['PENDING', 'RUNNING', 'DONE', 'FAILED', 'CANCELLED'],
    default: 'PENDING',
    index: true
  },
  attempts: {
    type: Number,
    default: 0
  },
  lastError: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

jobSchema.index({ status: 1, runAt: 1 });
jobSchema.index({ campaignId: 1, status: 1 });

export default mongoose.model('Job', jobSchema);
