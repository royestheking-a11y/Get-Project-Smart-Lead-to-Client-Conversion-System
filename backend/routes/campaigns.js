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
    if (dailyLimit < 1 || dailyLimit > 500) {
      return res.status(400).json({ error: 'Daily limit must be between 1 and 500' });
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
        subjectTemplate: '{{companyName}} - Let\'s Build Your Online Presence',
        bodyTemplate: `<p>Hi {{firstName}},</p>

<p>I hope this message finds you well! My name is {{senderName}}, and I specialize in helping businesses like {{companyName}} establish a powerful online presence.</p>

<p>I noticed that {{companyName}} doesn't currently have a website, and in today's digital-first world, this could mean you're missing out on significant opportunities:</p>

<ul>
  <li><strong>24/7 Visibility</strong> – Your customers can find you anytime, even when you're closed</li>
  <li><strong>Credibility & Trust</strong> – 75% of consumers judge a business's credibility based on their website</li>
  <li><strong>Competitive Edge</strong> – Stand out from competitors who are already online</li>
  <li><strong>Lead Generation</strong> – Turn website visitors into paying customers automatically</li>
</ul>

<p>I'd love to show you how a professionally designed website can transform {{companyName}}'s growth. No pressure, just a friendly 15-minute conversation to explore the possibilities.</p>

<p>Would you be available for a quick call this week?</p>

<p>Looking forward to hearing from you!</p>

<p>Best regards,</p>
<p><strong>{{senderName}}</strong><br>
{{senderCompany}}<br>
{{senderPhone}}<br>
<a href="{{senderWebsite}}">{{senderWebsite}}</a></p>`
      },
      {
        name: 'Has Website - Improvement',
        category: 'HAS_WEBSITE',
        subjectTemplate: 'A Few Ideas to Boost {{companyName}}\'s Website Performance',
        bodyTemplate: `<p>Hi {{firstName}},</p>

<p>I recently visited the {{companyName}} website and was impressed with what you've built! It's clear you've put thought into your online presence.</p>

<p>That said, I noticed a few opportunities that could help take your website to the next level:</p>

<ul>
  <li><strong>Mobile Optimization</strong> – Ensuring a seamless experience on phones and tablets (where 60%+ of users browse)</li>
  <li><strong>Page Speed</strong> – Faster loading times can significantly reduce bounce rates and improve conversions</li>
  <li><strong>SEO Enhancements</strong> – Small tweaks that could help you rank higher on Google</li>
  <li><strong>Conversion Optimization</strong> – Strategic changes to turn more visitors into customers</li>
</ul>

<p>I'd be happy to provide a <strong>free, no-obligation website audit</strong> with specific, actionable recommendations tailored to {{companyName}}.</p>

<p>Would you be interested in seeing what improvements could make the biggest impact for your business?</p>

<p>Warm regards,</p>
<p><strong>{{senderName}}</strong><br>
{{senderCompany}}<br>
{{senderPhone}}<br>
<a href="{{senderWebsite}}">{{senderWebsite}}</a></p>`
      },
      {
        name: 'Weak Website - Redesign',
        category: 'WEAK_WEBSITE',
        subjectTemplate: 'Time to Refresh {{companyName}}\'s Website?',
        bodyTemplate: `<p>Hi {{firstName}},</p>

<p>I came across {{companyName}} while researching businesses in your industry, and I wanted to reach out with some honest feedback.</p>

<p>Your current website may be holding back your business potential. Here's what a modern redesign could do for you:</p>

<ul>
  <li><strong>Professional First Impression</strong> – Visitors form an opinion about your business within 0.05 seconds of landing on your site</li>
  <li><strong>Higher Conversion Rates</strong> – A well-designed site can increase conversions by 200% or more</li>
  <li><strong>Better Google Rankings</strong> – Modern, fast websites rank higher in search results</li>
  <li><strong>Mobile-First Design</strong> – Capture the growing mobile audience with a responsive layout</li>
</ul>

<p>I specialize in website redesigns that focus on <strong>results, not just aesthetics</strong>. Every design decision is made with your business goals in mind.</p>

<p>Would you have 10 minutes this week to discuss how a refresh could benefit {{companyName}}? I'd love to share some ideas specific to your business.</p>

<p>Best regards,</p>
<p><strong>{{senderName}}</strong><br>
{{senderCompany}}<br>
{{senderPhone}}<br>
<a href="{{senderWebsite}}">{{senderWebsite}}</a></p>`
      },
      {
        name: 'SEO Weak - Optimization',
        category: 'SEO_WEAK',
        subjectTemplate: 'Help {{companyName}} Get Found on Google',
        bodyTemplate: `<p>Hi {{firstName}},</p>

<p>I was searching for businesses like {{companyName}} on Google and noticed something concerning – your website isn't appearing on the first page for key search terms in your industry.</p>

<p>This is a significant missed opportunity. Here's why:</p>

<ul>
  <li><strong>75% of users never scroll past the first page</strong> of search results</li>
  <li><strong>Your competitors are getting those clicks</strong> instead of you</li>
  <li><strong>Organic traffic is FREE</strong> – unlike paid ads that cost money every click</li>
  <li><strong>SEO builds long-term value</strong> – good rankings compound over time</li>
</ul>

<p>I'd like to offer you a <strong>free SEO analysis</strong> that shows exactly where {{companyName}} stands and provides a clear roadmap for improvement.</p>

<p>Would you be interested in seeing the specific keywords you could be ranking for and how to get there?</p>

<p>Looking forward to helping {{companyName}} get the visibility it deserves!</p>

<p>Best regards,</p>
<p><strong>{{senderName}}</strong><br>
{{senderCompany}}<br>
{{senderPhone}}<br>
<a href="{{senderWebsite}}">{{senderWebsite}}</a></p>`
      },
      {
        name: 'E-commerce - Sales Boost',
        category: 'ECOMMERCE',
        subjectTemplate: 'Ideas to Boost {{companyName}}\'s Online Sales',
        bodyTemplate: `<p>Hi {{firstName}},</p>

<p>I visited the {{companyName}} online store and I'm genuinely impressed with your products! You've clearly built something special.</p>

<p>While browsing, I noticed some opportunities that could significantly boost your sales:</p>

<ul>
  <li><strong>Checkout Optimization</strong> – Reducing cart abandonment (industry average is 70%!) with streamlined checkout</li>
  <li><strong>Product Page Enhancements</strong> – Better images, descriptions, and trust signals that convert browsers into buyers</li>
  <li><strong>Mobile Shopping Experience</strong> – Over 50% of e-commerce traffic comes from mobile devices</li>
  <li><strong>Upselling & Cross-selling</strong> – Smart product recommendations that increase average order value</li>
</ul>

<p>I've helped similar e-commerce businesses increase their revenue by <strong>30-50%</strong> with these strategies.</p>

<p>Would you be open to a quick conversation about your growth goals for {{companyName}}? I'd love to share some specific ideas tailored to your store.</p>

<p>Warm regards,</p>
<p><strong>{{senderName}}</strong><br>
{{senderCompany}}<br>
{{senderPhone}}<br>
<a href="{{senderWebsite}}">{{senderWebsite}}</a></p>`
      },
      {
        name: 'Follow-up 1 - Gentle Reminder',
        category: 'FOLLOWUP_1',
        subjectTemplate: 'Quick Follow-up: {{companyName}} Website Opportunity',
        bodyTemplate: `<p>Hi {{firstName}},</p>

<p>I wanted to follow up on my previous email about helping {{companyName}} with your online presence.</p>

<p>I completely understand you're busy – running a business takes a lot of time and energy!</p>

<p>I'll keep this brief: I genuinely believe there's an opportunity to help {{companyName}} grow through improved digital presence. I'd love just <strong>10 minutes of your time</strong> to share some ideas that could make a real difference.</p>

<p>Would any of these work for a quick call?</p>
<ul>
  <li>This week (any day, any time)</li>
  <li>Next week (morning or afternoon)</li>
  <li>Or just reply with your preferred time!</li>
</ul>

<p>Looking forward to connecting!</p>

<p>Best regards,</p>
<p><strong>{{senderName}}</strong><br>
{{senderCompany}}<br>
{{senderPhone}}<br>
<a href="{{senderWebsite}}">{{senderWebsite}}</a></p>`
      },
      {
        name: 'Follow-up 2 - Final Check',
        category: 'FOLLOWUP_2',
        subjectTemplate: 'Final Check-in: {{companyName}}',
        bodyTemplate: `<p>Hi {{firstName}},</p>

<p>I don't want to overstay my welcome in your inbox, so this will be my final follow-up.</p>

<p>If improving {{companyName}}'s online presence is a priority right now, I'm here and ready to help. Just reply to this email whenever you're ready – even if it's months from now!</p>

<p>If the timing isn't right, I completely understand. Running a business means constantly juggling priorities. I wish you and {{companyName}} continued success!</p>

<p>Feel free to reach out anytime in the future. My door is always open.</p>

<p>All the best,</p>
<p><strong>{{senderName}}</strong><br>
{{senderCompany}}<br>
{{senderPhone}}<br>
<a href="{{senderWebsite}}">{{senderWebsite}}</a></p>`
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
    res.status(500).json({ error: 'Server error: ' + error.message });
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
    res.status(500).json({ error: 'Server error: ' + error.message });
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
    res.status(500).json({ error: 'Server error: ' + error.message });
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
      if (req.body.dailyLimit < 1 || req.body.dailyLimit > 500) {
        return res.status(400).json({ error: 'Daily limit must be between 1 and 500' });
      }
    }

    await campaign.save();
    res.json(campaign);
  } catch (error) {
    console.error('Update campaign error:', error);
    res.status(500).json({ error: 'Server error: ' + error.message });
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
