import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../.env') });

import Campaign from '../models/Campaign.js';
import Job from '../models/Job.js';

const fixRender = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // 1. Set all campaigns to 24/7 sending window to avoid UTC mismatches
        const result = await Campaign.updateMany(
            {}, 
            { 
                sendingWindowStart: '00:00', 
                sendingWindowEnd: '23:59',
                status: 'active' 
            }
        );
        console.log(`✅ Updated ${result.modifiedCount} campaigns to 24/7 sending window.`);

        // 2. Reset any jobs scheduled for the future to "now" so they run immediately
        const now = new Date();
        const jobResult = await Job.updateMany(
            { status: 'PENDING', runAt: { $gt: now } },
            { runAt: now }
        );
        console.log(`✅ Updated ${jobResult.modifiedCount} future jobs to run immediately.`);

        await mongoose.disconnect();
        console.log('\n🚀 Render Fix Applied! Your emails should start sending in the next 1-2 minutes.');
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

fixRender();
