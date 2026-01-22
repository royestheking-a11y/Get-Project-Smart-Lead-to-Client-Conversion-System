import express from 'express';
import Campaign from '../models/Campaign.js';
import Lead from '../models/Lead.js';
import EmailTemplate from '../models/EmailTemplate.js';
import Job from '../models/Job.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// All routes require auth
router.use(requireAuth);

// Start sending (create jobs)
router.post('/start', async (req, res) => {
  try {
    const { campaignId } = req.body;

    if (!campaignId) {
      return res.status(400).json({ error: 'Campaign ID is required' });
    }

    // Verify campaign belongs to user and is active
    const campaign = await Campaign.findOne({
      _id: campaignId,
      userId: req.user.userId
    });

    if (!campaign) {
      return res.status(404).json({ error: 'Campaign not found' });
    }

    if (campaign.status !== 'active') {
      return res.status(400).json({ error: 'Campaign is not active' });
    }

    // Count jobs already scheduled today
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const todayJobsCount = await Job.countDocuments({
      campaignId,
      status: { $in: ['PENDING', 'RUNNING'] },
      createdAt: { $gte: todayStart, $lte: todayEnd }
    });

    const remainingLimit = Math.max(0, campaign.dailyLimit - todayJobsCount);

    if (remainingLimit === 0) {
      return res.json({
        jobsCreated: 0,
        message: 'Daily limit already reached'
      });
    }

    // Get ready leads (exclude replied/won/lost/done)
    const leads = await Lead.find({
      campaignId,
      status: 'READY',
      doNotContact: false
    }).limit(remainingLimit);

    if (leads.length === 0) {
      return res.json({
        jobsCreated: 0,
        message: 'No ready leads found'
      });
    }

    // Get templates by category
    const templates = await EmailTemplate.find({ campaignId });
    const templateMap = {};
    templates.forEach(t => {
      templateMap[t.category] = t._id;
    });

    // Create jobs with random delays
    const jobs = [];
    const now = new Date();
    let delaySeconds = 0;

    for (const lead of leads) {
      const templateId = templateMap[lead.category] || templates[0]?._id;

      if (!templateId) {
        continue; // Skip if no template
      }

      // Random delay between rateLimitMinSec and rateLimitMaxSec
      const randomDelay = Math.floor(
        Math.random() * (campaign.rateLimitMaxSec - campaign.rateLimitMinSec + 1) +
        campaign.rateLimitMinSec
      );

      delaySeconds += randomDelay;
      const runAt = new Date(now.getTime() + delaySeconds * 1000);

      jobs.push({
        type: 'SEND_EMAIL',
        campaignId,
        leadId: lead._id,
        templateId,
        runAt,
        status: 'PENDING',
        attempts: 0
      });
    }

    if (jobs.length > 0) {
      await Job.insertMany(jobs);
    }

    const plannedDuration = delaySeconds;

    res.json({
      jobsCreated: jobs.length,
      plannedDuration: plannedDuration,
      message: `Created ${jobs.length} jobs`
    });
  } catch (error) {
    console.error('Start sending error:', error);
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
});

// Stop sending
router.post('/stop', async (req, res) => {
  try {
    const { campaignId } = req.body;

    if (!campaignId) {
      return res.status(400).json({ error: 'Campaign ID is required' });
    }

    // Verify campaign belongs to user
    const campaign = await Campaign.findOne({
      _id: campaignId,
      userId: req.user.userId
    });

    if (!campaign) {
      return res.status(404).json({ error: 'Campaign not found' });
    }

    // Cancel pending jobs
    const result = await Job.updateMany(
      {
        campaignId,
        status: 'PENDING'
      },
      {
        status: 'CANCELLED'
      }
    );

    // Optionally pause campaign
    campaign.status = 'paused';
    await campaign.save();

    res.json({
      cancelled: result.modifiedCount,
      message: 'Sending stopped and campaign paused'
    });
  } catch (error) {
    console.error('Stop sending error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Stats
router.get('/stats', async (req, res) => {
  try {
    const { campaignId } = req.query;

    if (!campaignId) {
      return res.status(400).json({ error: 'Campaign ID is required' });
    }

    // Verify campaign belongs to user
    const campaign = await Campaign.findOne({
      _id: campaignId,
      userId: req.user.userId
    });

    if (!campaign) {
      return res.status(404).json({ error: 'Campaign not found' });
    }

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const [
      leadsImported,
      readyCount,
      sentToday,
      totalSent,
      repliedCount,
      failedCount,
      jobsPending,
      jobsRunning
    ] = await Promise.all([
      Lead.countDocuments({ campaignId }),
      Lead.countDocuments({ campaignId, status: 'READY' }),
      Lead.countDocuments({
        campaignId,
        status: { $in: ['SENT', 'FOLLOWUP_1_SENT', 'FOLLOWUP_2_SENT'] },
        lastContactedAt: { $gte: todayStart, $lte: todayEnd }
      }),
      Lead.countDocuments({
        campaignId,
        status: { $in: ['SENT', 'FOLLOWUP_1_SENT', 'FOLLOWUP_2_SENT'] }
      }),
      Lead.countDocuments({ campaignId, status: 'REPLIED' }),
      EmailLog.countDocuments({ campaignId, status: { $in: ['failed', 'bounced'] } }),
      Job.countDocuments({ campaignId, status: 'PENDING' }),
      Job.countDocuments({ campaignId, status: 'RUNNING' })
    ]);

    res.json({
      leadsImported,
      readyCount,
      sentToday,
      totalSent,
      repliedCount,
      failedCount,
      jobsPending,
      jobsRunning
    });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
