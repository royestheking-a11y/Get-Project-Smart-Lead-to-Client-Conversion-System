import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Campaign from '../models/Campaign.js';
import EmailTemplate from '../models/EmailTemplate.js';
import User from '../models/User.js';
import { connectDB } from '../config/database.js';

dotenv.config();

const defaultTemplates = [
    {
        name: 'Value First Cold Outreach',
        category: 'NO_WEBSITE',
        subjectTemplate: 'Idea for {{companyName}}',
        bodyTemplate: `<p>Hi,</p><p>I found {{companyName}} and had an idea on how you could improve your outreach.</p><p>Worth a chat?</p><p>Best,<br>{{senderName}}</p>`
    },
    {
        name: 'Website Audit Teaser',
        category: 'WEAK_WEBSITE',
        subjectTemplate: 'Quick feedback on your site',
        bodyTemplate: `<p>Hi,</p><p>I noticed a few small issues on your website that might be hurting conversions.</p><p>I recorded a quick 2-min video showing how to fix them. Want me to send it over?</p><p>Best,<br>{{senderName}}</p>`
    },
    {
        name: 'E-commerce Growth',
        category: 'ECOMMERCE',
        subjectTemplate: 'Scaling {{companyName}}',
        bodyTemplate: `<p>Hi,</p><p>Love what you're doing with {{companyName}}. I saw you're using Shopify/WooCommerce.</p><p>We help stores like yours add 15% revenue in 30 days.</p><p>Open to a case study?</p><p>Best,<br>{{senderName}}</p>`
    },
    {
        name: 'Quick Question Opener',
        category: 'HAS_WEBSITE',
        subjectTemplate: 'Question about {{companyName}}',
        bodyTemplate: `<p>Hi,</p><p>Are you currently looking for help with [Service]?</p><p>I have a few ideas that could help {{companyName}} stand out.</p><p>Thanks,</p>`
    },
    {
        name: 'SEO Visibility Follow-up',
        category: 'SEO_WEAK',
        subjectTemplate: 'Lost traffic opportunity',
        bodyTemplate: `<p>Hi,</p><p>I noticed {{companyName}} isn't ranking for some key terms in your industry.</p><p>We could fix this quickly.</p><p>Let me know if you'd like to see the keyword list.</p>`
    }
];

const provisionTemplates = async () => {
    try {
        await connectDB();
        console.log('MongoDB Connected');

        // Find user
        const user = await User.findOne({ email: 'sunny@gmail.com' });
        if (!user) {
            console.log('User not found');
            process.exit(1);
        }

        const campaigns = await Campaign.find({ userId: user._id });
        console.log(`Checking ${campaigns.length} campaigns for templates...`);

        for (const campaign of campaigns) {
            const count = await EmailTemplate.countDocuments({ campaignId: campaign._id });
            if (count === 0) {
                console.log(`Provisioning templates for: ${campaign.name} (${campaign._id})`);

                const templatesToCreate = defaultTemplates.map(t => ({
                    ...t,
                    campaignId: campaign._id
                }));

                await EmailTemplate.insertMany(templatesToCreate);
                console.log('  -> Added 5 templates');
            } else {
                console.log(`Skipping: ${campaign.name} (Has ${count} templates)`);
            }
        }

        console.log('Done.');
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

provisionTemplates();
