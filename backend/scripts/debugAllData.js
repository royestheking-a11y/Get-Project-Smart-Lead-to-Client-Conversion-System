import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Campaign from '../models/Campaign.js';
import Lead from '../models/Lead.js';
import EmailTemplate from '../models/EmailTemplate.js';
import { connectDB } from '../config/database.js';

dotenv.config();

const debugAllData = async () => {
    try {
        await connectDB();
        console.log('MongoDB Connected\n');

        // Check all users
        const users = await User.find({});
        console.log('=== USERS ===');
        users.forEach(u => {
            console.log(`- ${u.email} (ID: ${u._id})`);
        });

        // Check all campaigns
        const campaigns = await Campaign.find({});
        console.log('\n=== CAMPAIGNS ===');
        for (const c of campaigns) {
            const user = await User.findById(c.userId);
            console.log(`- ${c.name} (ID: ${c._id})`);
            console.log(`  Owner: ${user ? user.email : 'UNKNOWN'}`);
            console.log(`  Status: ${c.status}`);
        }

        // Check all leads
        const leads = await Lead.find({});
        console.log('\n=== LEADS ===');
        console.log(`Total: ${leads.length}`);
        for (const l of leads) {
            const campaign = await Campaign.findById(l.campaignId);
            console.log(`- ${l.email} → Campaign: ${campaign ? campaign.name : 'MISSING'} (${l.campaignId})`);
        }

        // Check all templates
        const templates = await EmailTemplate.find({});
        console.log('\n=== EMAIL TEMPLATES ===');
        console.log(`Total: ${templates.length}`);

        // Group by campaign
        const templatesByCampaign = {};
        for (const t of templates) {
            if (!templatesByCampaign[t.campaignId]) {
                templatesByCampaign[t.campaignId] = [];
            }
            templatesByCampaign[t.campaignId].push(t);
        }

        for (const [campaignId, temps] of Object.entries(templatesByCampaign)) {
            const campaign = await Campaign.findById(campaignId);
            console.log(`\nCampaign: ${campaign ? campaign.name : 'MISSING'} (${campaignId})`);
            console.log(`Templates: ${temps.length}`);
            temps.forEach(t => {
                console.log(`  - ${t.name} (${t.category})`);
            });
        }

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

debugAllData();
