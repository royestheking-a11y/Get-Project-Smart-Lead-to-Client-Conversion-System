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

  // If no website or invalid website, mark as NO_WEBSITE
  if (!websiteUrl) {
    lead.category = 'NO_WEBSITE';
    lead.status = 'READY';
    await lead.save();
    return;
  }
  const html = await fetchWebsite(websiteUrl);

  if (!html) {
    lead.category = 'WEAK_WEBSITE';
    lead.status = 'READY';
    await lead.save();
    return;
  }

  // Check for title tag
  const hasTitle = /<title[^>]*>[\s\S]*?<\/title>/i.test(html);
  if (!hasTitle) {
    lead.category = 'WEAK_WEBSITE';
    lead.status = 'READY';
    await lead.save();
    return;
  }

  // Check for meta description
  const hasMetaDescription = /<meta[^>]*name=["\']description["\'][^>]*>/i.test(html);
  // Check for H1 tag (basic SEO requirement)
  const hasH1 = /<h1[^>]*>[\s\S]*?<\/h1>/i.test(html);

  if (!hasMetaDescription || !hasH1) {
    lead.category = 'SEO_WEAK';
    lead.status = 'READY';
    await lead.save();
    return;
  }

  // Check for ecommerce keywords
  const ecommerceKeywords = /cart|checkout|shop|buy now|add to cart|purchase|basket|store|shipping|order|product/i;
  if (ecommerceKeywords.test(html)) {
    lead.category = 'ECOMMERCE';
    lead.status = 'READY';
    await lead.save();
    return;
  }

  // Default to HAS_WEBSITE
  lead.category = 'HAS_WEBSITE';
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
