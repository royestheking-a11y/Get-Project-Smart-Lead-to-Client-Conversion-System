// Deep dive debug script
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Lead from '../models/Lead.js';
import EmailLog from '../models/EmailLog.js';
import Job from '../models/Job.js';
import Campaign from '../models/Campaign.js';

dotenv.config({ path: './backend/.env' });

const debug = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // 1. Inspect READY Leads
        console.log('\n=== INSPECTING READY LEADS ===');
        const readyLeads = await Lead.find({ status: 'READY' });
        if (readyLeads.length === 0) console.log('No READY leads found.');

        for (const lead of readyLeads) {
            console.log(`\nLead ID: ${lead._id}`);
            console.log(`Email: "${lead.email}" (Type: ${typeof lead.email})`);
            console.log(`Campaign: ${lead.campaignId}`);
            console.log(`DoNotContact: ${lead.doNotContact}`);

            // Check if jobs exist for this lead today
            const jobs = await Job.find({ leadId: lead._id });
            console.log(`Jobs for this lead: ${jobs.length}`);
            jobs.forEach(j => console.log(`  - ${j.status} (${j.type}) Attempts: ${j.attempts}`));
        }

        // 2. Inspect Failed EmailLogs
        console.log('\n=== INSPECTING FAILED LOGS WITH UNDEFINED RECIPIENT ===');
        const badLogs = await EmailLog.find({ recipient: { $exists: false } }).limit(5);
        const badLogs2 = await EmailLog.find({ recipient: null }).limit(5);
        const recentFailed = await EmailLog.find({ status: 'failed' }).sort({ sentAt: -1 }).limit(5);

        console.log('Recent failed logs details:');
        for (const log of recentFailed) {
            console.log(`\nLog ID: ${log._id}`);
            console.log(`Recipient: "${log.recipient}"`);
            console.log(`Error: "${log.error}"`);
            console.log(`Lead ID: ${log.leadId}`);

            if (log.leadId) {
                const l = await Lead.findById(log.leadId);
                console.log(`Associated Lead found: ${l ? 'YES' : 'NO'}`);
                if (l) console.log(`Lead Email: ${l.email}`);
            }
        }

        // 3. Check Campaign Limits
        console.log('\n=== CHECKING CAMPAIGN LIMITS ===');
        const campaigns = await Campaign.find({ status: 'active' });
        for (const c of campaigns) {
            console.log(`Campaign: ${c.name}`);
            // Count jobs today
            const todayStart = new Date();
            todayStart.setHours(0, 0, 0, 0);
            const jobsToday = await Job.countDocuments({
                campaignId: c._id,
                createdAt: { $gte: todayStart }
            });
            console.log(`Jobs created today: ${jobsToday}`);
            console.log(`Daily Limit: ${c.dailyLimit}`);
            console.log(`Remaining capacity: ${c.dailyLimit - jobsToday}`);
        }

        await mongoose.disconnect();
    } catch (error) {
        console.error(error);
    }
};

debug();
