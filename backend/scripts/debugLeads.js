import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Lead from '../models/Lead.js';
import Campaign from '../models/Campaign.js';
import User from '../models/User.js';
import { connectDB } from '../config/database.js';

dotenv.config();

const debugLeads = async () => {
    try {
        await connectDB();
        console.log('MongoDB Connected');

        const users = await User.find({});
        console.log(`\nUsers found: ${users.length}`);
        users.forEach(u => console.log(`- ${u.email} (ID: ${u._id})`));

        const campaigns = await Campaign.find({});
        console.log(`\nCampaigns found: ${campaigns.length}`);
        campaigns.forEach(c => console.log(`- ${c.name} (ID: ${c._id}) -> Owner: ${c.userId}`));

        const leads = await Lead.find({});
        console.log(`\nLeads found: ${leads.length}`);

        for (const l of leads) {
            const campaign = await Campaign.findById(l.campaignId);
            console.log(`Lead: ${l.email}`);
            console.log(`  ID: ${l._id}`);
            console.log(`  Campaign: ${campaign ? campaign.name : 'UNKNOWN'} (${l.campaignId})`);
            console.log(`  Campaign Owner: ${campaign ? campaign.userId : 'N/A'}`);
            console.log('---');
        }

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

debugLeads();
