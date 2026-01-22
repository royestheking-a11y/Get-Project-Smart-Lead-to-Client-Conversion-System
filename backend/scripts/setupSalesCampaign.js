import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Campaign from '../models/Campaign.js';
import Lead from '../models/Lead.js';
import EmailTemplate from '../models/EmailTemplate.js';
import { connectDB } from '../config/database.js';

dotenv.config();

const setupSalesCampaign = async () => {
    try {
        await connectDB();
        console.log('MongoDB Connected\n');

        // Find campaigns
        const generalCampaign = await Campaign.findOne({ name: 'General Outreach' });
        const salesCampaign = await Campaign.findOne({ name: 'sales' });

        if (!generalCampaign || !salesCampaign) {
            console.error('Campaigns not found!');
            process.exit(1);
        }

        console.log('Moving leads from General Outreach to sales...');

        // Move all leads to sales campaign
        const leadUpdate = await Lead.updateMany(
            { campaignId: generalCampaign._id },
            { $set: { campaignId: salesCampaign._id } }
        );

        console.log(`✅ Moved ${leadUpdate.modifiedCount} leads to sales campaign\n`);

        // Check if sales campaign has templates
        const existingTemplates = await EmailTemplate.find({ campaignId: salesCampaign._id });

        if (existingTemplates.length > 0) {
            console.log(`ℹ️  Sales campaign already has ${existingTemplates.length} templates`);
            process.exit(0);
        }

        console.log('Creating email templates for sales campaign...');

        const templates = [
            {
                campaignId: salesCampaign._id,
                name: 'Value First Cold Outreach',
                category: 'NO_WEBSITE',
                subjectTemplate: 'Quick win for {{company_name}}?',
                bodyTemplate: `Hi there,

I noticed {{company_name}} doesn't have a website yet. I help businesses like yours establish a strong online presence.

Would you be open to a quick chat about how a professional website could help you reach more customers?

Best regards,
{{your_name}}
{{your_company}}`
            },
            {
                campaignId: salesCampaign._id,
                name: 'Website Audit Teaser',
                category: 'HAS_WEBSITE',
                subjectTemplate: 'Noticed something about {{company_name}}\'s website',
                bodyTemplate: `Hi,

I came across {{website}} and was impressed by {{company_name}}.

I noticed a few opportunities that could help you convert more visitors. Would you be interested in a free, no-strings-attached audit?

Cheers,
{{your_name}}`
            },
            {
                campaignId: salesCampaign._id,
                name: 'E-commerce Growth',
                category: 'ECOMMERCE',
                subjectTemplate: 'Growing {{company_name}}\'s online sales',
                bodyTemplate: `Hello,

I help e-commerce businesses like {{company_name}} increase their conversion rates.

Quick question: Are you currently using A/B testing on your product pages?

Let me know if you'd like to explore strategies to boost your sales.

Best,
{{your_name}}`
            },
            {
                campaignId: salesCampaign._id,
                name: 'Quick Question Opener',
                category: 'WEAK_WEBSITE',
                subjectTemplate: 'Quick question about {{company_name}}',
                bodyTemplate: `Hi,

Love what {{company_name}} is doing in {{industry}}!

I noticed your website could use some updates. Are you planning any website improvements in the near future?

I'd love to share some ideas.

Thanks,
{{your_name}}`
            },
            {
                campaignId: salesCampaign._id,
                name: 'SEO Visibility Follow-up',
                category: 'SEO_WEAK',
                subjectTemplate: 'Helping {{company_name}} get found online',
                bodyTemplate: `Hello,

I searched for services in {{industry}} in {{location}} and noticed {{company_name}} wasn't on the first page.

I specialize in helping businesses improve their local search visibility. Would you be interested in learning more?

Best regards,
{{your_name}}
{{your_company}}`
            }
        ];

        await EmailTemplate.insertMany(templates);
        console.log(`✅ Created ${templates.length} email templates for sales campaign\n`);

        // Summary
        const leads = await Lead.find({ campaignId: salesCampaign._id });
        const temps = await EmailTemplate.find({ campaignId: salesCampaign._id });

        console.log('=== SALES CAMPAIGN SUMMARY ===');
        console.log(`Leads: ${leads.length}`);
        console.log(`Templates: ${temps.length}`);
        console.log(`Status: ${salesCampaign.status}`);
        console.log('\n✅ Sales campaign is ready to send!');

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

setupSalesCampaign();
