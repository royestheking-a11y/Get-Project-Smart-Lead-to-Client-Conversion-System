import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Campaign from '../models/Campaign.js';
import EmailTemplate from '../models/EmailTemplate.js';
import User from '../models/User.js';
import { connectDB } from '../config/database.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../.env') });

const premiumTemplates = [
    // 1️⃣ E-commerce Growth (Premium Version)
    {
        name: 'E-commerce Growth (Premium)',
        category: 'ECOMMERCE',
        subjectTemplate: 'Hello {{company_name}} Team,',
        bodyTemplate: `<p>Hello {{company_name}} Team,</p>
<p>I was reviewing a few {{industry}} brands recently and {{company_name}} caught my attention — especially how your products are positioned online.</p>
<p>Many e-commerce businesses I work with see strong traffic but lose sales because of small conversion gaps: product layout, trust signals, checkout flow, and mobile experience.</p>
<p>My team at {{your_company}} helps e-commerce brands turn existing visitors into paying customers using proven CRO and UX improvements — without increasing ad spend.</p>
<p>If you’d like, I can share 2–3 quick suggestions based on {{website}} that could immediately improve your conversion rate.</p>
<p>No obligation — just practical insights you can use.</p>
<p>Would you be open to a short chat this week?</p>
<p>Best,<br>{{your_name}}<br>{{your_company}}<br>WhatsApp: {{whatsapp}}<br>Portfolio: {{portfolio_link}}</p>
<p><small>If you prefer not to receive emails, just reply STOP.</small></p>`
    },
    // 2️⃣ Weak Website (Quick Question – Premium)
    {
        name: 'Weak Website (Premium)',
        category: 'WEAK_WEBSITE', // Map to weak website or generic
        subjectTemplate: 'Quick question about {{company_name}}', // Original subject was missing, inferred
        bodyTemplate: `<p>Hi {{company_name}} Team,</p>
<p>I came across {{company_name}} while exploring businesses in {{industry}}, and your brand positioning is genuinely strong.</p>
<p>One thing I noticed though — your website design doesn’t fully reflect the quality of your business yet. This is very common, especially for growing companies.</p>
<p>At {{your_company}}, we help brands modernize their websites to improve credibility, mobile experience, and lead generation — without overcomplicating things.</p>
<p>I’m curious: are you currently planning any website updates or improvements in the near future?</p>
<p>If you’d like, I can share a few practical suggestions based on {{website}} that could help you convert more visitors.</p>
<p>Would you be open to a quick conversation?</p>
<p>Best regards,<br>{{your_name}}<br>{{your_company}}<br>WhatsApp: {{whatsapp}}<br>Portfolio: {{portfolio_link}}</p>
<p><small>Reply STOP if you’d prefer not to receive emails.</small></p>`
    },
    // 3️⃣ SEO Weak (Visibility Focused – Premium)
    {
        name: 'SEO Weak (Premium)',
        category: 'SEO_WEAK',
        subjectTemplate: 'Visibility for {{company_name}}', // Inferred subject
        bodyTemplate: `<p>Hello {{company_name}} Team,</p>
<p>While searching for {{industry}} services in {{location}}, I noticed that {{company_name}} isn’t appearing as prominently as many of your competitors.</p>
<p>This doesn’t reflect the quality of your business — it usually means the website isn’t fully optimized for search visibility yet.</p>
<p>At {{your_company}}, we help businesses improve their local and organic search presence so potential customers can find them before competitors.</p>
<p>If you’re interested, I’d be happy to share a short visibility overview for {{website}} showing what may be limiting your rankings and how to improve it.</p>
<p>No pressure — just helpful insights.</p>
<p>Would you like me to send that over?</p>
<p>Kind regards,<br>{{your_name}}<br>{{your_company}}<br>WhatsApp: {{whatsapp}}<br>Portfolio: {{portfolio_link}}</p>
<p><small>Reply STOP to opt out.</small></p>`
    },
    // 4️⃣ No Website (Value First – Premium)
    {
        name: 'No Website (Premium)',
        category: 'NO_WEBSITE',
        subjectTemplate: 'Website for {{company_name}}', // Inferred
        bodyTemplate: `<p>Hi {{company_name}} Team,</p>
<p>I noticed that {{company_name}} doesn’t currently have an official website, which is quite common for businesses that grow through referrals or social media.</p>
<p>However, many customers today check a website first before trusting a business — even if they already heard about it.</p>
<p>At {{your_company}}, we help businesses create simple, professional websites that build credibility, attract inquiries, and support long-term growth — without high costs or complexity.</p>
<p>If you’re open to it, I’d love to share a few ideas on how a website could support your business goals.</p>
<p>No sales pressure — just honest suggestions.</p>
<p>Would you be open to a quick discussion?</p>
<p>Best regards,<br>{{your_name}}<br>{{your_company}}<br>WhatsApp: {{whatsapp}}<br>Portfolio: {{portfolio_link}}</p>
<p><small>Reply STOP if you don’t want future emails.</small></p>`
    },
    // 5️⃣ Has Website (Audit Teaser – Premium)
    {
        name: 'Has Website (Premium)',
        category: 'HAS_WEBSITE',
        subjectTemplate: 'Feedback for {{company_name}}', // Inferred
        bodyTemplate: `<p>Hi {{company_name}} Team,</p>
<p>I recently reviewed {{website}} and it’s clear that {{company_name}} has built a solid online foundation.</p>
<p>That said, I noticed a few opportunities where small improvements could significantly increase visitor trust and conversion — especially on mobile.</p>
<p>At {{your_company}}, we regularly perform short website audits for growing businesses to highlight exactly where improvements can bring better results.</p>
<p>If you’d like, I can prepare a brief, no-cost audit summary for {{company_name}} that you can review at your convenience.</p>
<p>Would you like me to send that over?</p>
<p>Best,<br>{{your_name}}<br>{{your_company}}<br>WhatsApp: {{whatsapp}}<br>Portfolio: {{portfolio_link}}</p>`
    },
    // 🔹 6️⃣ Follow-Up #1 (Soft Reminder – Premium)
    // Note: Use 'HAS_WEBSITE' or 'WEAK_WEBSITE' or make it general. 
    // Since our system pulls by category, we might need multiple copies or a fallback.
    // For now, I'll add it as a separate template but maybe we need a specific type?
    // Actually, the system pulls "Followup 1" based on order or type. 
    // Let's rely on the cron.js logic which seems to pull by category. 
    // Wait, cron.js pulls templates by 'category'.
    // "const templateId = templateMap[lead.category] || templates[0]?._id;"
    // This means there logic for "Followup templates" is weak in the current backend.
    // It re-uses the SAME template category for followups?
    // Let's look at cron.js again.
    /*
      const templates = await EmailTemplate.find({ campaignId: campaign._id });
      const templateMap = {};
      templates.forEach(t => { templateMap[t.category] = t._id; });
      ...
      const templateId = templateMap[lead.category] || templates[0]?._id;
    */
    // YES. Current cron.js logic creates Followup jobs but uses the SAME template ID as the initial email effectively (mapped by category).
    // This is a BUG/LIMITATION. The user provided specific Followup templates.
    // I need to support "Followup Template 1" and "Followup Template 2".
    // I should add `type` or `stage` to EmailTemplate or just create them with unique categories like 'FOLLOWUP_1', 'FOLLOWUP_2'
    // BUT the cron logic maps `lead.category` directly to `template.category`.
    // I need to modify `cron.js` to support dedicated followup templates.

    // STRATEGY: 
    // 1. Insert these templates with special categories: 'FOLLOWUP_1', 'FOLLOWUP_2', 'AUTHORITY', etc.
    // 2. Update cron.js to look for 'FOLLOWUP_1' template when creating `FOLLOWUP_1_EMAIL` job.
];

// Special Templates (Followups etc)
const specialTemplates = [
    {
        name: 'Follow-Up #1 (Soft Reminder)',
        category: 'FOLLOWUP_1',
        subjectTemplate: 'Re: {{company_name}}',
        bodyTemplate: `<p>Hi {{company_name}} Team,</p>
<p>Just following up on my earlier note in case it got buried.</p>
<p>I reached out because I genuinely believe {{company_name}} has strong potential to improve online performance with a few focused adjustments — especially in how visitors move through {{website}}.</p>
<p>No rush at all — I know inboxes get busy.</p>
<p>If now isn’t the right time, feel free to let me know.
And if it is, I’d be happy to share a short, practical overview with no obligation.</p>
<p>Would it make sense to continue the conversation?</p>
<p>Warm regards,<br>{{your_name}}<br>{{your_company}}<br>WhatsApp: {{whatsapp}}<br>Portfolio: {{portfolio_link}}</p>
<p><small>Reply STOP to opt out.</small></p>`
    },
    {
        name: 'Follow-Up #2 (Final Touch)',
        category: 'FOLLOWUP_2',
        subjectTemplate: 'Last attempt regarding {{company_name}}',
        bodyTemplate: `<p>Hello {{company_name}} Team,</p>
<p>I don’t want to be a distraction, so this will be my last follow-up.</p>
<p>I originally reached out because I saw genuine opportunities for {{company_name}} to strengthen its digital presence and conversion performance.</p>
<p>If this isn’t a priority right now, no worries at all — just let me know and I’ll happily close the loop.</p>
<p>And if you’re still open to a short conversation, I’d love to share a few tailored ideas.</p>
<p>Either way, wishing you continued success.</p>
<p>Best regards,<br>{{your_name}}<br>{{your_company}}<br>WhatsApp: {{whatsapp}}<br>Portfolio: {{portfolio_link}}</p>
<p><small>Reply STOP to opt out.</small></p>`
    },
    // Adding optional ones as 'GENERAL' or specific angles
    {
        name: 'Authority Angle',
        category: 'AUTHORITY',
        subjectTemplate: 'Case study for {{industry}}',
        bodyTemplate: `<p>Hi {{company_name}} Team,</p>
<p>We recently worked with a business in {{industry}} that had a strong product but struggled to convert website visitors into inquiries.</p>
<p>After a few focused UX and content improvements, they saw measurable increases in engagement and lead quality within weeks.</p>
<p>When reviewing {{website}}, I noticed {{company_name}} has a similar growth opportunity.</p>
<p>If you’re interested, I’d be happy to share what worked in that case and how it could apply to your business.</p>
<p>No pressure — just insights you can decide to use or ignore.</p>
<p>Would that be helpful?</p>
<p>Kind regards,<br>{{your_name}}<br>{{your_company}}<br>WhatsApp: {{whatsapp}}<br>Portfolio: {{portfolio_link}}</p>
<p><small>Reply STOP to opt out.</small></p>`
    },
    {
        name: 'Decision-Maker Style (Executive Tone)',
        category: 'EXECUTIVE',
        subjectTemplate: 'Observation regarding {{company_name}}',
        bodyTemplate: `<p>Hello {{company_name}} Team,</p>
<p>I’m reaching out with a brief observation regarding {{company_name}}’s digital presence.</p>
<p>From a strategic perspective, small refinements in website structure and user flow often lead to significant improvements in credibility and lead generation.</p>
<p>At {{your_company}}, we focus on these high-impact adjustments rather than full rebuilds.</p>
<p>If it’s useful, I can summarize a few opportunities I noticed on {{website}} in a short, easy-to-review format.</p>
<p>Would you like me to prepare that?</p>
<p>Best regards,<br>{{your_name}}<br>{{your_company}}<br>WhatsApp: {{whatsapp}}<br>Portfolio: {{portfolio_link}}</p>
<p><small>Reply STOP to opt out.</small></p>`
    },
    {
        name: 'Relationship-First Style (Trust Builder)',
        category: 'RELATIONSHIP',
        subjectTemplate: 'Connection with {{company_name}}',
        bodyTemplate: `<p>Hi {{company_name}} Team,</p>
<p>I’m not writing to sell anything directly — only to connect.</p>
<p>I enjoy following businesses in {{industry}}, and {{company_name}} stood out as a brand with long-term potential.</p>
<p>If you’re ever exploring ways to strengthen your online presence, conversion strategy, or digital positioning, I’d be happy to exchange ideas.</p>
<p>Even a short conversation can often spark useful perspectives.</p>
<p>Would you be open to a quick connection?</p>
<p>Warm regards,<br>{{your_name}}<br>{{your_company}}<br>WhatsApp: {{whatsapp}}<br>Portfolio: {{portfolio_link}}</p>
<p><small>Reply STOP to opt out.</small></p>`
    }
];

const updateTemplates = async () => {
    try {
        await connectDB();
        console.log('MongoDB Connected');

        // Update for all users/campaigns for now, or just the main user
        const campaigns = await Campaign.find({});
        console.log(`Found ${campaigns.length} campaigns to update.`);

        for (const campaign of campaigns) {
            console.log(`Updating campaign: ${campaign.name} (${campaign._id})`);

            // Delete existing templates
            await EmailTemplate.deleteMany({ campaignId: campaign._id });
            console.log('  - Deleted old templates');

            // Insert new templates
            const templatesToCreate = [
                ...premiumTemplates,
                ...specialTemplates
            ].map(t => ({
                ...t,
                campaignId: campaign._id
            }));

            await EmailTemplate.insertMany(templatesToCreate);
            console.log(`  - Inserted ${templatesToCreate.length} new Premium templates`);
        }

        console.log('All campaigns updated with Premium templates.');
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

updateTemplates();
