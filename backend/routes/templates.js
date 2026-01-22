import express from 'express';
import EmailTemplate from '../models/EmailTemplate.js';
import Campaign from '../models/Campaign.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// All routes require auth
router.use(requireAuth);

// Create template
router.post('/', async (req, res) => {
  try {
    const { campaignId, name, category, subjectTemplate, bodyTemplate } = req.body;

    if (!campaignId || !name || !category || !subjectTemplate || !bodyTemplate) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const validCategories = ['NO_WEBSITE', 'HAS_WEBSITE', 'WEAK_WEBSITE', 'SEO_WEAK', 'ECOMMERCE'];
    if (!validCategories.includes(category)) {
      return res.status(400).json({ error: 'Invalid category' });
    }

    // Verify campaign belongs to user
    const campaign = await Campaign.findOne({
      _id: campaignId,
      userId: req.user.userId
    });

    if (!campaign) {
      return res.status(404).json({ error: 'Campaign not found' });
    }

    const template = await EmailTemplate.create({
      campaignId,
      name,
      category,
      subjectTemplate,
      bodyTemplate
    });

    res.status(201).json(template);
  } catch (error) {
    console.error('Create template error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// List templates
router.get('/', async (req, res) => {
  try {
    const { campaignId } = req.query;
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
      // If no campaignId, get all campaigns for user
      const campaigns = await Campaign.find({ userId: req.user.userId }).select('_id');
      const campaignIds = campaigns.map(c => c._id);
      query.campaignId = { $in: campaignIds };
    }

    const templates = await EmailTemplate.find(query).sort({ createdAt: -1 });
    res.json(templates);
  } catch (error) {
    console.error('List templates error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get single template
router.get('/:id', async (req, res) => {
  try {
    const template = await EmailTemplate.findById(req.params.id);

    if (!template) {
      return res.status(404).json({ error: 'Template not found' });
    }

    // Verify campaign belongs to user
    const campaign = await Campaign.findOne({
      _id: template.campaignId,
      userId: req.user.userId
    });

    if (!campaign) {
      return res.status(404).json({ error: 'Campaign not found' });
    }

    res.json(template);
  } catch (error) {
    console.error('Get template error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update template
router.patch('/:id', async (req, res) => {
  try {
    const template = await EmailTemplate.findById(req.params.id);

    if (!template) {
      return res.status(404).json({ error: 'Template not found' });
    }

    // Verify campaign belongs to user
    const campaign = await Campaign.findOne({
      _id: template.campaignId,
      userId: req.user.userId
    });

    if (!campaign) {
      return res.status(404).json({ error: 'Campaign not found' });
    }

    const allowedUpdates = ['name', 'category', 'subjectTemplate', 'bodyTemplate'];
    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        template[field] = req.body[field];
      }
    });

    await template.save();
    res.json(template);
  } catch (error) {
    console.error('Update template error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete template
router.delete('/:id', async (req, res) => {
  try {
    const template = await EmailTemplate.findById(req.params.id);

    if (!template) {
      return res.status(404).json({ error: 'Template not found' });
    }

    // Verify campaign belongs to user
    const campaign = await Campaign.findOne({
      _id: template.campaignId,
      userId: req.user.userId
    });

    if (!campaign) {
      return res.status(404).json({ error: 'Campaign not found' });
    }

    await EmailTemplate.deleteOne({ _id: req.params.id });
    res.json({ message: 'Template deleted' });
  } catch (error) {
    console.error('Delete template error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
