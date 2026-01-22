import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Job from '../models/Job.js';
import Campaign from '../models/Campaign.js';
import Lead from '../models/Lead.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const diagnose = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected');

        // 1. Check Active Campaigns and Windows
        const campaigns = await Campaign.find({ status: 'active' });
        const now = new Date();
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();
        const currentTimeVal = currentHour * 60 + currentMinute;

        console.log(`\n--- Current Server Time: ${now.toLocaleTimeString()} ---`);

        for (const c of campaigns) {
            console.log(`\nCampaign: ${c.name} (ID: ${c._id})`);

            // Parse Window
            const [startH, startM] = c.sendingWindowStart.split(':').map(Number);
            const [endH, endM] = c.sendingWindowEnd.split(':').map(Number);
            const startVal = startH * 60 + startM;
            const endVal = endH * 60 + endM;

            const isOpen = currentTimeVal >= startVal && currentTimeVal < endVal;

            console.log(`  Window: ${c.sendingWindowStart} - ${c.sendingWindowEnd}`);
            console.log(`  Window Open? ${isOpen ? 'YES' : 'NO'} (Current: ${currentHour}:${currentMinute})`);

            // ID check

            // 2. Check Jobs for this Campaign
            const pendingJobs = await Job.find({ campaignId: c._id, status: 'PENDING' });
            console.log(`  Pending Jobs: ${pendingJobs.length}`);

            if (pendingJobs.length > 0) {
                console.log('  Next 3 Jobs:');
                pendingJobs.slice(0, 3).forEach(j => {
                    const waitTime = Math.round((j.runAt - now) / 1000 / 60);
                    console.log(`    - RunAt: ${j.runAt.toLocaleTimeString()} (${waitTime} mins from now)`);
                });
            }

            // 3. Check Failed Jobs
            const failedJobs = await Job.find({ campaignId: c._id, status: 'FAILED' }).limit(3);
            if (failedJobs.length > 0) {
                console.log('  Recent Failures:');
                failedJobs.forEach(j => console.log(`    - Err: ${j.lastError}`));
            }
        }

    } catch (error) {
        console.error(error);
    } finally {
        await mongoose.disconnect();
    }
};

diagnose();
