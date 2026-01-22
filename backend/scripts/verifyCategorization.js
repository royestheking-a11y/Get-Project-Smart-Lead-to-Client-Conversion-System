import fetch from 'node-fetch';

const CONCURRENCY_LIMIT = 3;
const FETCH_TIMEOUT = 8000;

// Copied from categorizationService.js
const normalizeWebsite = (website) => {
    if (!website) return null;
    let url = website.trim().toLowerCase();
    const placeholders = ['n/a', 'na', 'no website', 'none', 'null', 'undefined', '-', '.', 'http://', 'https://'];
    if (placeholders.includes(url)) return null;
    if (!url.includes('.')) return null;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
    }
    return url;
};

const fetchWebsite = async (url) => {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT);
        const response = await fetch(url, {
            signal: controller.signal,
            headers: { 'User-Agent': 'Mozilla/5.0 (compatible; ClientCatcher/1.0)' }
        });
        clearTimeout(timeoutId);
        if (!response.ok) return null;
        return await response.text();
    } catch (error) {
        return null;
    }
};

const categorize = async (urlValue) => {
    console.log(`\nAnalyzing: "${urlValue}"`);
    const websiteUrl = normalizeWebsite(urlValue);

    if (!websiteUrl) {
        console.log('Result: NO_WEBSITE (Invalid or empty URL)');
        return;
    }

    console.log(`Fetching: ${websiteUrl}...`);
    const html = await fetchWebsite(websiteUrl);

    if (!html) {
        console.log('Result: WEAK_WEBSITE (Failed to load or timeout)');
        return;
    }

    const hasTitle = /<title[^>]*>[\s\S]*?<\/title>/i.test(html);
    if (!hasTitle) {
        console.log('Result: WEAK_WEBSITE (No <title> tag found)');
        return;
    }

    const hasMetaDescription = /<meta[^>]*name=["\']description["\'][^>]*>/i.test(html);
    const hasH1 = /<h1[^>]*>[\s\S]*?<\/h1>/i.test(html);

    if (!hasMetaDescription || !hasH1) {
        if (!hasMetaDescription) console.log('Issue: Missing meta description');
        if (!hasH1) console.log('Issue: Missing h1 tag');
        console.log('Result: SEO_WEAK');
        return;
    }

    const ecommerceKeywords = /cart|checkout|shop|buy now|add to cart|purchase|basket|store|shipping|order|product/i;
    if (ecommerceKeywords.test(html)) {
        console.log('Result: ECOMMERCE (Found e-commerce keywords)');
        return;
    }

    console.log('Result: HAS_WEBSITE (Passed all checks)');
};

// Test Cases
const runTests = async () => {
    await categorize('n/a');
    await categorize('google.com');
    await categorize('example.com');
};

runTests();
