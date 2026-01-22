import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Campaign from '../models/Campaign.js';
import User from '../models/User.js';
import EmailTemplate from '../models/EmailTemplate.js';
import Lead from '../models/Lead.js';
import { connectDB } from '../config/database.js';

dotenv.config();

const debugCampaigns = async () => {
    try {
        await connectDB();
        console.log('MongoDB Connected');

        const campaigns = await Campaign.find({});

        for (const c of campaigns) {
            const user = await User.findById(c.userId);
            if (user?.email !== 'sunny@gmail.com') continue;

            const templateCount = await EmailTemplate.countDocuments({ campaignId: c._id });
            const leadCount = await Lead.countDocuments({ campaignId: c._id });
            const readyLeads = await Lead.countDocuments({ campaignId: c._id, status: 'READY' });

            console.log(`Campaign: "${c.name}" (${c.status})`);
            console.log(`- ID: ${c._id}`);
            console.log(`- Templates: ${templateCount}`);
            console.log(`- Total Leads: ${leadCount}`);
            console.log(`- Ready Leads: ${readyLeads}`);

            if (templateCount === 0) {
                console.log('  [WARNING] No templates found! Emails cannot be sent.');
            }
            if (readyLeads === 0 && leadCount > 0) {
                console.log('  [WARNING] Leads exist but none are READY.');
            }
            console.log('---');
        }

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

debugCampaigns();
