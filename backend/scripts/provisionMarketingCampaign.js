import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Campaign from '../models/Campaign.js';
import EmailTemplate from '../models/EmailTemplate.js';
import { connectDB } from '../config/database.js';

dotenv.config();

const provisionMarketingCampaign = async () => {
    try {
        await connectDB();
        console.log('MongoDB Connected\n');

        const marketingCampaign = await Campaign.findOne({ name: 'marketing' });

        if (!marketingCampaign) {
            console.error('Marketing campaign not found!');
            process.exit(1);
        }

        console.log('Creating email templates for marketing campaign...');

        const templates = [
            {
                campaignId: marketingCampaign._id,
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
                campaignId: marketingCampaign._id,
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
                campaignId: marketingCampaign._id,
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
                campaignId: marketingCampaign._id,
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
                campaignId: marketingCampaign._id,
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
        console.log(`✅ Created ${templates.length} email templates`);

        console.log('\n=== MARKETING CAMPAIGN ===');
        console.log(`Name: ${marketingCampaign.name}`);
        console.log(`Status: ${marketingCampaign.status}`);
        console.log(`Templates: 5`);
        console.log(`Leads: 0 (ready to import)`);

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

provisionMarketingCampaign();
