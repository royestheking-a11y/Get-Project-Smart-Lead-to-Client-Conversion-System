import fetch from 'node-fetch';
import Lead from '../models/Lead.js';

const CONCURRENCY_LIMIT = 3;
const FETCH_TIMEOUT = 8000;

// Normalize website URL
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

// Fetch website HTML with timeout
const fetchWebsite = async (url) => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT);

    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; ClientCatcher/1.0)'
      }
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      return null;
    }

    const html = await response.text();
    return html;
  } catch (error) {
    return null;
  }
};

const categorizeLead = async (lead) => {
  const websiteUrl = normalizeWebsite(lead.website);
  const industry = (lead.industry || '').toLowerCase();

  // 1. Logic for Leads WITHOUT a Website
  if (!websiteUrl) {
    // If they are in a marketing-related industry, they likely need help with social media/marketing
    const marketingIndustries = ['marketing', 'advertising', 'digital', 'agency', 'social media', 'creative'];
    if (marketingIndustries.some(ind => industry.includes(ind))) {
      lead.category = 'DIGITAL_MARKETING';
    } else {
      lead.category = 'NO_WEBSITE';
    }
    lead.status = 'READY';
    await lead.save();
    return;
  }

  // 2. Logic for Leads WITH a Website
  const html = await fetchWebsite(websiteUrl);

  // If website exists but is completely broken/empty
  if (!html) {
    lead.category = 'POOR_UI_SEO'; // Focus on fix/redesign
    lead.status = 'READY';
    await lead.save();
    return;
  }

  // Check for basic SEO (Title, Meta, H1)
  const hasTitle = /<title[^>]*>[\s\S]*?<\/title>/i.test(html);
  const hasMetaDescription = /<meta[^>]*name=["\']description["\'][^>]*>/i.test(html);
  const hasH1 = /<h1[^>]*>[\s\S]*?<\/h1>/i.test(html);

  if (!hasTitle || !hasMetaDescription || !hasH1) {
    lead.category = 'POOR_UI_SEO';
    lead.status = 'READY';
    await lead.save();
    return;
  }

  // Check for ecommerce (Specialized Marketing)
  const ecommerceKeywords = /cart|checkout|shop|buy now|add to cart|purchase|basket|store|shipping|order|product/i;
  if (ecommerceKeywords.test(html)) {
    lead.category = 'ECOMMERCE';
    lead.status = 'READY';
    await lead.save();
    return;
  }

  // If website is technically sound, pitch growth/marketing
  lead.category = 'DIGITAL_MARKETING';
  lead.status = 'READY';
  await lead.save();
};

// Process leads in batches with concurrency control
const processBatch = async (leads) => {
  const results = [];

  for (let i = 0; i < leads.length; i += CONCURRENCY_LIMIT) {
    const batch = leads.slice(i, i + CONCURRENCY_LIMIT);
    const promises = batch.map(lead => categorizeLead(lead));
    await Promise.all(promises);
    results.push(...batch);
  }

  return results;
};

// Main categorization function
export const categorizeLeads = async (campaignId, limit = 50) => {
  const leads = await Lead.find({
    campaignId,
    status: { $in: ['IMPORTED', 'READY'] },
    category: null,
    doNotContact: false
  }).limit(limit);

  if (leads.length === 0) {
    return { categorized: 0 };
  }

  await processBatch(leads);

  return { categorized: leads.length };
};
