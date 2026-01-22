import express from 'express';
import Campaign from '../models/Campaign.js';
import Lead from '../models/Lead.js';
import EmailLog from '../models/EmailLog.js';
import EmailTemplate from '../models/EmailTemplate.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// All routes require auth
router.use(requireAuth);

// Create campaign
router.post('/', async (req, res) => {
  try {
    const {
      name,
      dailyLimit = 20,
      sendingWindowStart = '10:00',
      sendingWindowEnd = '20:00',
      rateLimitMinSec = 60,
      rateLimitMaxSec = 120,
      followupsEnabled = true
    } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Campaign name is required' });
    }

    // Validate limits
    if (dailyLimit < 1 || dailyLimit > 200) {
      return res.status(400).json({ error: 'Daily limit must be between 1 and 200' });
    }

    const campaign = await Campaign.create({
      userId: req.user.userId,
      name,
      dailyLimit,
      sendingWindowStart,
      sendingWindowEnd,
      rateLimitMinSec,
      rateLimitMaxSec,
      followupsEnabled,
      status: 'active'
    });

    res.status(201).json(campaign);
  } catch (error) {
    console.error('Create campaign error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// List campaigns
router.get('/', async (req, res) => {
  try {
    const campaigns = await Campaign.find({ userId: req.user.userId })
      .sort({ createdAt: -1 });

    // Add lead count for each campaign
    // Add stats for each campaign
    const campaignsWithCounts = await Promise.all(
      campaigns.map(async (campaign) => {
        const leadCount = await Lead.countDocuments({ campaignId: campaign._id });
        const sentCount = await Lead.countDocuments({
          campaignId: campaign._id,
          status: { $in: ['SENT', 'FOLLOWUP_1_SENT', 'FOLLOWUP_2_SENT', 'REPLIED', 'WON', 'LOST'] }
        });

        // Count emails sent today for this campaign
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const todayCount = await EmailLog.countDocuments({
          campaignId: campaign._id,
          sentAt: { $gte: startOfDay },
          status: 'sent'
        });

        return {
          ...campaign.toObject(),
          leadCount,
          sentCount,
          todayCount
        };
      })
    );

    res.json(campaignsWithCounts);
  } catch (error) {
    console.error('List campaigns error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get single campaign
router.get('/:id', async (req, res) => {
  try {
    const campaign = await Campaign.findOne({
      _id: req.params.id,
      userId: req.user.userId
    });

    if (!campaign) {
      return res.status(404).json({ error: 'Campaign not found' });
    }

    res.json(campaign);
  } catch (error) {
    console.error('Get campaign error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update campaign
router.patch('/:id', async (req, res) => {
  try {
    const campaign = await Campaign.findOne({
      _id: req.params.id,
      userId: req.user.userId
    });

    if (!campaign) {
      return res.status(404).json({ error: 'Campaign not found' });
    }

    const allowedUpdates = [
      'name',
      'dailyLimit',
      'sendingWindowStart',
      'sendingWindowEnd',
      'rateLimitMinSec',
      'rateLimitMaxSec',
      'followupsEnabled'
    ];

    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        campaign[field] = req.body[field];
      }
    });

    if (req.body.dailyLimit !== undefined) {
      if (req.body.dailyLimit < 1 || req.body.dailyLimit > 200) {
        return res.status(400).json({ error: 'Daily limit must be between 1 and 200' });
      }
    }

    await campaign.save();
    res.json(campaign);
  } catch (error) {
    console.error('Update campaign error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Pause campaign
router.post('/:id/pause', async (req, res) => {
  try {
    const campaign = await Campaign.findOne({
      _id: req.params.id,
      userId: req.user.userId
    });

    if (!campaign) {
      return res.status(404).json({ error: 'Campaign not found' });
    }

    campaign.status = 'paused';
    await campaign.save();

    res.json(campaign);
  } catch (error) {
    console.error('Pause campaign error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Resume campaign
router.post('/:id/resume', async (req, res) => {
  try {
    const campaign = await Campaign.findOne({
      _id: req.params.id,
      userId: req.user.userId
    });

    if (!campaign) {
      return res.status(404).json({ error: 'Campaign not found' });
    }

    campaign.status = 'active';
    await campaign.save();

    res.json(campaign);
  } catch (error) {
    console.error('Resume campaign error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete campaign
router.delete('/:id', async (req, res) => {
  try {
    const campaign = await Campaign.findOne({
      _id: req.params.id,
      userId: req.user.userId
    });

    if (!campaign) {
      return res.status(404).json({ error: 'Campaign not found' });
    }

    await Campaign.deleteOne({ _id: req.params.id });

    // Optional: Cascade delete leads and templates
    await Lead.deleteMany({ campaignId: req.params.id });
    await EmailTemplate.deleteMany({ campaignId: req.params.id });

    res.json({ message: 'Campaign deleted successfully' });
  } catch (error) {
    console.error('Delete campaign error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
