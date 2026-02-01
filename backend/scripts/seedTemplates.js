import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../.env') });

// Import the actual model
import EmailTemplate from '../models/EmailTemplate.js';
import Campaign from '../models/Campaign.js';

// Professional Built-in Templates
const builtInTemplates = [
    {
        name: 'No Website - Initial',
        category: 'NO_WEBSITE',
        subjectTemplate: '{{companyName}} - Professional Website Proposal',
        bodyTemplate: `<p>Hi {{firstName}},</p>

<p>I noticed that {{companyName}} doesn't have a website yet, and I wanted to reach out because I help businesses like yours establish a strong online presence.</p>

<p>In today's digital world, having a professional website is essential for:</p>
<ul>
  <li>Attracting new customers 24/7</li>
  <li>Building credibility and trust</li>
  <li>Showcasing your products/services</li>
</ul>

<p>I'd love to discuss how we can create a website that perfectly represents {{companyName}} and helps grow your business.</p>

<p>Would you be open to a quick 15-minute call this week?</p>

<p>Best regards,<br>
{{senderName}}<br>
{{senderCompany}}</p>`
    },
    {
        name: 'Has Website - Improvement',
        category: 'HAS_WEBSITE',
        subjectTemplate: 'Quick idea for {{companyName}} website',
        bodyTemplate: `<p>Hi {{firstName}},</p>

<p>I just visited the {{companyName}} website and I'm impressed with what you've built!</p>

<p>I noticed a few opportunities that could help boost your conversions and user experience:</p>
<ul>
  <li>Mobile optimization improvements</li>
  <li>Page speed enhancements</li>
  <li>SEO quick wins</li>
</ul>

<p>Would you be interested in a free website audit? I'll share specific, actionable recommendations with no obligation.</p>

<p>Best,<br>
{{senderName}}<br>
{{senderCompany}}</p>`
    },
    {
        name: 'Weak Website - Redesign',
        category: 'WEAK_WEBSITE',
        subjectTemplate: 'Modernize {{companyName}} online presence?',
        bodyTemplate: `<p>Hi {{firstName}},</p>

<p>I came across {{companyName}} while researching businesses in your area, and I believe your website might be holding back your growth potential.</p>

<p>A fresh, modern design could help you:</p>
<ul>
  <li>Convert more visitors into customers</li>
  <li>Build trust instantly with new prospects</li>
  <li>Rank higher on Google searches</li>
</ul>

<p>I specialize in website redesigns that focus on results, not just aesthetics.</p>

<p>Would you have 10 minutes to discuss how a refresh could benefit {{companyName}}?</p>

<p>Best regards,<br>
{{senderName}}<br>
{{senderCompany}}</p>`
    },
    {
        name: 'SEO Weak - Optimization',
        category: 'SEO_WEAK',
        subjectTemplate: 'Get {{companyName}} on page 1 of Google',
        bodyTemplate: `<p>Hi {{firstName}},</p>

<p>I was searching for businesses like {{companyName}} and noticed your website isn't appearing on the first page of Google for key search terms.</p>

<p>This means potential customers are finding your competitors instead of you.</p>

<p>With targeted SEO improvements, we could help {{companyName}}:</p>
<ul>
  <li>Rank for your most important keywords</li>
  <li>Increase organic traffic by 200-300%</li>
  <li>Generate leads without paying for ads</li>
</ul>

<p>Would you like a free SEO analysis showing exactly where you stand and how to improve?</p>

<p>Best,<br>
{{senderName}}<br>
{{senderCompany}}</p>`
    },
    {
        name: 'E-commerce - Sales Boost',
        category: 'ECOMMERCE',
        subjectTemplate: 'Increase {{companyName}} online sales?',
        bodyTemplate: `<p>Hi {{firstName}},</p>

<p>I visited your online store and love what {{companyName}} is offering!</p>

<p>I noticed a few quick wins that could significantly boost your sales:</p>
<ul>
  <li>Checkout optimization to reduce cart abandonment</li>
  <li>Product page improvements for better conversions</li>
  <li>Mobile shopping experience enhancements</li>
</ul>

<p>I've helped similar e-commerce businesses increase revenue by 30-50% with these strategies.</p>

<p>Would you be open to a quick chat about your growth goals?</p>

<p>Best regards,<br>
{{senderName}}<br>
{{senderCompany}}</p>`
    },
    {
        name: 'Follow-up 1 - Gentle Reminder',
        category: 'FOLLOWUP_1',
        subjectTemplate: 'Re: {{companyName}} - Following up',
        bodyTemplate: `<p>Hi {{firstName}},</p>

<p>I wanted to follow up on my previous email about helping {{companyName}} with your online presence.</p>

<p>I understand you're busy, so I'll keep this brief - I'd love just 10 minutes of your time to share some ideas that could benefit your business.</p>

<p>Is there a better time to connect?</p>

<p>Best,<br>
{{senderName}}</p>`
    },
    {
        name: 'Follow-up 2 - Final Check',
        category: 'FOLLOWUP_2',
        subjectTemplate: 'Last follow-up for {{companyName}}',
        bodyTemplate: `<p>Hi {{firstName}},</p>

<p>I don't want to be a pest, so this will be my last follow-up.</p>

<p>If improving {{companyName}}'s online presence is a priority, I'm here to help. Just reply to this email when you're ready.</p>

<p>If the timing isn't right, no worries at all - I wish you continued success!</p>

<p>All the best,<br>
{{senderName}}<br>
{{senderCompany}}</p>`
    }
];

const seedTemplates = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB\n');

        // Find the first campaign (or create one if none exists)
        let campaign = await Campaign.findOne();

        if (!campaign) {
            console.log('⚠️  No campaigns found. Please create a campaign first in the app.');
            console.log('   Templates will be auto-created when you add a campaign.\n');
            process.exit(0);
        }

        console.log(`📧 Adding templates to campaign: ${campaign.name || campaign._id}\n`);

        // Clear existing templates for this campaign
        await EmailTemplate.deleteMany({ campaignId: campaign._id });
        console.log('   Cleared existing templates');

        // Insert built-in templates
        for (const template of builtInTemplates) {
            await EmailTemplate.create({
                campaignId: campaign._id,
                ...template
            });
            console.log(`   ✅ Created: ${template.name}`);
        }

        console.log(`\n🎉 Successfully added ${builtInTemplates.length} built-in templates!`);

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

seedTemplates();
