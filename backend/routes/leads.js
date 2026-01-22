import express from 'express';
import multer from 'multer';
import XLSX from 'xlsx';
import { parse } from 'csv-parse/sync';
import Lead from '../models/Lead.js';
import Campaign from '../models/Campaign.js';
import { requireAuth } from '../middleware/auth.js';
import { categorizeLeads } from '../services/categorizationService.js';

const router = express.Router();

// All routes require auth
router.use(requireAuth);

// Configure multer for file uploads
const upload = multer({ storage: multer.memoryStorage() });

// Normalize email
const normalizeEmail = (email) => {
  if (!email) return null;
  return email.trim().toLowerCase();
};

// Validate email
const isValidEmail = (email) => {
  if (!email) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Normalize website
const normalizeWebsite = (website) => {
  if (!website) return null;
  let url = website.trim().toLowerCase();

  // Check for common placeholders
  const placeholders = ['n/a', 'na', 'no website', 'none', 'null', 'undefined', '-', '.', 'http://', 'https://'];
  if (placeholders.includes(url)) return null;

  // Basic URL validation
  if (!url.includes('.')) return null;

  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = 'https://' + url;
  }
  return url;
};

// Import leads
router.post('/import', upload.single('file'), async (req, res) => {
  try {
    const { campaignId, mapping } = req.body;

    if (!campaignId || !req.file) {
      return res.status(400).json({ error: 'Campaign ID and file are required' });
    }

    // Verify campaign belongs to user
    const campaign = await Campaign.findOne({
      _id: campaignId,
      userId: req.user.userId
    });

    if (!campaign) {
      return res.status(404).json({ error: 'Campaign not found' });
    }

    // Parse mapping
    const mappingObj = typeof mapping === 'string' ? JSON.parse(mapping) : mapping;
    const {
      company_nameColumn,
      emailColumn,
      websiteColumn,
      locationColumn,
      industryColumn
    } = mappingObj;

    if (!emailColumn) {
      return res.status(400).json({ error: 'Email column mapping is required' });
    }

    // Parse file
    let rows = [];
    const fileExtension = req.file.originalname.split('.').pop().toLowerCase();

    if (fileExtension === 'csv') {
      const csvData = req.file.buffer.toString('utf-8');
      rows = parse(csvData, {
        columns: true,
        skip_empty_lines: true,
        trim: true
      });
    } else if (['xlsx', 'xls'].includes(fileExtension)) {
      const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      rows = XLSX.utils.sheet_to_json(worksheet);
    } else {
      return res.status(400).json({ error: 'Unsupported file format. Use CSV or XLSX' });
    }

    // Process rows
    const processedLeads = [];
    const seenEmails = new Set();
    const invalidRows = [];
    let duplicateCount = 0;

    // Get existing emails for this campaign
    const existingLeads = await Lead.find({ campaignId }).select('email');
    const existingEmails = new Set(existingLeads.map(l => l.email.toLowerCase()));

    const errors = []; // Store specific validation errors

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const rawEmail = row[emailColumn];
      const email = normalizeEmail(rawEmail);

      // Skip if email is invalid
      if (!email) {
        invalidRows.push(row);
        if (errors.length < 5) {
          // Check if the raw value was actually undefined (wrong column mapping)
          if (rawEmail === undefined) {
            errors.push(`Row ${i + 2}: Column "${emailColumn}" not found or empty. Check your Column Mapping.`);
          } else {
            errors.push(`Row ${i + 2}: Empty value in column "${emailColumn}"`);
          }
        }
        continue;
      }

      if (!isValidEmail(email)) {
        invalidRows.push(row);
        if (errors.length < 5) {
          errors.push(`Row ${i + 2}: Invalid email format "${rawEmail}" (Domain emails are allowed! Check for spaces or typos).`);
        }
        continue;
      }

      // Skip if duplicate in file
      if (seenEmails.has(email)) {
        duplicateCount++;
        continue;
      }

      // Skip if duplicate in DB
      if (existingEmails.has(email)) {
        duplicateCount++;
        continue;
      }

      seenEmails.add(email);

      processedLeads.push({
        campaignId,
        companyName: row[company_nameColumn]?.trim() || '',
        email,
        website: normalizeWebsite(row[websiteColumn]),
        location: row[locationColumn]?.trim() || '',
        industry: row[industryColumn]?.trim() || '',
        status: 'IMPORTED',
        category: null,
        doNotContact: false
      });
    }

    // Insert leads
    if (processedLeads.length > 0) {
      await Lead.insertMany(processedLeads);
    }

    res.json({
      totalRows: rows.length,
      importedCount: processedLeads.length,
      invalidCount: invalidRows.length,
      duplicateCount,
      errors // Return the specific errors
    });
  } catch (error) {
    console.error('Import leads error:', error);
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
});

// List leads
router.get('/', async (req, res) => {
  try {
    const {
      campaignId,
      status,
      category,
      search,
      page = 1,
      limit = 50
    } = req.query;

    console.log('GET /leads params:', { campaignId, status, category, search, page: parseInt(page), limit: parseInt(limit) });

    // Validate page/limit explicitly to see if that triggers it
    if (isNaN(parseInt(page)) || isNaN(parseInt(limit))) {
      console.log('Invalid page checks fail');
      return res.status(400).json({ error: 'Invalid page or limit' });
    }

    // If campaignId is provided, verify it belongs to user
    let campaignIds = [];
    if (campaignId) {
      const campaign = await Campaign.findOne({
        _id: campaignId,
        userId: req.user.userId
      });

      if (!campaign) {
        return res.status(404).json({ error: 'Campaign not found' });
      }
      campaignIds = [campaign._id];
    } else {
      // If no campaignId, get all campaigns for user
      const campaigns = await Campaign.find({ userId: req.user.userId }).select('_id');
      campaignIds = campaigns.map(c => c._id);
    }

    // Build query
    const query = { campaignId: { $in: campaignIds } };

    if (status) {
      query.status = status;
    }

    if (category) {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { companyName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [leads, total] = await Promise.all([
      Lead.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Lead.countDocuments(query)
    ]);

    const response = {
      leads,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / parseInt(limit))
    };

    console.log(`Returning ${leads.length} leads (total: ${total})`);
    res.json(response);
  } catch (error) {
    console.error('List leads error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update lead
router.patch('/:id', async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({ error: 'Lead not found' });
    }

    // Verify campaign belongs to user
    const campaign = await Campaign.findOne({
      _id: lead.campaignId,
      userId: req.user.userId
    });

    if (!campaign) {
      return res.status(404).json({ error: 'Campaign not found' });
    }

    const allowedUpdates = ['status', 'category', 'notes', 'companyName', 'website', 'location', 'industry'];
    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        lead[field] = req.body[field];
      }
    });

    await lead.save();
    res.json(lead);
  } catch (error) {
    console.error('Update lead error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Mark replied
router.post('/:id/mark-replied', async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({ error: 'Lead not found' });
    }

    // Verify campaign belongs to user
    const campaign = await Campaign.findOne({
      _id: lead.campaignId,
      userId: req.user.userId
    });

    if (!campaign) {
      return res.status(404).json({ error: 'Campaign not found' });
    }

    lead.status = 'REPLIED';
    await lead.save();

    res.json(lead);
  } catch (error) {
    console.error('Mark replied error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Do not contact
router.post('/:id/do-not-contact', async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({ error: 'Lead not found' });
    }

    // Verify campaign belongs to user
    const campaign = await Campaign.findOne({
      _id: lead.campaignId,
      userId: req.user.userId
    });

    if (!campaign) {
      return res.status(404).json({ error: 'Campaign not found' });
    }

    lead.doNotContact = true;
    lead.status = 'DO_NOT_CONTACT';
    await lead.save();

    res.json(lead);
  } catch (error) {
    console.error('Do not contact error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Categorize leads
router.post('/categorize', async (req, res) => {
  try {
    const { campaignId, limit = 50 } = req.body;

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

    const result = await categorizeLeads(campaignId, parseInt(limit));
    res.json(result);
  } catch (error) {
    console.error('Categorize leads error:', error);
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
});

export default router;
