import express from 'express';
import EmailLog from '../models/EmailLog.js';
import Lead from '../models/Lead.js';
import Campaign from '../models/Campaign.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// All routes require auth
router.use(requireAuth);

// List email logs
router.get('/', async (req, res) => {
  try {
    const {
      campaignId,
      leadId,
      status,
      type,
      page = 1,
      limit = 50
    } = req.query;

    // Build query
    const query = {};

    if (campaignId) {
      // Verify campaign belongs to user
      const campaign = await Campaign.findOne({
        _id: campaignId,
        userId: req.user.userId
      });

      if (!campaign) {
        return res.status(404).json({ error: 'Campaign not found' });
      }

      query.campaignId = campaignId;
    } else {
      // If no campaign specified, get logs for all user's campaigns
      const userCampaigns = await Campaign.find({ userId: req.user.userId }).select('_id');
      const campaignIds = userCampaigns.map(c => c._id);
      query.campaignId = { $in: campaignIds };
    }

    if (leadId) {
      query.leadId = leadId;
    }

    if (status) {
      query.status = status;
    }

    if (type) {
      query.type = type;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [logs, total] = await Promise.all([
      EmailLog.find(query)
        .populate('leadId', 'companyName email')
        .sort({ sentAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      EmailLog.countDocuments(query)
    ]);

    res.json({
      logs,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / parseInt(limit))
    });
  } catch (error) {
    console.error('List email logs error:', error);
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
});

// Get single email log
router.get('/:id', async (req, res) => {
  try {
    const log = await EmailLog.findById(req.params.id)
      .populate('leadId', 'companyName email')
      .populate('campaignId', 'name');

    if (!log) {
      return res.status(404).json({ error: 'Email log not found' });
    }

    // Verify campaign belongs to user
    const campaign = await Campaign.findOne({
      _id: log.campaignId,
      userId: req.user.userId
    });

    if (!campaign) {
      return res.status(404).json({ error: 'Campaign not found' });
    }

    res.json(log);
  } catch (error) {
    console.error('Get email log error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
