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

const categoryKeywords = {
  RESTAURANT: [
    "restaurant", "cafe", "takeaway", "food", "pizza", "burger", "grill",
    "kitchen", "dining", "menu", "coffee", "bakery", "pizzeria", "diner", "bistro"
  ],
  SALON: [
    "salon", "parlour", "parlor", "beauty", "spa", "barber", "hair",
    "makeup", "lashes", "nails", "skincare", "wellness", "grooming", "massage"
  ],
  HEALTHCARE: [
    "doctor", "clinic", "hospital", "dentist", "pharmacy", "medical",
    "healthcare", "therapy", "physio", "surgeon", "physician", "nursing", "dental"
  ],
  EDUCATION: [
    "school", "college", "academy", "training", "course", "tuition",
    "institute", "learning", "university", "coaching", "education", "student"
  ],
  FITNESS: [
    "gym", "fitness", "yoga", "trainer", "workout", "crossfit",
    "personal training", "pilates", "studio", "health club"
  ],
  ECOMMERCE: [
    "ecommerce", "online store", "shop online", "fashion", "products",
    "cart", "checkout", "delivery", "order now", "shopping", "store"
  ],
  SHOP: [
    "shop", "store", "retail", "boutique", "market", "clothing",
    "electronics", "grocery", "jewellery", "jewelry", "supermarket", "mall"
  ],
  PORTFOLIO: [
    "designer", "developer", "photographer", "artist", "consultant",
    "freelancer", "personal brand", "portfolio", "creative"
  ],
  REAL_ESTATE: [
    "real estate", "property", "apartment", "rent", "sale", "letting",
    "estate agent", "homes", "realtor", "housing", "realty", "broker"
  ],
  AGENCY: [
    "agency", "marketing", "advertising", "consulting", "digital", "branding",
    "social media", "creative agency", "pr agency", "consultancy"
  ]
};

// Extract metadata from HTML
const extractMetadata = (html) => {
  if (!html) return { title: '', description: '' };
  
  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  const title = titleMatch ? titleMatch[1].trim() : '';
  
  const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["'][^>]*>/i) || 
                   html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*name=["']description["'][^>]*>/i);
  const description = descMatch ? descMatch[1].trim() : '';
  
  return { title, description };
};

export const categorizeLead = async (lead) => {
  let websiteText = "";
  
  // Try to fetch website for deeper intelligence
  const websiteUrl = normalizeWebsite(lead.website);
  if (websiteUrl) {
    console.log(`🔍 Scraping ${websiteUrl} for deeper intelligence...`);
    const html = await fetchWebsite(websiteUrl);
    if (html) {
      const { title, description } = extractMetadata(html);
      websiteText = `${title} ${description}`;
      
      // Generate a Smart Summary for personalized outreach
      if (title) {
        lead.smartSummary = `I was recently exploring ${lead.companyName} and came across your website ("${title.length > 60 ? title.substring(0, 60) + '...' : title}") - it looks like you're doing great work in the ${lead.industry || 'local'} space.`;
      } else {
        lead.smartSummary = `I came across ${lead.companyName} online and was impressed by the services you offer to your clients.`;
      }
      
      // Bonus: Try to find an owner name if missing
      if (!lead.contactName || lead.contactName === 'there') {
        const founderMatch = html.match(/(?:founder|owner|ceo|director|founder of|owner of)\s*:\s*([A-Z][a-z]+\s+[A-Z][a-z]+)/i);
        if (founderMatch) {
          lead.contactName = founderMatch[1];
          console.log(`✨ Found potential owner name: ${lead.contactName}`);
        }
      }
    }
  }

  const text = `
    ${lead.companyName || ""}
    ${lead.industry || ""}
    ${lead.notes || ""}
    ${lead.location || ""}
    ${websiteText}
  `.toLowerCase();

  const scores = {};

  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    scores[category] = 0;

    for (const keyword of keywords) {
      // Give more weight to website metadata matches
      const regex = new RegExp(`\\b${keyword.toLowerCase()}\\b`, 'g');
      const matches = (text.match(regex) || []).length;
      scores[category] += matches;
    }
  }

  const sortedCategories = Object.entries(scores)
    .sort((a, b) => b[1] - a[1]);

  const bestCategoryMatch = sortedCategories[0];

  if (!bestCategoryMatch || bestCategoryMatch[1] === 0) {
    lead.category = 'GENERAL';
    lead.confidenceScore = 0;
  } else {
    lead.category = bestCategoryMatch[0];
    lead.confidenceScore = bestCategoryMatch[1];
  }

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
