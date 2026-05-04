import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Campaign from '../models/Campaign.js';
import EmailTemplate from '../models/EmailTemplate.js';
import User from '../models/User.js';
import { connectDB } from '../config/database.js';

dotenv.config();

const defaultTemplates = [
    {
        name: 'Premium: Retail / Shops',
        category: 'RETAIL',
        subjectTemplate: 'Boost your business presence: {{Business Name}}',
        bodyTemplate: `Hello {{Owner Name}},
I came across {{Business Name}} and noticed that your business has strong potential to attract more customers online.
Many local shops lose customers because they either do not have a professional website, or their current online presence does not clearly show their products, location, offers, and contact options in a user-friendly way.
We specialize in building complete digital presences.
We are currently offering a **20% discount** + a **free demo preview**.
Would you like us to send a free demo concept for {{Business Name}}?
Best regards,
Rizqara Tech`
    },
    {
        name: 'Premium: Restaurant / Cafe',
        category: 'RESTAURANT',
        subjectTemplate: 'Digital Growth for {{Business Name}}',
        bodyTemplate: `Hello {{Owner Name}},
I found {{Business Name}} online and wanted to reach out with a simple idea.
For restaurants, cafes, and takeaways, a professional website and online ordering system can make a big difference.
We offer a **20% discount** and can prepare a **free demo design** for {{Business Name}} first.
Would you be open to seeing a free demo concept?
Best regards,
Rizqara Tech`
    },
    {
        name: 'Premium: Salon / Beauty',
        category: 'SALON',
        subjectTemplate: 'Professional Online Presence for {{Business Name}}',
        bodyTemplate: `Hello {{Owner Name}},
I came across {{Business Name}} and noticed that your services could look even more professional online.
We provide premium salon websites and booking systems.
We are currently offering a **20% discount**.
Before starting, we can create a **free demo preview** for your business.
Would you like us to prepare a free demo for {{Business Name}}?
Best regards,
Rizqara Tech`
    },
    {
        name: 'Premium: Healthcare / Clinic',
        category: 'HEALTHCARE',
        subjectTemplate: 'Digital Solutions for {{Business Name}}',
        bodyTemplate: `Hello {{Owner Name}},
I found {{Business Name}} online and wanted to share a professional idea.
In healthcare, trust is very important. A professional website helps patients understand your services and book appointments easily.
We are currently offering a **20% discount** and a **free demo preview**.
Would you like us to prepare a free demo concept for {{Business Name}}?
Best regards,
Rizqara Tech`
    },
    {
        name: 'Premium: General / E-commerce',
        category: 'GENERAL',
        subjectTemplate: 'Grow {{Business Name}} with Rizqara Tech',
        bodyTemplate: `Hello {{Owner Name}},
I came across {{Business Name}} and wanted to reach out from **Rizqara Tech**.
We help businesses build a strong digital presence through modern websites, custom software, and SEO.
We are currently offering a **20% discount** and a **free demo preview**.
Would you like us to send a free demo idea for {{Business Name}}?
Best regards,
Rizqara Tech`
    },
    {
        name: 'Premium: SEO Audit',
        category: 'SEO',
        subjectTemplate: 'SEO Growth for {{Business Name}}',
        bodyTemplate: `Hello {{Owner Name}},
I came across {{Business Name}} and noticed that your business has strong potential to get more customers from Google.
We help businesses improve their online visibility through professional SEO and digital growth strategies.
We are currently offering a **20% discount** and a **free SEO audit/demo report**.
Would you like us to prepare a free SEO audit for your business?
Best regards,
Rizqara Tech`
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
