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

    // Auto-seed built-in templates for this campaign
    const builtInTemplates = [
      {
        name: 'No Website - Initial',
        category: 'NO_WEBSITE',
        subjectTemplate: '{{companyName}} - Professional Website Proposal',
        bodyTemplate: `<p>Hi {{firstName}},</p>
<p>I noticed that {{companyName}} doesn't have a website yet, and I wanted to reach out because I help businesses like yours establish a strong online presence.</p>
<p>In today's digital world, having a professional website is essential for attracting new customers 24/7, building credibility, and showcasing your products/services.</p>
<p>I'd love to discuss how we can create a website that perfectly represents {{companyName}} and helps grow your business.</p>
<p>Would you be open to a quick 15-minute call this week?</p>
<p>Best regards,<br>{{senderName}}<br>{{senderCompany}}</p>`
      },
      {
        name: 'Has Website - Improvement',
        category: 'HAS_WEBSITE',
        subjectTemplate: 'Quick idea for {{companyName}} website',
        bodyTemplate: `<p>Hi {{firstName}},</p>
<p>I just visited the {{companyName}} website and I'm impressed with what you've built!</p>
<p>I noticed a few opportunities that could help boost your conversions and user experience - mobile optimization, page speed, and SEO quick wins.</p>
<p>Would you be interested in a free website audit? I'll share specific, actionable recommendations with no obligation.</p>
<p>Best,<br>{{senderName}}<br>{{senderCompany}}</p>`
      },
      {
        name: 'Weak Website - Redesign',
        category: 'WEAK_WEBSITE',
        subjectTemplate: 'Modernize {{companyName}} online presence?',
        bodyTemplate: `<p>Hi {{firstName}},</p>
<p>I came across {{companyName}} while researching businesses in your area, and I believe your website might be holding back your growth potential.</p>
<p>A fresh, modern design could help you convert more visitors into customers, build trust instantly, and rank higher on Google.</p>
<p>Would you have 10 minutes to discuss how a refresh could benefit {{companyName}}?</p>
<p>Best regards,<br>{{senderName}}<br>{{senderCompany}}</p>`
      },
      {
        name: 'SEO Weak - Optimization',
        category: 'SEO_WEAK',
        subjectTemplate: 'Get {{companyName}} on page 1 of Google',
        bodyTemplate: `<p>Hi {{firstName}},</p>
<p>I was searching for businesses like {{companyName}} and noticed your website isn't appearing on the first page of Google for key search terms.</p>
<p>This means potential customers are finding your competitors instead of you.</p>
<p>Would you like a free SEO analysis showing exactly where you stand and how to improve?</p>
<p>Best,<br>{{senderName}}<br>{{senderCompany}}</p>`
      },
      {
        name: 'E-commerce - Sales Boost',
        category: 'ECOMMERCE',
        subjectTemplate: 'Increase {{companyName}} online sales?',
        bodyTemplate: `<p>Hi {{firstName}},</p>
<p>I visited your online store and love what {{companyName}} is offering!</p>
<p>I noticed a few quick wins that could significantly boost your sales - checkout optimization, product page improvements, and mobile experience enhancements.</p>
<p>Would you be open to a quick chat about your growth goals?</p>
<p>Best regards,<br>{{senderName}}<br>{{senderCompany}}</p>`
      },
      {
        name: 'Follow-up 1 - Gentle Reminder',
        category: 'FOLLOWUP_1',
        subjectTemplate: 'Re: {{companyName}} - Following up',
        bodyTemplate: `<p>Hi {{firstName}},</p>
<p>I wanted to follow up on my previous email about helping {{companyName}} with your online presence.</p>
<p>I understand you're busy, so I'll keep this brief - I'd love just 10 minutes of your time to share some ideas that could benefit your business.</p>
<p>Is there a better time to connect?</p>
<p>Best,<br>{{senderName}}</p>`
      },
      {
        name: 'Follow-up 2 - Final Check',
        category: 'FOLLOWUP_2',
        subjectTemplate: 'Last follow-up for {{companyName}}',
        bodyTemplate: `<p>Hi {{firstName}},</p>
<p>I don't want to be a pest, so this will be my last follow-up.</p>
<p>If improving {{companyName}}'s online presence is a priority, I'm here to help. Just reply to this email when you're ready.</p>
<p>If the timing isn't right, no worries at all - I wish you continued success!</p>
<p>All the best,<br>{{senderName}}<br>{{senderCompany}}</p>`
      }
    ];

    // Create all built-in templates for this campaign
    await EmailTemplate.insertMany(
      builtInTemplates.map(t => ({ campaignId: campaign._id, ...t }))
    );

    console.log(`✅ Created campaign "${name}" with ${builtInTemplates.length} built-in templates`);

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


        const failedCount = await EmailLog.countDocuments({
          campaignId: campaign._id,
          status: { $in: ['failed', 'bounced'] }
        });

        const repliedCount = await Lead.countDocuments({
          campaignId: campaign._id,
          status: 'REPLIED'
        });

        return {
          ...campaign.toObject(),
          leadCount,
          sentCount,
          todayCount,
          failedCount,
          repliedCount
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
