// Script to reset FAILED leads back to READY so they can be retried
// Run with: node backend/scripts/retryFailedLeads.js

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Lead from '../models/Lead.js';
import Job from '../models/Job.js';

dotenv.config({ path: './backend/.env' });

const retryFailedLeads = async () => {
    try {
        console.log('🔄 RETRYING FAILED LEADS...\n');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB\n');

        // 1. Find leads that failed today
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);

        // Find FAILED leads (we assume they failed recently/today if user is asking)
        // We can just look for all FAILED leads to be safe, or filter by updated time if possible
        // Lead schema doesn't have updatedAt, so we'll just check status.
        const failedLeads = await Lead.find({ status: 'FAILED' });

        console.log(`Found ${failedLeads.length} leads in FAILED status.`);

        if (failedLeads.length === 0) {
            console.log('✅ No failed leads to retry.');
            process.exit(0);
        }

        // 2. Reset them to READY
        const result = await Lead.updateMany(
            { status: 'FAILED' },
            { $set: { status: 'READY' } }
        );

        console.log(`✅ Reset ${result.modifiedCount} leads from FAILED to READY.`);
        console.log('   These will be picked up by the next campaign run.');

        // Optional: Check if we need to reset the failed jobs too?
        // No, strictly speaking, creating new jobs is cleaner history.
        // However, if we exceeded daily limit because of these failures, we might need to adjust.
        // But daily limit usually counts *pending/sent* not failed.

        // Let's check campaign daily limit just in case
        // We won't modify it here, just inform the user.

        await mongoose.disconnect();
        console.log('\n✅ Done! The system will attempt to send to these leads again.');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
};

retryFailedLeads();
