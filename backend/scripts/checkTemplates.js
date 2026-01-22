import mongoose from 'mongoose';
import dotenv from 'dotenv';
import EmailTemplate from '../models/EmailTemplate.js';
import Campaign from '../models/Campaign.js';

dotenv.config();

const checkTemplates = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const campaigns = await Campaign.find({});
        console.log(`Found ${campaigns.length} campaigns.`);

        for (const campaign of campaigns) {
            console.log(`\nCampaign: ${campaign.name} (${campaign._id})`);
            const templates = await EmailTemplate.find({ campaignId: campaign._id });

            const categories = {};
            templates.forEach(t => {
                categories[t.category] = t.name;
                console.log(`  - [${t.category}] ${t.name}`);
            });

            if (!categories['FOLLOWUP_1']) console.error('  ⚠️ MISSING FOLLOWUP_1 TEMPLATE');
            if (!categories['FOLLOWUP_2']) console.error('  ⚠️ MISSING FOLLOWUP_2 TEMPLATE');
        }

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

checkTemplates();
